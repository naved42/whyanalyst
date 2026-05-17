from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import polars as pl
import json
import os
from datetime import datetime
from typing import Optional, List

app = FastAPI()

# Allow all origins for internal proxying
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # More permissive for internal dev
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_data(file_path: str, engine: str = "polars"):
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
    
    ext = os.path.splitext(file_path)[1].lower()
    
    try:
        if engine == "polars":
            if ext == ".csv":
                return pl.read_csv(file_path)
            elif ext in [".xlsx", ".xls"]:
                return pl.read_excel(file_path)
            elif ext == ".json":
                return pl.read_json(file_path)
            elif ext == ".parquet":
                return pl.read_parquet(file_path)
            else:
                # Fallback to pandas then convert to polars
                df_pd = pd.read_excel(file_path) if ext in [".xlsx", ".xls"] else pd.read_csv(file_path)
                return pl.from_pandas(df_pd)
        else:
            if ext == ".csv":
                return pd.read_csv(file_path)
            elif ext in [".xlsx", ".xls"]:
                return pd.read_excel(file_path)
            elif ext == ".json":
                return pd.read_json(file_path)
            else:
                return pd.read_csv(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading file: {str(e)}")

@app.get("/api/python/health")
async def health():
    return {
        "status": "ok", 
        "engine": "FastAPI/Python",
        "libraries": {
            "pandas": pd.__version__,
            "polars": pl.__version__
        }
    }

@app.get("/api/python/stats")
async def get_stats(file_path: str, engine: str = "polars"):
    df = load_data(file_path, engine)
    
    if engine == "polars":
        stats = df.describe().to_dicts()
    else:
        stats = df.describe().reset_index().to_dict(orient="records")
        
    return {
        "engine": engine,
        "stats": stats,
        "shape": df.shape,
        "columns": df.columns if engine == "polars" else df.columns.tolist()
    }

@app.get("/api/python/correlation")
async def get_correlation(file_path: str, engine: str = "polars"):
    df = load_data(file_path, engine)
    
    # Only numeric columns
    if engine == "polars":
        numeric_df = df.select(pl.col(pl.NUMERIC_DTYPES))
        if numeric_df.width == 0:
            return {"error": "No numeric columns found for correlation"}
        corr = numeric_df.corr().to_dicts()
        cols = numeric_df.columns
    else:
        numeric_df = df.select_dtypes(include=['number'])
        if numeric_df.empty:
            return {"error": "No numeric columns found for correlation"}
        corr = numeric_df.corr().reset_index().to_dict(orient="records")
        cols = numeric_df.columns.tolist()
        
    return {
        "engine": engine,
        "correlation_matrix": corr,
        "columns": cols
    }

@app.get("/api/python/profile")
async def get_profile(file_path: str):
    # Comprehensive profile using Polars
    df = load_data(file_path, "polars")
    
    profile = {
        "rows": df.height,
        "columns": df.width,
        "null_counts": df.null_count().to_dicts()[0],
        "dtypes": {name: str(dtype) for name, dtype in zip(df.columns, df.dtypes)},
        "unique_counts": {col: df[col].n_unique() for col in df.columns},
        "sample": df.head(10).to_dicts()
    }
    
    return profile

@app.post("/api/python/analyze")
async def analyze_data(query: str, file_path: str, engine: str = "polars"):
    # Simple query execution
    df = load_data(file_path, engine)
    
    # In a real app, we'd use a safe eval or a query DSL
    # For demo, we'll just return a success message
    return {
        "query": query,
        "engine": engine,
        "result": f"Analysis for {os.path.basename(file_path)} completed via {engine}",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
