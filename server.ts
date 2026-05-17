import OpenAI from "openai";
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as xlsx from 'xlsx';
import Papa from 'papaparse';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { spawn } from "child_process";
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { SEO_PAGES, renderSeoPage } from './src/seo/seo-pages';

// Load environment variables
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config();
}

// ============================================================
// OPENAI CLIENTS (Multi-provider AI router)
// ============================================================

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1"
});

// ============================================================
// UNIFIED MULTI-PROVIDER AI ROUTER
// ============================================================

const AI_PROVIDER_TIMEOUT_MS = 12000;

type AIClient = {
  chat: {
    completions: {
      create: (body: { model: string; messages: Array<{ role: string; content: string }> }, options?: { signal?: AbortSignal }) => Promise<any>;
    };
  };
};

async function callProvider(
  label: string,
  client: AIClient,
  model: string,
  prompt: string,
  timeoutMs: number = AI_PROVIDER_TIMEOUT_MS
): Promise<string> {
  console.log(`Trying ${label}...`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await client.chat.completions.create(
      {
        model,
        messages: [{ role: "user", content: prompt }]
      },
      { signal: controller.signal }
    );

    const text = res?.choices?.[0]?.message?.content;
    return typeof text === "string" ? text.trim() : "";
  } finally {
    clearTimeout(timeoutId);
  }
}

async function runAI(messages: any[]): Promise<string> {
  const prompt = messages.map((m: any) => m.content).join("\n");

  try {
    const groqText = await callProvider("Groq", groq as AIClient, "llama-3.1-8b-instant", prompt);
    if (groqText) {
      return groqText;
    }
  } catch (error) {
    console.log("Groq failed, switching...");
  }

  try {
    const deepSeekText = await callProvider("DeepSeek", deepseek as AIClient, "deepseek-chat", prompt);
    if (deepSeekText) {
      return deepSeekText;
    }
  } catch (error) {
    console.log("DeepSeek failed");
  }

  console.log("All providers failed");
  throw new Error("All AI providers failed");
}

// Load Firebase Config safely
let firebaseConfig: any = {};
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
if (fs.existsSync(configPath)) {
  firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// Initialize Firebase Admin
try {
  if (getApps().length === 0 && firebaseConfig?.projectId) {
    initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }
} catch (e) {
  console.log("Firebase init skipped");
}
const app = express();
app.use(compression());
const PORT = parseInt(process.env.PORT || "3000");
// ============================================================
// AUTH MIDDLEWARE
// ============================================================

/** Extracts and verifies Firebase ID token, attaches decoded user to req */
const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (getApps().length === 0) {
    return res.status(503).json({ error: "Authentication service unavailable" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    (req as any).user = decodedToken;
    (req as any).userId = decodedToken.uid;
    next();
  } catch (error) {
    console.error("Firebase auth error:", error);
    res.status(401).json({ error: "Invalid identity token" });
  }
};

/** Verifies admin status (uses custom claims or email fallback) */
const verifyAdmin = async (req: express.Request, res: Response, next: express.NextFunction) => {
  if (getApps().length === 0) {
    return res.status(503).json({ error: "Authentication service unavailable" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);

    // Check custom claims first, fall back to email check
    const isAdmin = decodedToken.admin === true || decodedToken.email === 'muhammadnaveedalijatt786@gmail.com';

    if (!isAdmin) {
      return res.status(403).json({ error: "Unauthorized. Admin privileges required." });
    }

    (req as any).user = decodedToken;
    (req as any).userId = decodedToken.uid;
    next();
  } catch (error) {
    console.error("Firebase admin auth error:", error);
    res.status(401).json({ error: "Invalid identity token" });
  }
};

// File upload with size limit (50MB max)
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }
});

// In-memory state (Simulating a database)
interface Dataset {
  id: string;
  name: string;
  rows: number;
  columns: number;
  schema: any[];
  preview: any[];
  createdAt: string;
  userId?: string;
  filePath?: string;
}

interface AnalysisRecord {
  id: string;
  query: string;
  datasetId: string;
  datasetName: string;
  result: any;
  timestamp: string;

  userId?: string;
}

