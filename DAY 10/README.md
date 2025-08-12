# 🌌 Voice Agent - AI Voice Generator

A comprehensive AI voice agent system built as part of the "30 Days of AI Voice Agents" challenge. Features intelligent text generation, voice transcription, text-to-speech conversion, and Echo Bot capabilities with a modern glassmorphism design.

## ✨ Features

### 🧠 LLM Integration (Day 8)
- **Google Gemini AI**: Intelligent text generation using gemini-2.5-flash model
- **Smart Responses**: Generate creative content, explanations, and conversations
- **JSON API**: Clean REST endpoint `/llm/query` for text processing
- **Error Handling**: Comprehensive validation and error management

### 🔄 Echo Bot v2 (Day 7)
- **Voice Recording**: Browser-based audio capture using MediaRecorder API
- **AI Transcription**: Real-time speech-to-text using AssemblyAI
- **Voice Regeneration**: Convert transcribed text back to AI voice with Murf TTS
- **Complete Pipeline**: Single endpoint handles record → transcribe → regenerate workflow

### 🎤 Text-to-Speech
- **High-quality synthesis** using Murf AI API
- **Natural voice generation** with Natalie voice model
- **Instant audio playback** with HTML5 audio controls
- **MP3 format output** for compatibility and quality

### 📝 Audio Transcription (Day 6)
- **Real-time transcription** using AssemblyAI API
- **High accuracy** speech recognition with confidence scoring
- **Multiple formats** support (MP3, WAV, WEBM, OGG, M4A, MP4)
- **Binary processing** for efficient audio handling

### 🌌 Epic Cosmic UI Design
- **Stunning Space Background** - Real cosmic imagery with nebulas, planets, and stellar landscapes
- **Glass Morphism Design** - Frosted glass cards with transparency and blur effects
- **Floating Animations** - Subtle particle effects that drift across the cosmic scene
- **Space-themed Elements** - Cosmic gradients, glowing effects, and stellar styling
- **Responsive Design** - Beautiful on all devices from mobile to desktop

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voice-agent
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   Configure your API keys in Replit Secrets or create a `.env` file:
   ```
   MURF_API_KEY=your_murf_api_key_here
   ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   SESSION_SECRET=your_session_secret_here
   ```

4. **Run the application**
   ```bash
   gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000` to explore the cosmic Voice Agent!

## 🛠️ Technology Stack

### Backend
- **Flask** - Python web framework for robust server-side logic
- **Requests** - HTTP library for external API communication
- **Gunicorn** - Production-ready WSGI HTTP server

### Frontend
- **Bootstrap 5.3.2** - Modern CSS framework for responsive layouts
- **Font Awesome 6.4.0** - Professional icons and visual elements
- **Google Fonts (Inter)** - Clean, modern typography
- **Custom CSS** - Advanced glass morphism effects and cosmic animations

### APIs & Services
- **Google Gemini API** - Advanced language model for intelligent text generation
- **AssemblyAI API** - Real-time speech-to-text transcription service
- **Murf AI API** - Enterprise-grade text-to-speech conversion
- **MediaRecorder API** - Native browser audio recording capabilities

## 🎨 Visual Design

### Cosmic Background
- **Epic Space Scene** - Real cosmic imagery featuring nebulas, planets, and stellar horizons
- **Dynamic Overlay** - Subtle dark layer for optimal text readability
- **Fixed Attachment** - Background stays in place while content scrolls

### Glass Morphism Elements
- **Transparent Cards** - Frosted glass effect with backdrop blur
- **Glowing Borders** - Subtle illumination that complements the cosmic theme
- **Hover Animations** - Interactive effects that respond to user interaction
- **Cosmic Color Palette** - Space-inspired gradients and stellar glow effects

## 📊 API Endpoints

The Voice Agent provides several REST API endpoints for different AI capabilities:

### `/llm/query` - LLM Text Generation (Day 8)
```bash
curl -X POST http://localhost:5000/llm/query \
  -H "Content-Type: application/json" \
  -d '{"text": "Explain artificial intelligence in simple terms"}'
```

### `/tts/echo` - Echo Bot v2 (Day 7)
Upload audio file to get AI transcription and voice regeneration:
```bash
curl -X POST http://localhost:5000/tts/echo \
  -F "audio=@recording.webm"
```

### `/transcribe/file` - Audio Transcription (Day 6)
```bash
curl -X POST http://localhost:5000/transcribe/file \
  -F "audio=@audio_file.mp3"
```

### `/generate-audio` - Text-to-Speech
```bash
curl -X POST http://localhost:5000/generate-audio \
  -d "text=Hello world"
```

## 🔧 API Integration Details

### Google Gemini LLM
- **Model**: `gemini-2.5-flash`
- **Capabilities**: Text generation, creative writing, Q&A, analysis
- **Input**: JSON with text field
- **Output**: JSON with AI-generated response

### AssemblyAI Transcription
- **Accuracy**: High-precision speech recognition
- **Formats**: MP3, WAV, WEBM, OGG, M4A, MP4
- **Features**: Confidence scoring, real-time processing
- **Processing**: Binary audio data handling

