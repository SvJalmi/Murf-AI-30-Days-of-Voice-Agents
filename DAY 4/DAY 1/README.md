# 30 Days of Voice Agents - Day 1
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to Day 1 of the #30DaysOfVoiceAgents challenge! This project sets up a modern web application with a Python backend using FastAPI and a sleek frontend with advanced CSS features.

## Project Overview

This project demonstrates a complete setup for a voice agent application, including:
- **Backend**: Python FastAPI server
- **Frontend**: HTML/CSS/JavaScript with Glass UI effects
- **Features**: Theme toggle, animations, and interactive elements

## Features

- **FastAPI Backend**: Robust and fast API framework for Python
- **Glass UI Design**: Modern frosted glass effect for UI elements
- **Theme Toggle**: Switch between light and dark themes
- **Animations**: Smooth CSS animations and transitions
- **Interactive Elements**: Clickable buttons with ripple effects
- **Responsive Design**: Works on all device sizes

## Project Structure

```
.
├── app.py              # Flask app (seems to be an older version)
├── backend/
│   ├── main.py         # FastAPI application
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── index.html      # Main HTML file
│   ├── style.css       # Main stylesheet
│   └── main.js         # Main JavaScript file
├── static/
│   ├── script.js       # Additional JavaScript (minimal)
│   └── style.css       # Additional CSS (minimal)
└── templates/
    └── index.html      # Flask template (seems to be an older version)
```

## Getting Started

### Prerequisites

- Python 3.7+
- pip (Python package installer)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 30-days-of-voice-agents-day-1
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

4. Open your browser and navigate to `http://localhost:8000`

### Running with Flask (Alternative)

There's also a Flask version available:

1. Install Flask:
   ```bash
   pip install flask
   ```

2. Run the Flask app:
   ```bash
   python app.py
   ```

3. Open your browser and navigate to `http://localhost:5000`

## Usage

- Visit the main page to see the Glass UI design
- Toggle between light and dark themes using the switch in the top-right corner
- Click the "Click Me!" button to see interactive effects
- The progress bar shows completion status (currently 1/30 days)

## Customization

- Modify `frontend/style.css` to change colors and styling
- Update `frontend/main.js` to add new interactive features
- Extend `backend/main.py` to add new API endpoints

## Contributing

This project is part of the #30DaysOfVoiceAgents challenge. Feel free to fork and contribute improvements!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with FastAPI and modern CSS techniques
- Inspired by glass morphism design trends
- Part of the #30DaysOfVoiceAgents learning series
