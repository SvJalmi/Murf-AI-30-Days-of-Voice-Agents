# Day 22: Playing Streaming Audio in UI

This project implements real-time streaming audio playback that plays audio chunks as they arrive from the Murf WebSocket, completing the Day 22 challenge from the 30 Days of AI Voice Agents series.

## Day 22 Features

### 🔊 Real-Time Audio Streaming Playback
- **Seamless audio playback** as chunks arrive from Murf WebSocket
- **Continuous playback** without gaps between audio chunks
- **Base64 audio decoding** with WebAudio API
- **Queue-based playback system** for smooth streaming

### 🎯 Visual Feedback & Status Indicators
- **Dynamic audio status indicator** showing current playback state
- **Real-time chunk tracking** with count display
- **Interactive status element** for AudioContext resume
- **Visual states** for playing, paused, and ready states

### 🔧 Robust Error Handling
- **AudioContext state management** with suspension/resumption handling
- **Graceful error recovery** for audio decoding failures
- **Browser compatibility** with webkitAudioContext fallback
- **User interaction handling** for AudioContext resume

### ⚡ Technical Implementation
- **WebAudio API integration** for high-quality audio playback
- **Async audio decoding** with proper error handling
- **Automatic queue management** for continuous streaming
- **State tracking** to prevent overlapping playback

## Complete Voice Agent Pipeline

1. **🎤 Speech Input** → User speaks into microphone
2. **📡 Audio Streaming** → Browser streams audio to WebSocket server
3. **🔊 Speech Recognition** → AssemblyAI processes audio with turn detection
4. **🤖 LLM Processing** → Google Generative AI generates streaming response
5. **🔊 Text-to-Speech** → Murf WebSocket converts LLM response to audio
6. **📡 Audio Streaming** → Base64 audio chunks sent to client
7. **🎵 Audio Playback** → Real-time streaming audio playback (Day 22)
8. **📊 Status Updates** → Visual feedback for audio playback state

## Technical Implementation

### AudioContext Management
```javascript
function initializeAudioContext() {
    if (!audioContext) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            
            // Handle state changes
            audioContext.addEventListener('statechange', () => {
                console.log(`AudioContext state: ${audioContext.state}`);
            });
        } catch (error) {
            console.error("Error initializing AudioContext:", error);
        }
    }
    return audioContext;
}
```

### Streaming Audio Playback
```javascript
async function playAudio() {
    if (audioQueue.length > 0 && !isPlaying) {
        isPlaying = true;
        const audioData = audioQueue.shift();
        
        try {
            const audioBuffer = await audioContext.decodeAudioData(audioData);
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start(0);
            
            source.onended = () => {
                isPlaying = false;
                playAudio(); // Play next chunk
            };
        } catch (e) {
            console.error("Error decoding audio data:", e);
            isPlaying = false;
            playAudio(); // Try next chunk
        }
    }
}
```

### Audio Chunk Processing
```javascript
function handleAudioChunk(data) {
    audioChunks.push(data.audio);
    totalAudioChunksReceived++;
    
    try {
        const audioBytes = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
        const arrayBuffer = audioBytes.buffer.slice(audioBytes.byteOffset, audioBytes.byteOffset + audioBytes.byteLength);
        audioQueue.push(arrayBuffer);
        
        updateAudioPlaybackStatus(true);
        
        if (!isPlaying) {
            playAudio();
        }
    } catch (error) {
        console.error("Error processing audio chunk:", error);
    }
}
```

## UI Status Management

### Audio Status States
- **🔊 Playing**: Audio is currently playing with chunk count
- **⏸️ Paused**: AudioContext suspended, click to resume
- **🔇 Ready**: Audio system ready for playback

### Interactive Features
- Click on status to resume AudioContext when suspended
- Real-time updates during audio playback
- Error state indication with recovery options

## WebSocket Message Types

### Audio Streaming Messages (Day 22)

#### Server to Client
- `audio_chunk`: Base64 encoded audio chunk from Murf
  ```json
  {
    "type": "audio_chunk",
    "audio": "UklGRjQgAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAA...",
    "final": false
  }
  ```

### Client-Side Audio Processing
- **Base64 decoding**: Convert Murf audio to WebAudio compatible format
- **Buffer management**: Queue system for continuous playback
- **State tracking**: Prevent overlapping audio playback
- **Error handling**: Graceful recovery from decoding failures

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
   - Open browser developer console (F12)
   - Click anywhere on the page to initialize AudioContext
   - Click "Start Recording" and speak
   - Watch real-time audio playback with visual status!

## Audio Playback Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Browser   │    │   WebSocket  │    │ AssemblyAI  │    │ Google Gen   │
│  (Audio In) │◄──►│    Server    │◄──►│  Streaming  │◄──►│  AI (LLM)    │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
       ▲                   │
       │                   ▼
       │            ┌──────────────┐
       │            │ Murf WebSocket│
       │            │ (TTS Audio)   │
       │            └──────────────┘
       │                   │
       │                   ▼
┌─────────────┐    ┌──────────────┐
│ Audio Play  │◄───│ Base64 Audio │
│   System    │    │  Streaming   │
└─────────────┘    └──────────────┘
       │
       ▼
┌─────────────┐
│  UI Status  │
│  Updates    │
└─────────────┘
```

## Key Features Demonstrated

✅ **Complete voice agent pipeline** with real-time audio playback  
✅ **Seamless streaming audio** without gaps between chunks  
✅ **Visual status feedback** with interactive controls  
✅ **Robust error handling** for AudioContext management  
✅ **Browser compatibility** with fallback support  
✅ **Real-time chunk tracking** and progress display  
✅ **User interaction handling** for AudioContext resume  
✅ **Continuous playback** with automatic queue management  

## Console Output Examples

### Audio Playback Console
```
AudioContext initialized successfully
📢 AUDIO CHUNK RECEIVED: Chunk 1 (1234 characters)
📊 Total chunks accumulated: 1
AudioContext state changed to: running
📢 AUDIO CHUNK RECEIVED: Chunk 2 (1456 characters)
📊 Total chunks accumulated: 2
🎉 AUDIO STREAMING COMPLETE: Received 2 total chunks
```

### Error Handling Console
```
AudioContext state changed to: suspended
AudioContext suspended - user interaction required
AudioContext resumed after user interaction
Error decoding audio data: TypeError
Error processing audio chunk: InvalidCharacterError
```

## LinkedIn Post Content

"🎉 Day 22 Complete: Playing Streaming Audio in Real-Time!

Just implemented seamless streaming audio playback that:
- 🔊 Plays audio chunks as they arrive from Murf WebSocket
- ⚡ Continuous playback without gaps between chunks
- 🎯 Real-time visual feedback with status indicators
- 🔧 Robust error handling and AudioContext management
- 👆 Interactive UI for AudioContext resume when needed

Key achievements:
✅ Real-time audio streaming playback
✅ Seamless continuous audio experience  
✅ Visual status indicators with chunk tracking
✅ Comprehensive error handling and recovery
✅ Browser-compatible AudioContext management

The voice agent now provides a complete audio experience with real-time playback as responses are generated!

4 weeks of AI voice agent development complete! 🚀

#AI #VoiceAgents #AudioStreaming #WebAudio #RealTimePlayback #30DaysOfAIVoiceAgents"

---

*This implementation demonstrates production-ready streaming audio playback capabilities essential for building responsive voice agent applications with real-time audio delivery and user feedback.*