// ============================================================
// PERSISTENT STORAGE
// ============================================================
const DATA_DIR = path.join(process.cwd(), '.data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const DATASETS_FILE = path.join(DATA_DIR, 'datasets.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load data from persistent storage
function loadHistoryData(): AnalysisRecord[] {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
  return [];
}

function loadDatasetsData(): Dataset[] {
  try {
    if (fs.existsSync(DATASETS_FILE)) {
      const data = fs.readFileSync(DATASETS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading datasets:', error);
  }
  return [];
}

// Save data to persistent storage
function saveHistoryData(history: AnalysisRecord[]) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Error saving history:', error);
  }
}

function saveDatasetsData(datasets: Dataset[]) {
  try {
    fs.writeFileSync(DATASETS_FILE, JSON.stringify(datasets, null, 2));
  } catch (error) {
    console.error('Error saving datasets:', error);
  }
}

const db = {
  datasets: loadDatasetsData(),
  history: loadHistoryData(),
  settings: {
    theme: 'dark',
    model: 'gemini-2.5-flash',
    autoLoad: true
  }
};

async function startServer() {
  console.log("📝 Setting up Express middleware...");

  app.use(express.json({ limit: '10mb' }));

  // ============================================================
  // RATE LIMITING
  // ============================================================
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
  });
  app.use('/api/', apiLimiter);

  // Serve uploads directory with Content-Disposition to prevent XSS
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  }, express.static(path.join(process.cwd(), 'uploads')));

  // Create uploads directory if it doesn't exist
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

  // ============================================================
  // API CHAT ENDPOINT
  // ============================================================

  // Temporary debug endpoint — enable by setting ENABLE_DEBUG_CHAT=true in the service environment.
  // This endpoint bypasses authentication and returns any provider error details to help debugging.
  if (process.env.ENABLE_DEBUG_CHAT === 'true') {
    app.post("/api/debug-chat", async (req, res) => {
      try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
          return res.status(400).json({ error: "messages array required" });
        }

        try {
          const text = await runAI(messages);
          return res.json({ text });
        } catch (err: any) {
          console.error("Debug AI Error:", err);
          // Surface error details for debugging only
          return res.status(500).json({ error: "AI generation failed", details: err?.message || String(err) });
        }

      } catch (err) {
        console.error("Debug endpoint error:", err);
        res.status(500).json({ error: "Debug endpoint failed", details: String(err) });
      }
    });
  }

  app.post("/api/chat", verifyAuth, async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "messages array required" });
      }
      const text = await runAI(messages);
      res.json({ text });
    } catch (error: any) {
      console.error("AI Router Error:", error);
      res.status(500).json({ error: "AI generation failed", details: error.message });
    }
  });

  app.post("/api/chat/stream", verifyAuth, async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "messages array required" });
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // For now, we simulate streaming by sending the full response as one chunk
      // to fix the 404 and "Unknown error".
      const text = await runAI(messages);

      const chunk = JSON.stringify({ text });
      res.write(`data: ${chunk}\n\n`);
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      console.error("AI Stream Error:", error);
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  });

  // ============================================================
  // PROFILE IMAGE UPLOAD (with real token verification)
  // ============================================================
  app.post("/api/user/profile-image", verifyAuth, upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Validate it's actually an image
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (req.file.mimetype && !allowedTypes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Invalid file type. Only images allowed." });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  });

  // ============================================================
  // PYTHON BACKEND (Windows-compatible)
  // ============================================================


  // Proxy to Python FastAPI backend
  app.use('/api/python', createProxyMiddleware({
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
    pathRewrite: {
      '^/api/python': '/api/python', // Keep the path prefix
    },
    on: {
      error: (err: any, req: any, res: any) => {
        console.error('Proxy to Python failed:', err.message);
        if (res && typeof res.headersSent !== 'undefined' && !res.headersSent) {
          (res as express.Response).status(502).json({ error: 'Python analysis engine is offline' });
        }
      }
    }
  }));

  // ============================================================
  // PUBLIC ENDPOINTS
  // ============================================================
  app.get("/api/health", (req, res) => res.json({ status: "ok", node: true }));

  // ============================================================
  // AUTHENTICATED ENDPOINTS
  // ============================================================

  // Dashboard Summary
  app.get("/api/dashboard/summary", verifyAuth, (req, res) => {
    const userId = (req as any).userId;
    res.json({
      totalDatasets: db.datasets.filter(d => !d.userId || d.userId === userId).length,
      totalAnalyses: db.history.filter(h => !h.userId || h.userId === userId).length,
      recentAnalyses: db.history.filter(h => !h.userId || h.userId === userId).slice(-5).reverse(),
      storageUsed: "4.2 MB",
      healthScore: "98%"
    });
  });

  // Datasets - GET (public)
  app.get("/api/datasets", verifyAuth, (req, res) => {
    const userId = (req as any).userId;
    const userDatasets = db.datasets.filter(d => d.userId === userId);
    res.json(userDatasets);
  });

  // Datasets - DELETE (with ownership check)
  app.delete("/api/datasets/:id", verifyAuth, (req, res) => {
    const userId = (req as any).userId;
    const dataset = db.datasets.find(d => d.id === req.params.id);

    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found" });
    }
    if (dataset.userId && dataset.userId !== userId) {
      return res.status(403).json({ error: "You can only delete your own datasets" });
    }

    db.datasets = db.datasets.filter(d => d.id !== req.params.id);
    saveDatasetsData(db.datasets);
    res.json({ success: true });
  });

  // History - GET (requires auth, filters by userId)
  app.get("/api/history", verifyAuth, (req, res) => {
    const userId = (req as any).userId;
    const userHistory = db.history.filter(h => h.userId === userId);
    res.json(userHistory);
  });

  // History - POST
  app.post("/api/history", verifyAuth, (req, res) => {
    const userId = (req as any).userId;
    const record: AnalysisRecord = {
      id: Date.now().toString(),
      ...req.body,
      userId,
      timestamp: new Date().toISOString()
    };
    db.history.push(record);
    saveHistoryData(db.history);
    res.json(record);
  });

  // History - DELETE (with ownership check)
  app.delete("/api/history/:id", verifyAuth, (req, res) => {
    const userId = (req as any).userId;
    const index = db.history.findIndex(h => h.id === req.params.id && h.userId === userId);
    if (index !== -1) {
      db.history.splice(index, 1);
      saveHistoryData(db.history);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "History item not found or unauthorized" });
    }
  });

  // File Upload (authenticated)
  app.post("/api/upload", verifyAuth, upload.single('file'), async (req, res) => {
    const userId = (req as any).userId;

    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let data: any[] = [];

    try {
      if (fileExt === '.csv') {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const parsed = Papa.parse(fileContent, { header: true, dynamicTyping: true });
        data = parsed.data;
      } else if (fileExt === '.xlsx' || fileExt === '.xls') {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      } else {
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: "Unsupported file type. Use .csv, .xlsx, or .xls" });
      }

      // We keep the file for Python analysis (Polars/Pandas)

      const columns = Object.keys(data[0] || {});
      const schema = columns.map(col => {
        const sampleValues = data.map(r => r[col]).filter(v => v !== null && v !== undefined);
        return { name: col, type: typeof sampleValues[0], nullCount: data.length - sampleValues.length };
      });

      const newDataset: Dataset = {
        id: Date.now().toString(),
        name: req.file.originalname,
        rows: data.length,
        columns: columns.length,
        schema,
        preview: data.slice(0, 50),
        createdAt: new Date().toISOString(),
        userId,
        filePath: req.file.path
      };

      db.datasets.push(newDataset);
      saveDatasetsData(db.datasets);
      res.json(newDataset);

    } catch (err) {
      console.error(err);
      // Clean up file if it still exists
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      res.status(500).json({ error: "Failed to process file" });
    }
  });

  // Settings (authenticated)
  app.get("/api/settings", verifyAuth, (req, res) => res.json(db.settings));
  app.post("/api/settings", verifyAuth, (req, res) => {
    // Only allow known keys
    const allowedKeys = ['theme', 'model', 'autoLoad'];
    const filtered: any = {};
    for (const key of allowedKeys) {
      if (req.body[key] !== undefined) {
        filtered[key] = req.body[key];
      }
    }
    db.settings = { ...db.settings, ...filtered };
    res.json(db.settings);
  });

  // ============================================================
  // ADMIN ROUTES
  // ============================================================
  app.get("/api/admin/stats", verifyAdmin, (req, res) => {
    res.json({
      activeUsers: 1,
      totalDatasets: db.datasets.length,
      storageUsed: "124 MB",
      queriesToday: 42
    });
  });

  app.get("/api/admin/logs", verifyAdmin, (req, res) => {
    res.json([
      { id: '1', event: 'System Start', user: 'System', timestamp: new Date().toISOString() },
      { id: '2', event: 'Internal Guard Active', user: 'Security', timestamp: new Date().toISOString() },
      { id: '3', event: 'Firebase Sync', user: 'System', timestamp: new Date().toISOString() },
    ]);
  });

  // ============================================================
  // SEO LANDING PAGES (server-rendered for Googlebot)
  // ============================================================
  for (const page of SEO_PAGES) {
    app.get(`/${page.slug}`, (req, res) => {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(renderSeoPage(page));
    });
  }

  // ============================================================
  // VITE DEV SERVER
  // ============================================================
  const mode = process.env.NODE_ENV || "development";
  if (mode === "development") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Cache static assets (JS/CSS/Fonts) for 1 year as they are hashed
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '1y',
      immutable: true
    }));
    
    // Serve other static files normally
    // Do not serve sitemap from backend — redirect to frontend-hosted sitemap on Vercel
    app.get('/sitemap.xml', (req, res) => {
      res.redirect(301, 'https://whyanalyst.vercel.app/sitemap.xml');
    });

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

console.log("🚀 Booting application...");

startServer().catch((err) => {
  console.error("❌ Fatal startup error:", err);
  process.exit(1);
});