### Murf AI Text-to-Speech
- **Voice**: English (US) - Natalie (Natural female voice)
- **Format**: High-quality MP3 audio
- **Parameters**: Configurable voice settings

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key for LLM services | ✅ Yes | None |
| `ASSEMBLYAI_API_KEY` | AssemblyAI API key for transcription | ✅ Yes | None |
| `MURF_API_KEY` | Murf AI API key for TTS services | ✅ Yes | None |
| `SESSION_SECRET` | Flask session security key | ❌ No | Auto-generated |

## 📱 Browser Compatibility

### Required Features
- **Modern Browser**: Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
- **Audio Support**: HTML5 audio playback and MediaRecorder API
- **CSS Features**: CSS Grid, Flexbox, backdrop-filter, and CSS animations
- **JavaScript**: ES6+ support for modern functionality

### Optimal Experience
- **Desktop**: Full cosmic background visibility and smooth animations
- **Mobile**: Responsive design with touch-optimized controls
- **Tablet**: Perfect balance of visual impact and usability

## 🎯 Use Cases

### AI Development & Research
- **LLM Integration** - Test and develop intelligent text generation features
- **Voice AI Pipeline** - Build complete voice-to-voice AI workflows
- **Multimodal AI** - Combine text, speech, and audio processing
- **Prototype Development** - Rapid AI feature prototyping and testing

### Professional Applications
- **Content Creation** - Generate AI content and professional voiceovers
- **AI Assistants** - Build intelligent voice-powered applications
- **Accessibility** - Provide comprehensive audio alternatives
- **E-learning** - Create interactive AI-powered educational content

### Development & Testing
- **Voice UI Testing** - Test complete voice interaction workflows
- **API Integration** - Learn modern AI service integration patterns
- **Audio Processing** - Understand speech-to-text and text-to-speech pipelines

## 🔒 Security & Privacy

- **Secure API Storage** - All API keys stored in environment variables
- **Client-side Processing** - Audio recording handled locally in browser
- **No Data Persistence** - Generated audio not stored on server
- **Session Security** - Encrypted session management
- **HTTPS Ready** - Secure communication for production deployment

## 🌟 Recent Updates

### Day 8 - LLM Integration ✨
- **Google Gemini AI** - Integrated advanced language model for intelligent text generation
- **Smart API Endpoint** - New `/llm/query` endpoint for AI-powered responses
- **Enhanced Intelligence** - Support for creative writing, explanations, and conversations

### Day 7 - Echo Bot v2 🔄
- **Complete Voice Pipeline** - Record → Transcribe → Regenerate workflow
- **AssemblyAI Integration** - High-accuracy speech-to-text transcription
- **Seamless Processing** - Single endpoint handles entire voice transformation

### Day 6 - Audio Transcription 📝
- **Real-time Transcription** - Convert audio to text with confidence scoring
- **Multiple Format Support** - Handle various audio file formats
- **Efficient Processing** - Binary audio processing for optimal performance

## 📁 Project Structure

```
voice-agent/
├── app.py                      # Main Flask application
├── main.py                     # Application entry point
├── templates/
│   └── index.html             # Main HTML template with cosmic theme
├── static/
│   ├── css/
│   │   └── style.css          # Custom styles with glass morphism
│   ├── js/
│   │   └── script.js          # Client-side JavaScript
│   └── assets/
│       └── image_*.png        # Cosmic background image
├── README.md                  # Project documentation
├── LICENSE                    # MIT License
└── pyproject.toml            # Python dependencies
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Deployment

### Replit Deployment
This application is optimized for Replit deployment with:
- Pre-configured workflow for automatic server startup
- Environment variable management through Replit Secrets
- Optimized for Replit's infrastructure and domain system

### Self-Hosted Deployment
```bash
# Production deployment
gunicorn --bind 0.0.0.0:5000 --workers 4 main:app
```

## 💡 Future Enhancements

### AI & Machine Learning
- **Multi-model LLM** - Support for different AI models (GPT, Claude, etc.)
- **Voice Cloning** - Custom voice generation and personality traits
- **Sentiment Analysis** - Emotion detection in voice and text
- **Context Memory** - Conversation history and context retention

### Voice & Audio
- **Multiple Voice Options** - Different languages, accents, and personalities
- **Real-time Processing** - Live voice transformation and effects
- **Audio Enhancement** - Noise reduction, echo cancellation
- **Voice Commands** - Natural language voice control interface

### Platform & Integration
- **Webhook Support** - Integration with external systems
- **API Rate Limiting** - Enhanced performance and usage controls
- **User Authentication** - Personal accounts and preferences
- **Cloud Storage** - Save and manage voice projects

## 🐛 Troubleshooting

### Common Issues

**Audio Generation Failed**
- Verify your Murf API key is correct and active
- Check your Murf account has sufficient credits
- Ensure stable internet connection

**Background Image Not Loading**
- Check that the cosmic background image is in `/static/assets/`
- Verify image file permissions
- Clear browser cache and reload

**Audio Won't Play**
- Check browser audio permissions
- Ensure HTML5 audio support
- Try a different browser

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/cosmic-enhancement`)
3. Commit your changes (`git commit -m 'Add cosmic feature'`)
4. Push to the branch (`git push origin feature/cosmic-enhancement`)
5. Open a Pull Request

---

🌌 **Build the future of AI voice agents!** Complete with LLM integration, voice transcription, and intelligent audio processing - demonstrating the evolution of AI technology integration in modern web applications.
