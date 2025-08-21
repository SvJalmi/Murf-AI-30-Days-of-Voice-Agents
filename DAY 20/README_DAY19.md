# Day 19: Streaming LLM Responses with AssemblyAI + Google Generative AI

This project implements streaming LLM responses triggered by completed turns from AssemblyAI's streaming API, completing the Day 19 challenge from the 30 Days of AI Voice Agents series.

## Features

### 🤖 LLM Streaming Integration
- **Automatic LLM triggering** when AssemblyAI detects end of turn
- **Streaming responses** using Google's Gemini Pro model
- **Real-time display** of LLM responses in the UI
- **Console logging** of all LLM interactions for debugging

### 🎯 Turn-Based Voice Agent Pipeline
1. **Speech Recognition**: AssemblyAI streaming with turn detection
2. **Turn Completion**: Automatic detection when user stops talking
3. **LLM Processing**: Final transcript sent to Google Generative AI
4. **Streaming Response**: LLM streams response back in real-time
5. **Display & Logging**: Response shown in UI and logged to console

### 🎨 Enhanced User Interface
- **Turn-Based Transcription** section for speech recognition
- **LLM Response** section for streaming AI responses
- **Real-time statistics** showing turn progress and confidence
- **Beautiful black-themed UI** with animated particles
- **Responsive design** for all devices

## Technical Implementation

### Server-Side Architecture

#### LLM Integration
```python
async def get_llm_response(self, prompt):
    logger.info(f"Sending to LLM: {prompt}")
    try:
        model = genai.GenerativeModel("gemini-pro")
        response_stream = model.generate_content(prompt, stream=True)
        
        full_response = ""
        for chunk in response_stream:
            if chunk.text:
                full_response += chunk.text
                logger.info(f"LLM Stream: {chunk.text}")
                # Send partial LLM response to client
                asyncio.create_task(self.send_to_client({
                    "type": "llm_partial_response",
                    "text": chunk.text
                }))
        
        logger.info(f"LLM Full Response: {full_response}")
        asyncio.create_task(self.send_to_client({
            "type": "llm_full_response",
            "text": full_response
        }))
    except Exception as e:
        logger.error(f"Error getting LLM response: {e}")
```

#### Turn Detection with LLM Trigger
```python
def on_turn(self, client, event: TurnEvent):
    if event.end_of_turn:
        logger.info(f"🔚 End of turn detected! Sending final transcription: '{event.transcript}'")
        
        # Send turn completion to client
        asyncio.create_task(self.send_to_client({
            "type": "turn_complete",
            "turn_order": event.turn_order,
            "transcript": event.transcript,
            "turn_is_formatted": event.turn_is_formatted,
            "end_of_turn_confidence": event.end_of_turn_confidence
        }))
        
        # Trigger LLM response
        if event.transcript:
            asyncio.create_task(self.get_llm_response(event.transcript))
```

### Client-Side LLM Response Handling

#### Streaming Response Display
```javascript
function handleLlmPartialResponse(data) {
    const llmResponseText = document.getElementById("llmResponseText");
    const emptyState = llmResponseText.querySelector(".empty-state");
    if (emptyState) {
        emptyState.remove();
        llmResponseText.innerHTML = ""; // Clear initial empty state
    }
    llmResponseText.innerHTML += data.text;
    llmResponseText.scrollTop = llmResponseText.scrollHeight;
}
```

## File Structure

```
DAY 17/
├── server.py          # WebSocket server with LLM streaming
├── client.html        # UI with LLM response display
├── index.html         # Copy of client.html for deployment
├── README.md          # Day 18 documentation
└── README_DAY19.md    # This Day 19 documentation
```

## API Keys Required

### AssemblyAI API Key
- Get from: https://www.assemblyai.com/
- Used for: Real-time speech transcription and turn detection

### Google Generative AI API Key
- Get from: https://ai.google.dev/
- Used for: Streaming LLM responses with Gemini Pro

## How to Run

1. **Install dependencies:**
   ```bash
   pip install assemblyai websockets google-generativeai
   ```

2. **Set API keys:**
   ```bash
   export GOOGLE_API_KEY="your_google_api_key_here"
   # AssemblyAI key is set in server.py
   ```

3. **Start the WebSocket server:**
   ```bash
   python server.py
   ```

4. **Open the client:**
   - Open `client.html` in a web browser
   - Click "Start Recording" and speak
   - Watch the complete voice agent pipeline in action!

## Voice Agent Pipeline Flow

1. **🎤 User speaks** → Audio captured by browser
2. **📡 Audio streaming** → Sent to server via WebSocket
3. **🔊 Speech recognition** → AssemblyAI processes audio in real-time
4. **⏸️ Turn detection** → AssemblyAI detects when user stops talking
5. **📝 Final transcript** → Complete turn transcript generated
6. **🤖 LLM processing** → Transcript sent to Google Generative AI
7. **💬 Streaming response** → LLM generates response in real-time
8. **📺 UI display** → Response shown in LLM Response section
9. **📊 Console logging** → All interactions logged to server console

## WebSocket Message Types

### New LLM Messages (Day 19)

#### Server to Client
- `llm_partial_response`: Streaming LLM response chunks
  ```json
  {
    "type": "llm_partial_response",
    "text": "Hello! I heard you say..."
  }
  ```

- `llm_full_response`: Complete LLM response
  ```json
  {
    "type": "llm_full_response",
    "text": "Hello! I heard you say 'Hello world'. How can I help you today?"
  }
  ```

### Existing Messages (Day 18)
- `turn_complete`: Turn completion with transcript
- `partial_transcript`: Real-time partial transcripts
- `status`: Server status messages
- `error`: Error notifications

## Console Output Example

```
INFO:__main__:Turn 1: 'Hello world' (end_of_turn: True, confidence: 0.95)
INFO:__main__:🔚 End of turn detected! Sending final transcription: 'Hello world'
INFO:__main__:Sending to LLM: Hello world
INFO:__main__:LLM Stream: Hello! I heard you say "
INFO:__main__:LLM Stream: Hello world". How can I
INFO:__main__:LLM Stream:  help you today?
INFO:__main__:LLM Full Response: Hello! I heard you say "Hello world". How can I help you today?
```

## Key Features Demonstrated

✅ **Real-time speech transcription** with AssemblyAI  
✅ **Turn detection** with confidence scoring  
✅ **Automatic LLM triggering** on turn completion  
✅ **Streaming LLM responses** with Google Generative AI  
✅ **Real-time UI updates** for both transcription and LLM responses  
✅ **Console logging** of all LLM interactions  
✅ **Error handling** for API failures  
✅ **WebSocket communication** for real-time data flow  
✅ **Beautiful responsive UI** with black theme  

## LinkedIn Post Content

"🚀 Day 19 Complete: Streaming LLM Responses with Voice Agents!

Just built a complete voice agent pipeline that:
- Captures speech in real-time with AssemblyAI
- Detects when users finish speaking (turn detection)
- Automatically sends transcripts to Google's Gemini Pro
- Streams LLM responses back in real-time
- Logs everything to console for debugging

The magic happens when you speak:
1. 🎤 Your voice → Real-time transcription
2. ⏸️ Pause detected → Turn completion
3. 🤖 Transcript → LLM processing
4. 💬 Streaming response → Real-time display

Perfect foundation for building conversational AI applications!

#AI #VoiceAgents #LLM #Streaming #AssemblyAI #GoogleAI #30DaysOfAIVoiceAgents"

---

*This implementation demonstrates a complete voice agent pipeline with real-time speech recognition, turn detection, and streaming LLM responses - essential components for building conversational AI applications.*

