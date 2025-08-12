[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# 🌌 Voice Agent - AI Voice Generator

A stunning web-based text-to-speech application that converts text into high-quality audio using the Murf AI TTS API. Features an epic cosmic space background with glass morphism UI elements and floating animations.

## ✨ Features

### 🎤 Text-to-Speech
- High-quality voice synthesis using Murf AI API
- Natural-sounding speech generation with Natalie voice
- Instant audio playback with HTML5 audio controls
- Download generated audio files in MP3 format

### 🎙️ Echo Bot
- Real-time voice recording using MediaRecorder API
- Instant playback of recorded audio
- Interactive recording controls (start/stop/play)
- Browser-based audio processing for privacy

### 🌌 UI Design
- **Glass Morphism Design** - Frosted glass cards with transparency and blur effects
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
   Create a `.env` file with your API keys:
   ```
   MURF_API_KEY=your_murf_api_key_here
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

## 📊 API Configuration

### Murf AI Integration
- **Endpoint**: `https://api.murf.ai/v1/speech/generate`
- **Authentication**: Bearer token with API key
- **Voice Model**: English (US) - Natalie (Natural female voice)
- **Output Format**: High-quality MP3 audio
- **Request Timeout**: 30 seconds for reliable performance

### Audio Parameters
```json
{
  "voiceId": "en-US-natalie",
  "style": "conversational",
  "text": "Your input text",
  "format": "MP3"
}
```

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MURF_API_KEY` | Your Murf AI API key for TTS services | ✅ Yes | None |
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

### Professional Applications
- **Content Creation** - Generate professional voiceovers for videos and presentations
- **Accessibility** - Provide audio alternatives for text content
- **E-learning** - Create engaging educational audio content
- **Marketing** - Produce voice content for advertisements and demos

### Development & Testing
- **Voice UI Testing** - Record and test voice interactions
- **Audio Prototyping** - Quickly generate voice samples for projects
- **Language Learning** - Practice pronunciation and listening skills

## 🔒 Security & Privacy

- **Secure API Storage** - All API keys stored in environment variables
- **Client-side Processing** - Audio recording handled locally in browser
- **No Data Persistence** - Generated audio not stored on server
- **Session Security** - Encrypted session management
- **HTTPS Ready** - Secure communication for production deployment

## 🌟 Recent Updates

- **Epic Cosmic Background** - Integrated stunning space imagery with nebulas and planets
- **Enhanced Glass Effects** - Improved transparency and blur for better cosmic integration
- **Optimized Performance** - Streamlined animations and efficient background rendering
- **Mobile Optimization** - Responsive design that works beautifully on all devices

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

- **Voice Customization** - Multiple voice options and language support
- **Advanced Controls** - Speed, pitch, and tone adjustments
- **Audio Effects** - Echo, reverb, and other audio processing
- **Batch Processing** - Convert multiple texts simultaneously
- **User Profiles** - Save preferences and audio history
- **API Expansion** - Support for additional TTS providers

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

🌌 **Experience the cosmos while creating amazing voice content!** Built with cutting-edge web technologies and a passion for beautiful, functional design.
