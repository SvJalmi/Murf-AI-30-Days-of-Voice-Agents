from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Murf API configuration
MURF_API_URL = "https://api.murf.ai/generate"  # Updated to match task requirement
MURF_API_KEY = os.getenv("MURF_API_KEY")

# Check if API key is available
if not MURF_API_KEY:
    raise ValueError("MURF_API_KEY not found in environment variables. Please check your .env file.")

class TextRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Murf TTS API Server"}

@app.post("/tts", summary="Convert text to speech", 
          description="Generate speech from text using Murf's REST TTS API and return a URL to the audio file")
def generate_speech(request: TextRequest):
    """
    Generate speech from text using Murf's TTS API
    
    - **text**: The text to convert to speech
    - Returns: URL to the generated audio file
    """
    # Prepare headers for Murf API
    headers = {
        "Authorization": f"Bearer {MURF_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Prepare payload for Murf API
    payload = {
        "text": request.text,
        "voice": "en-US-Wavenet-A",  # Default voice
        "format": "mp3"
    }
    
    try:
        # Call Murf's TTS API
        response = requests.post(MURF_API_URL, json=payload, headers=headers)
        
        # Check if request was successful
        if response.status_code == 200:
            response_data = response.json()
            # Return the URL to the generated audio file
            audio_url = response_data.get("audio_url")
            if audio_url:
                return {"audio_url": audio_url}
            else:
                raise HTTPException(status_code=500, detail="Audio URL not found in Murf API response")
        elif response.status_code == 401:
            raise HTTPException(status_code=401, detail="Unauthorized: Check your Murf API key")
        elif response.status_code == 400:
            raise HTTPException(status_code=400, detail=f"Bad Request: {response.text}")
        else:
            raise HTTPException(status_code=response.status_code, detail=f"Error from Murf API: {response.text}")
            
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error calling Murf API: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Invalid response from Murf API: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
