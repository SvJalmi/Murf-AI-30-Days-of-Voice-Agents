# Day 20: Complete Voice Agent with Murf WebSocket TTS

This project implements a complete voice agent pipeline with Murf WebSocket text-to-speech integration, completing the Day 20 challenge from the 30 Days of AI Voice Agents series.

## Complete Voice Agent Pipeline

### 🎯 End-to-End Flow
1. **🎤 Speech Input** → User speaks into microphone
2. **📡 Audio Streaming** → Browser streams audio to WebSocket server
3. **🔊 Speech Recognition** → AssemblyAI processes audio in real-time
4. **⏸️ Turn Detection** → AssemblyAI detects when user stops talking
5. **🤖 LLM Processing** → Google Generative AI generates streaming response
6. **🔊 Text-to-Speech** → Murf WebSocket converts LLM response to audio
7. **📢 Audio Output** → Base64 encoded audio printed to console
8. **📺 UI Display** → All interactions shown in real-time interface

## Day 20 Features

### 🎵 Murf WebSocket Integration
- **Real-time TTS conversion** of LLM streaming responses
- **Base64 audio output** printed to console as requested
- **Static context ID** to prevent context limit errors
- **Conversational voice** using en-US-amara with natural settings
- **Streaming audio chunks** received and logged in real-time

### 🔧 Technical Implementation

#### Murf WebSocket Connection
```python
MURF_WS_URL = f"wss://api.murf.ai/v1/speech/stream-input?api-key={MURF_API_KEY}&sample_rate=44100&channel_type=MONO&format=WAV"

async def connect_murf_websocket(self):
    self.murf_ws = await websockets.connect(MURF_WS_URL)
    self.murf_connected = True
    
    # Send voice configuration
    voice_config = {
        "voice_config": {
            "voiceId": "en-US-amara",
            "style": "Conversational",
            "rate": 0,
            "pitch": 0,
            "variation": 1
        }
    }
    await self.murf_ws.send(json.dumps(voice_config))
```

#### LLM to Murf Streaming
```python
async def get_llm_response(self, prompt):
    model = genai.GenerativeModel("gemini-pro")
    response_stream = model.generate_content(prompt, stream=True)
    
    for chunk in response_stream:
        if chunk.text:
            # Send LLM chunk to Murf for TTS conversion
            await self.send_text_to_murf(chunk.text, is_final=False)
    
    # Send final marker to complete TTS
    await self.send_text_to_murf("", is_final=True)
```

#### Base64 Audio Processing
```python
async def listen_murf_responses(self):
    while self.murf_connected and self.murf_ws:
        response = await self.murf_ws.recv()
        data = json.loads(response)
        
        if "audio" in data:
            # Print base64 encoded audio to console as requested
            logger.info(f"📢 BASE64 AUDIO: {data['audio']}")
            print(f"BASE64 AUDIO: {data['audio']}")
```

## File Structure

```
DAY 17/
├── server.py              # Complete voice agent server with Murf integration
├── client.html            # UI for voice agent interaction
├── index.html             # Copy for deployment
├── README.md              # Day 18 documentation
├── README_DAY19.md        # Day 19 LLM streaming documentation
└── README_DAY20.md        # This Day 20 Murf integration documentation
```

## API Keys Required

### AssemblyAI API Key
- **Purpose**: Real-time speech transcription and turn detection
- **Get from**: https://www.assemblyai.com/

### Google Generative AI API Key
- **Purpose**: Streaming LLM responses with Gemini Pro
- **Get from**: https://ai.google.dev/

### Murf API Key
- **Purpose**: Text-to-speech conversion via WebSocket
- **Get from**: https://murf.ai/api/docs

## How to Run

1. **Install dependencies:**
   ```bash
   pip install assemblyai websockets google-generativeai
   ```

2. **Set API keys:**
   ```bash
   export GOOGLE_API_KEY="your_google_api_key_here"
   # AssemblyAI and Murf keys are set in server.py
   ```

3. **Start the WebSocket server:**
   ```bash
   python server.py
   ```

