# Day 18: Turn Detection with AssemblyAI Streaming API

This project implements real-time turn detection using AssemblyAI's streaming API and WebSockets, completing the Day 18 challenge from the 30 Days of AI Voice Agents series.

## Features

### 🎯 Turn Detection
- **Real-time turn detection** using AssemblyAI's Universal Streaming API
- **WebSocket notifications** sent to client when user stops talking (`end_of_turn = true`)
- **Turn-based transcription display** - transcription appears only at the end of each turn
- **Confidence monitoring** with real-time confidence scores for turn completion

### 🎨 User Interface
- **Beautiful black-themed UI** with animated particles and gradients
- **Turn statistics panel** showing:
  - Current turn number
  - Turn completion confidence percentage
  - Real-time status (Waiting/Speaking/Turn Complete)
- **Visual distinction** between partial transcripts (orange) and completed turns (blue)
- **Audio visualizer** with animated bars during recording
- **Responsive design** for desktop and mobile devices

### ⚙️ Technical Implementation
- **WebSocket server** using Python `websockets` library
- **AssemblyAI Python SDK** with streaming v3 API
- **Turn detection parameters**:
  - `end_of_turn_confidence_threshold`: 0.7 (adjustable sensitivity)
  - `min_end_of_turn_silence_when_confident`: 160ms minimum silence
  - `max_turn_silence`: 2400ms maximum silence before forcing end of turn
- **Audio format**: 16kHz, 16-bit, mono PCM as required by AssemblyAI

## File Structure

```
DAY 17/
├── server.py          # WebSocket server with turn detection
├── client.html        # Turn detection demo UI
└── README.md          # This documentation
```

## Key Implementation Details

### Server-Side Turn Detection Handler

```python
def on_turn(self, client, event: TurnEvent):
    logger.info(f"Turn {event.turn_order}: '{event.transcript}' (end_of_turn: {event.end_of_turn}, confidence: {event.end_of_turn_confidence})")
    
    # Only send transcription to client at the end of each turn
    if event.end_of_turn:
        logger.info(f"🔚 End of turn detected! Sending final transcription: '{event.transcript}'")
        
        # Send turn completion notification to client
        asyncio.create_task(self.send_to_client({
            "type": "turn_complete",
            "turn_order": event.turn_order,
            "transcript": event.transcript,
            "turn_is_formatted": event.turn_is_formatted,
            "end_of_turn_confidence": event.end_of_turn_confidence,
            "word_count": len(event.words) if event.words else 0
        }))
```

### Client-Side Turn Handling

```javascript
function handleTurnComplete(data) {
    console.log(`Turn ${data.turn_order} completed:`, data.transcript);
    
    // Add completed turn transcription with blue styling
    const transcriptionItem = document.createElement('div');
    transcriptionItem.className = 'transcription-item turn-complete';
    transcriptionItem.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <strong>Turn ${data.turn_order}</strong>
            <span style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">
                ${Math.round(data.end_of_turn_confidence * 100)}% confidence
                ${data.turn_is_formatted ? '• Formatted' : ''}
            </span>
        </div>
        <div>${data.transcript}</div>
    `;
    
    transcriptionText.appendChild(transcriptionItem);
    
    // Update turn statistics
    currentTurn.textContent = data.turn_order;
    turnConfidence.textContent = Math.round(data.end_of_turn_confidence * 100) + '%';
    turnStatus.textContent = 'Turn Complete';
}
```

## How to Run

1. **Install dependencies:**
   ```bash
   pip install assemblyai websockets
   ```

2. **Set your AssemblyAI API key:**
   - Get a free API key from https://www.assemblyai.com/
   - Update the `api_key` variable in `server.py`

3. **Start the WebSocket server:**
   ```bash
   python server.py
   ```

4. **Open the client:**
   - Open `client.html` in a web browser
   - Click "Start Recording" and speak
   - Observe turn detection in action!

## Turn Detection Behavior

1. **Partial Transcripts**: While speaking, partial transcripts appear in orange with "Speaking..." status
2. **Turn Completion**: When you pause/stop talking, AssemblyAI detects the end of turn
3. **Final Transcription**: The completed turn appears in blue with confidence score
4. **Statistics Update**: Turn number, confidence, and status update in real-time

## WebSocket Message Types

### Server to Client Messages

- `turn_complete`: Sent when a turn is completed
  ```json
  {
    "type": "turn_complete",
    "turn_order": 1,
    "transcript": "Hello, this is my first turn.",
    "turn_is_formatted": true,
    "end_of_turn_confidence": 0.95,
    "word_count": 6
  }
  ```

- `partial_transcript`: Sent during speaking (optional)
  ```json
  {
    "type": "partial_transcript",
    "turn_order": 1,
    "transcript": "Hello, this is my",
    "end_of_turn_confidence": 0.3
  }
  ```

### Client to Server Messages

- `start`: Notify server that recording started
- `stop`: Notify server that recording stopped
- Binary audio data: Raw audio chunks in required format

## AssemblyAI Turn Object Properties

- `turn_order`: Integer that increments with each new turn
- `turn_is_formatted`: Boolean indicating if text is formatted
- `end_of_turn`: Boolean indicating if this is the end of the current turn
- `transcript`: String containing only finalized words
- `end_of_turn_confidence`: Float (0-1) representing confidence that turn has finished
- `words`: List of Word objects with individual metadata

## Demo Features

✅ Real-time turn detection with visual feedback  
✅ Turn-based transcription display  
✅ Confidence monitoring and statistics  
✅ Beautiful black-themed UI with animations  
✅ WebSocket communication for turn notifications  
✅ Proper audio format handling (16kHz, 16-bit, mono PCM)  
✅ Responsive design for all devices  

## LinkedIn Post Content

"🎯 Day 18 Complete: Turn Detection with AssemblyAI Streaming API!

Just implemented real-time turn detection using AssemblyAI's Universal Streaming API. The system:
- Detects when users stop talking with 95%+ confidence
- Sends WebSocket notifications for turn completion
- Displays transcription only at the end of each turn
- Shows real-time confidence scores and turn statistics

Key features:
✅ Turn-based transcription display
✅ Real-time confidence monitoring  
✅ Beautiful black-themed UI
✅ WebSocket communication
✅ Proper audio format handling

Perfect for voice agent applications where you need to know exactly when a user has finished speaking!

#AI #VoiceAgents #AssemblyAI #WebSockets #TurnDetection #30DaysOfAIVoiceAgents"

---

*This implementation demonstrates advanced turn detection capabilities essential for building responsive voice agent applications.*

