# Murf WebSocket API Research - Day 20

## Key Findings from Documentation

### WebSocket Endpoint
- URL: `wss://api.murf.ai/v1/speech/stream-input`
- Query parameters: `?api-key={API_KEY}&sample_rate=44100&channel_type=MONO&format=WAV`

### Authentication
- API Key required - get from https://murf.ai/api/docs
- Pass as query parameter in WebSocket URL

### Message Format

#### Voice Configuration (Optional - sent first)
```json
{
  "voice_config": {
    "voiceId": "en-US-amara",
    "style": "Conversational", 
    "rate": 0,
    "pitch": 0,
    "variation": 1
  }
}
```

#### Text Input
```json
{
  "text": "Text to convert to speech",
  "end": true,  // Close context to avoid concurrency limits
  "context_id": "static_context_123"  // Use static ID to avoid context limit errors
}
```

### Response Format
```json
{
  "audio": "base64_encoded_audio_data",
  "final": false  // true when complete
}
```

### Key Implementation Details
1. **Audio Format**: Base64-encoded WAV audio chunks
2. **Sample Rate**: 44100 Hz, MONO channel
3. **Connection Lifecycle**: Auto-closes after 3 minutes of inactivity
4. **Concurrency**: Up to 10X streaming limit in WebSocket connections
5. **Context Management**: Use static context_id to avoid limits

### Integration Requirements for Day 20
1. Connect to Murf WebSocket when LLM response is ready
2. Send voice configuration first
3. Send LLM streaming text chunks to Murf
4. Receive base64 audio chunks
5. Print base64 audio to console as requested
6. Use static context_id to avoid context limit errors

### Error Handling
- Handle WebSocket connection failures
- Manage context limits with static context_id
- Handle audio decoding errors

### Best Practices
- Maintain persistent connection for streaming
- Send voice config once per session
- Use context_id for session management
- Handle connection timeouts (3 minutes inactivity)