4. **Open the client:**
   - Open `client.html` in a web browser
   - Click "Start Recording" and speak
   - Watch the complete voice agent pipeline!
   - Check console for BASE64 audio output

## Console Output Example

```
INFO:__main__:Turn 1: 'Hello world' (end_of_turn: True, confidence: 0.95)
INFO:__main__:🔚 End of turn detected! Sending final transcription: 'Hello world'
INFO:__main__:Sending to LLM: Hello world
INFO:__main__:Connected to Murf WebSocket
INFO:__main__:Sent voice configuration to Murf
INFO:__main__:LLM Stream: Hello! I heard you say "
INFO:__main__:Sent text to Murf: Hello! I heard you say "
INFO:__main__:LLM Stream: Hello world". How can I
INFO:__main__:Sent text to Murf: Hello world". How can I
INFO:__main__:📢 BASE64 AUDIO: UklGRjQgAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAA...
BASE64 AUDIO: UklGRjQgAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAA...
INFO:__main__:📢 BASE64 AUDIO: AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKiss...
BASE64 AUDIO: AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKiss...
INFO:__main__:Murf audio generation completed
```

## WebSocket Message Types

### New Audio Messages (Day 20)

#### Server to Client
- `audio_chunk`: Base64 encoded audio from Murf
  ```json
  {
    "type": "audio_chunk",
    "audio": "UklGRjQgAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAA...",
    "final": false
  }
  ```

### Existing Messages (Days 18-19)
- `turn_complete`: Turn completion with transcript
- `partial_transcript`: Real-time partial transcripts  
- `llm_partial_response`: Streaming LLM response chunks
- `llm_full_response`: Complete LLM response
- `status`: Server status messages
- `error`: Error notifications

## Voice Agent Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Browser   │    │   WebSocket  │    │ AssemblyAI  │    │ Google Gen   │
│  (Audio In) │◄──►│    Server    │◄──►│  Streaming  │◄──►│  AI (LLM)    │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Murf WebSocket│
                    │ (TTS Audio)   │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Base64 Audio │
                    │   Console    │
                    └──────────────┘
```

## Key Features Demonstrated

✅ **Complete voice agent pipeline** with all components  
✅ **Real-time speech transcription** with AssemblyAI  
✅ **Turn detection** with confidence scoring  
✅ **Streaming LLM responses** with Google Generative AI  
✅ **Real-time text-to-speech** with Murf WebSocket  
✅ **Base64 audio output** printed to console  
✅ **Static context management** to avoid API limits  
✅ **Error handling** for all WebSocket connections  
✅ **Beautiful responsive UI** with real-time updates  
✅ **Comprehensive logging** for debugging  

## Murf WebSocket Configuration

- **Endpoint**: `wss://api.murf.ai/v1/speech/stream-input`
- **Voice**: en-US-amara (Conversational style)
- **Audio Format**: 44100Hz, MONO, WAV
- **Encoding**: Base64 strings
- **Context**: Static ID to prevent limits
- **Connection**: Persistent with auto-reconnection

## LinkedIn Post Content

"🎉 Day 20 Complete: Full Voice Agent with Murf WebSocket TTS!

Just built a complete end-to-end voice agent that:
- 🎤 Captures speech with AssemblyAI streaming
- ⏸️ Detects turn completion automatically  
- 🤖 Generates responses with Google Generative AI
- 🔊 Converts text to speech with Murf WebSocket
- 📢 Outputs base64 encoded audio to console

The complete pipeline:
Speech → Transcription → LLM → TTS → Audio

Perfect example of how multiple AI APIs can work together to create seamless conversational experiences!

Key integrations:
✅ AssemblyAI for speech recognition
✅ Google Generative AI for responses
✅ Murf AI for text-to-speech
✅ WebSocket streaming throughout

#AI #VoiceAgents #TTS #WebSockets #MurfAI #30DaysOfAIVoiceAgents"

---

*This implementation demonstrates a production-ready voice agent architecture with real-time speech recognition, AI processing, and text-to-speech synthesis - the foundation for building advanced conversational AI applications.*

