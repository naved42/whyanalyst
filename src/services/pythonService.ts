export interface AnalysisResult {
  query: string;
  result: string;
  timestamp: string;
  engine: string;
}

export const pythonService = {
  getHealth: async () => {
    const response = await fetch('/api/python/health');
    if (!response.ok) throw new Error('Python engine offline');
    return response.json();
  },

  analyze: async (query: string, filePath: string): Promise<AnalysisResult> => {
    const response = await fetch(`/api/python/analyze?query=${encodeURIComponent(query)}&file_path=${encodeURIComponent(filePath)}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Analysis failed');
    return response.json();
  }
};
