# Murf TTS API Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is a FastAPI server that provides an endpoint to convert text to speech using Murf's REST TTS API.

## Setup

1. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

2. The Murf API key is already configured in the `.env` file.

## Running the Server

To start the server, run:
```
uvicorn main:app --reload
```

Or alternatively:
```
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

- `GET /` - Root endpoint returning a welcome message
- `POST /tts` - Convert text to speech
  - Body: `{"text": "Your text here"}`
  - Response: `{"audio_url": "URL to generated audio file"}`

## Testing the API

Once the server is running, you can test the endpoints using the interactive documentation at:
`http://localhost:8000/docs`

You can also use tools like Postman to test the API.
