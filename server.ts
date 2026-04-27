import express from "express";
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

// Load Firebase Config safely
// ... (rest of imports remains)

// Start Python FastAPI server logic moved inside startServer()
let firebaseConfig: any = {};
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
if (fs.existsSync(configPath)) {
  firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// Initialize Firebase Admin
if (getApps().length === 0 && firebaseConfig.projectId) {
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const app = express();
const PORT = 3000;

// Middleware to verify Admin status using Firebase
const verifyAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Check if Firebase Admin is initialized
  if (getApps().length === 0) {
    console.warn("Firebase Admin not initialized. Skipping verification (DEV ONLY) or rejecting.");
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
    
    // Strict email check for admin status
    const isAdmin = decodedToken.email === 'muhammadnaveedalijatt786@gmail.com';

    if (!isAdmin) {
      return res.status(403).json({ error: "Unauthorized. Admin privileges required." });
    }
    
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error("Firebase admin auth error:", error);
    res.status(401).json({ error: "Invalid identity token" });
  }
};
const upload = multer({ dest: 'uploads/' });

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

const db = {
  datasets: [] as Dataset[],
  history: [] as AnalysisRecord[],
  settings: {
    theme: 'dark',
    model: 'gemini-3-flash-preview',
    autoLoad: true
  }
};

async function startServer() {
  app.use(express.json());
  
  // Serve uploads directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Create uploads directory if it doesn't exist
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

  // API: Profile Image Upload
  app.post("/api/user/profile-image", upload.single('image'), async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Return the relative URL
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  });

  // Start Python FastAPI server as a child process (non-blocking)
  const startPythonBackend = () => {
    const tryStartPython = (cmd: string) => {
      console.log(`Checking and installing Python dependencies using ${cmd}...`);
      const install = spawn(cmd, ["-m", "pip", "install", "fastapi", "uvicorn", "pandas", "python-multipart"]);

      install.on("error", (err: any) => {
        if (err.code === 'ENOENT' && cmd === 'python3') {
          console.warn("python3 not found, trying 'python'...");
          tryStartPython('python');
        } else {
          console.error(`Failed to start ${cmd} for pip install:`, err.message);
        }
      });

      install.stdout.on("data", (data) => console.log(`[pip] ${data}`));
      install.stderr.on("data", (data) => console.error(`[pip-error] ${data}`));

      install.on("close", (code) => {
        if (code === 0) {
          console.log(`Python dependencies verified/installed. Starting main.py using ${cmd}...`);
          const pythonProcess = spawn(cmd, ["main.py"]);

          pythonProcess.on("error", (err) => {
            console.error(`Failed to start Python process (${cmd}):`, err.message);
          });

          pythonProcess.stdout.on("data", (data) => console.log(`[Python] ${data}`));
          pythonProcess.stderr.on("data", (data) => console.error(`[Python stderr] ${data}`));
          pythonProcess.on("close", (code) => console.log(`Python process exited with code ${code}`));
        } else if (code !== null) {
          console.error(`Pip installation process exited with code ${code}`);
        }
      });
    };

    try {
      tryStartPython("python3");
    } catch (e) {
      console.error("Critical error starting Python backend:", e);
    }
  };

  startPythonBackend();

  // Proxy to Python FastAPI backend
  app.use('/api/python', createProxyMiddleware({
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error('Proxy to Python failed:', err.message);
        if (res instanceof express.response.constructor) {
          (res as express.Response).status(502).json({ error: 'Python analysis engine is offline' });
        }
      }
    }
  }));

  // Health check for Node server
  app.get("/api/health", (req, res) => res.json({ status: "ok", node: true }));

  // API: Dashboard Summary
  app.get("/api/dashboard/summary", (req, res) => {
    res.json({
      totalDatasets: db.datasets.length,
      totalAnalyses: db.history.length,
      recentAnalyses: db.history.slice(-5).reverse(),
      storageUsed: "4.2 MB", // Mock value
      healthScore: "98%"
    });
  });

  // API: Get Datasets
  app.get("/api/datasets", async (req, res) => {
    const authHeader = req.headers.authorization;
    let userId = 'anonymous';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await getAuth().verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (e) {}
    }
    // Filter datasets by userId
    const userDatasets = db.datasets.filter(d => !d.userId || d.userId === userId);
    res.json(userDatasets);
  });

  // API: Delete Dataset
  app.delete("/api/datasets/:id", (req, res) => {
    db.datasets = db.datasets.filter(d => d.id !== req.params.id);
    res.json({ success: true });
  });

  // API: Get History
  app.get("/api/history", async (req, res) => {
    const authHeader = req.headers.authorization;
    let userId = 'anonymous';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await getAuth().verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (e) {}
    }
    // Filter history by userId if it's set in the record
    const userHistory = db.history.filter(h => !h.userId || h.userId === userId);
    res.json(userHistory);
  });

  // API: Save Analysis to History
  app.post("/api/history", async (req, res) => {
    const authHeader = req.headers.authorization;
    let userId = 'anonymous';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await getAuth().verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (e) {}
    }
    const record: AnalysisRecord = {
      id: Date.now().toString(),
      ...req.body,
      userId,
      timestamp: new Date().toISOString()
    };
    db.history.push(record);
    res.json(record);
  });

  // API: Delete History Item
  app.delete("/api/history/:id", async (req, res) => {
    const authHeader = req.headers.authorization;
    let userId = 'anonymous';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await getAuth().verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (e) {}
    }
    
    const index = db.history.findIndex(h => h.id === req.params.id && (!h.userId || h.userId === userId));
    if (index !== -1) {
      db.history.splice(index, 1);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "History item not found or unauthorized" });
    }
  });

  // API: File Upload
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    const authHeader = req.headers.authorization;
    let userId = 'anonymous';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await getAuth().verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (e) {}
    }

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
      }

      fs.unlinkSync(filePath);

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
        userId
      };

      db.datasets.push(newDataset);
      res.json(newDataset);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to process file" });
    }
  });

  // API: Settings
  app.get("/api/settings", (req, res) => res.json(db.settings));
  app.post("/api/settings", (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    res.json(db.settings);
  });

  // Admin Routes (Secured)
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

  // Boilerplate for Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
