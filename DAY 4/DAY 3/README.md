[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# Voice Agent - AI Voice Generator

A beautiful web-based text-to-speech application that converts user input text into high-quality audio using the Murf AI TTS API. Features a modern glassmorphism design with animated backgrounds and provides an intuitive interface for generating speech from text.

## 🎯 Features

- **Text-to-Speech Conversion**: Convert any text to high-quality speech using Murf AI
- **Modern Glass Design**: Beautiful glassmorphism UI with animated gradient backgrounds
- **HTML5 Audio Player**: Built-in audio player for immediate playback
- **Download & Share**: Download generated audio or copy audio URLs
- **Mobile Responsive**: Works seamlessly across all devices
- **Character Counter**: Real-time character counting with visual feedback
- **Input Validation**: Form validation with helpful error messages
- **Loading States**: Visual feedback during audio generation

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Murf AI API Key (get one at [murf.ai](https://murf.ai))

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up your environment variables:
   - Add your Murf API key as `MURF_API_KEY`
   - Optionally set `SESSION_SECRET` for session security

### Running the Application

Start the application with:
```bash
gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app
```

Or for development:
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MURF_API_KEY` | Your Murf AI API key | Yes |
| `SESSION_SECRET` | Flask session secret key | No (has fallback) |

### Voice Configuration

The application uses `en-US-natalie` as the default voice. You can modify the voice in `app.py`:

```python
payload = {
    'text': text,
    'voiceId': 'en-US-natalie',  # Change this to your preferred voice
    'format': 'MP3'
}
```

To see available voices, check the [Murf Voice Library](https://murf.ai/api/docs/voices-styles/voice-library).

## 📱 Usage

1. **Enter Text**: Type or paste your text in the input field (max 500 characters)
2. **Generate Audio**: Click the "Generate Audio" button
3. **Play Audio**: The generated audio will automatically appear with playback controls
4. **Download**: Use the download button to save the audio file
5. **Share**: Copy the audio URL to share with others

### Keyboard Shortcuts

- `Ctrl/Cmd + Enter`: Submit the form
- `Escape`: Clear the text field (when focused)

## 🎨 Design Features

- **Glassmorphism Effect**: Modern glass-like UI elements with backdrop blur
- **Animated Background**: Dynamic gradient background with floating elements
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Visual Feedback**: Loading states, hover effects, and click animations
- **Character Counter**: Real-time feedback with color coding

## 🛠️ Technical Stack

### Backend
- **Flask**: Python web framework
- **Gunicorn**: WSGI HTTP Server
- **Requests**: HTTP library for API calls

### Frontend
- **Bootstrap 5.3.2**: CSS framework
- **Font Awesome 6.4.0**: Icon library
- **Google Fonts (Inter)**: Typography
- **Custom CSS**: Glassmorphism design
- **Vanilla JavaScript**: Client-side interactions

### API Integration
- **Murf AI API**: Text-to-speech conversion service
- **Authentication**: API key-based authentication
- **Audio Format**: MP3 output format

## 📁 Project Structure

```
voice-agent/
├── app.py              # Main Flask application
├── main.py             # Application entry point
├── templates/
│   └── index.html      # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css   # Custom styles
│   └── js/
│       └── script.js   # Client-side JavaScript
├── README.md           # This file
├── replit.md           # Project documentation
└── pyproject.toml      # Python dependencies
```

## 🔒 Security

- API keys are stored as environment variables
- Session secrets are configurable
- Input validation prevents malicious submissions
- Request timeouts prevent hanging connections

## 📊 API Limits

- Text input limited to 500 characters
- Generated audio files are available for 72 hours
- API rate limits depend on your Murf subscription plan

## 🐛 Troubleshooting

### Common Issues

**Audio Generation Failed (400 Error)**
- Check that your Murf API key is valid
- Ensure the voice ID exists in Murf's voice library
- Verify your Murf account has sufficient credits

**Audio Won't Play**
- Check browser audio permissions
- Ensure stable internet connection
- Try refreshing the page

**Loading Issues**
- Clear browser cache
- Check console for JavaScript errors
- Verify all dependencies are loaded

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Replit (recommended)
- Heroku
- Railway
- DigitalOcean App Platform

Make sure to set the `MURF_API_KEY` environment variable in your deployment platform.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:

- The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
- The software is provided "as is", without warranty of any kind.

For the full license text, see the [LICENSE](LICENSE) file in this repository.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues with the Murf API, visit [Murf API Documentation](https://murf.ai/api/docs).

---

**Made with modern web technologies and powered by Murf AI**
