from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="30 Days of Voice Agents - Day 1", description="Project Setup with FastAPI and Glass UI")

# Mount static directory for JS, CSS, etc.
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# Serve the index.html
@app.get("/")
async def read_index():
    return FileResponse(os.path.join("frontend", "index.html"))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "30 Days of Voice Agents - Day 1"}
