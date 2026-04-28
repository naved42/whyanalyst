import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getAIMentorFeedback(
  columnName: string,
  columnStats: any,
  preprocessingStep: string
) {
  const prompt = `
    You are the "AI Mentor" for CleanSlate AI, a data science education platform.
    A student is preprocessing the column "${columnName}" using "${preprocessingStep}".
    
    Column Statistics:
    - Type: ${columnStats.type}
    - Unique Values: ${columnStats.uniqueCount}
    - Missing Values: ${columnStats.missingCount} (${columnStats.missingPct.toFixed(2)}%)
    ${columnStats.mean ? `- Mean: ${columnStats.mean.toFixed(2)}` : ''}
    ${columnStats.std ? `- Std Dev: ${columnStats.std.toFixed(2)}` : ''}

    Task: Provide a concise, exactly 3-sentence pedagogical explanation justifying this choice from a mathematical or data science perspective. 
    Focus on WHY this step is necessary for machine learning models.
    Do not generate code. Be encouraging but professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });
    return response.text?.trim() || "No feedback available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI Mentor is currently offline, but your preprocessing step is a valid choice in standard pipelines.";
  }
}

export async function askAIMentor(
  question: string,
  context: { columnName: string | null, audit: any, dataSample?: any[], model?: string }
) {
  const modelToUse = context.model || "gemini-1.5-flash";

  const prompt = `
    As a Senior AI Data Analyst, answer the user's data query.
    Context: ${JSON.stringify({ column: context.columnName, stats: context.audit?.columnStats.find((c: any) => c.name === context.columnName) })}
    Data Sample (first 5 rows): ${JSON.stringify(context.dataSample)}
    
    User Query: ${question}

    You MUST respond ONLY with a valid JSON object in the following structure:
    {
      "explanation": "Markdown formatted detailed analysis and response. Briefly explain the findings.",
      "code": "A complete, executable Python script using pandas and seaborn (for visualization plotting commands even if we show plotly here) or plotly.express. This code should reflect the real processing of the data sample provided.",
      "insights": [
        { "label": "Key Metric Name", "value": "Metric Value", "trend": "up|down|neutral", "description": "Short reasoning" }
      ],
      "charts": [
        {
          "title": "Chart Title",
          "data": [
             { 
               "x": [vals], 
               "y": [vals], 
               "type": "bar|scatter|line|box|histogram", 
               "name": "Label",
               "marker": { "color": "COLOR_HEX_CODE", "line": { "width": 1.5, "color": "darker_shade_hex" } },
               "opacity": 0.8
             }
          ],
          "layout": { 
            "title": "Descriptive Title",
            "xaxis": { "title": "X Axis Label", "showgrid": true, "gridcolor": "#f0f0f0" }, 
            "yaxis": { "title": "Y Axis Label", "showgrid": true, "gridcolor": "#f0f0f0" },
            "template": "plotly_white",
            "colorway": ["#4c72b0", "#55a868", "#c44e52", "#8172b2", "#ccb974", "#64b5cd"]
          }
        }
      ]
    }

    Styling Guidelines for Charts:
    - Use Seaborn 'muted' or 'deep' palette vibes (e.g., #4C72B0, #55A868, #C44E52).
    - Ensure axis labels are clear and descriptive.
    - Default to 'plotly_white' template for a clean, academic look.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    const cleanedText = text.trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Mentor error:", error);
    return {
      explanation: "I encountered an error processing your query. Please ensure you've uploaded a dataset.",
      code: "# Error processing query",
      insights: [],
      charts: []
    };
  }
}
