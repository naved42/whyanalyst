/**
 * Lazy Loading Utilities for Heavy Dependencies
 * 
 * These modules use dynamic imports to defer loading until needed,
 * reducing initial bundle size by ~40-50%
 */

// ============================================================
// Plotly Chart (300 KiB) - Lazy load on demand
// ============================================================
export const lazyPlotly = () => import('react-plotly.js');

// Usage in AnalysisPanel.tsx:
// import { lazy, Suspense } from 'react';
// import { lazyPlotly } from '@/lib/lazy-imports';
// 
// const Plot = lazy(() => lazyPlotly());
// 
// export default function AnalysisPanel() {
//   return (
//     <Suspense fallback={<div>Loading chart...</div>}>
//       <Plot data={chartData} layout={layout} />
//     </Suspense>
//   );
// }

// ============================================================
// Excel Parser (150 KiB) - Lazy load on file upload
// ============================================================
export async function parseExcel(file: File) {
  const XLSX = await import('xlsx');
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

// Usage in FilesView.tsx:
// const handleExcelUpload = async (file: File) => {
//   const data = await parseExcel(file);
//   // ...
// };

// ============================================================
// CSV Parser (80 KiB) - Lazy load on file upload
// ============================================================
export async function parseCSV(file: File) {
  const Papa = await import('papaparse');
  const text = await file.text();
  const { data } = Papa.parse(text, { header: true, dynamicTyping: true });
  return data;
}

// Usage in FilesView.tsx:
// const handleCSVUpload = async (file: File) => {
//   const data = await parseCSV(file);
//   // ...
// };

// ============================================================
// Firebase Auth (80 KiB) - Lazy load on auth route
// ============================================================
export const lazyFirebase = () => import('../lib/firebase');

// Usage in App.tsx (or route protection):
// const firebaseLib = await lazyFirebase();
// const { auth, googleProvider } = firebaseLib;

// ============================================================
// Google Generative AI (variable size) - Lazy load on demand
// ============================================================
export async function lazyGoogleGenAI(apiKey: string) {
  const { GoogleGenAI } = await import('@google/genai');
  return new GoogleGenAI({ apiKey });
}

// Usage in ChatComponents.tsx:
// const genAI = await lazyGoogleGenAI(process.env.GOOGLE_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// ============================================================
// Lenis Scroll (30 KiB) - Lazy load on landing page mount
// ============================================================
export const lazyLenis = () => import('lenis/react');

// Usage in LandingPage.tsx or scroll-heavy component:
// import { lazy, Suspense } from 'react';
// import { lazyLenis } from '@/lib/lazy-imports';
//
// const ReactLenis = lazy(() =>
//   lazyLenis().then(mod => ({ default: mod.ReactLenis }))
// );
//
// export default function LandingPage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <ReactLenis root>
//         {/* Content */}
//       </ReactLenis>
//     </Suspense>
//   );
// }

// ============================================================
// Base UI Components - Lazy load if needed
// ============================================================
export const lazyBaseUI = () => import('@base-ui/react');

// ============================================================
// Helper: Load multiple modules in parallel
// ============================================================
export async function loadModulesInParallel(...loaders: (() => Promise<any>)[]) {
  return Promise.all(loaders.map(loader => loader()));
}

// Usage: Load multiple heavy modules at once
// const [xlsxLib, csvLib, plotlyLib] = await loadModulesInParallel(
//   () => import('xlsx'),
//   () => import('papaparse'),
//   () => import('react-plotly.js')
// );
