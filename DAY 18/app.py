import os
import logging
import requests
from flask import Flask, render_template, request, jsonify, flash, redirect, url_for

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "fallback_secret_key")

# Murf API configuration
MURF_API_KEY = os.getenv("MURF_API_KEY", "default_murf_key")
MURF_API_URL = "https://api.murf.ai/v1/speech/generate"

@app.route('/')
def index():
    """Main page with TTS interface"""
    return render_template('index.html')

@app.route('/generate-audio', methods=['POST'])
def generate_audio():
    """Generate audio using Murf TTS API"""
    try:
        # Get text from form
        text = request.form.get('text', '').strip()
        
        if not text:
            flash('Please enter some text to convert to speech.', 'error')
            return redirect(url_for('index'))
        
        # Prepare Murf API request
        headers = {
            'api-key': MURF_API_KEY,
            'Content-Type': 'application/json'
        }
        
        payload = {
            'text': text,
            'voiceId': 'en-US-natalie',  # Valid Murf voice ID
            'format': 'MP3'
        }
        
        # Make request to Murf API
        app.logger.debug(f"Making request to Murf API with text: {text}")
        response = requests.post(MURF_API_URL, json=payload, headers=headers, timeout=30)
        
        if response.status_code == 200:
            audio_data = response.json()
            audio_url = audio_data.get('audioFile', '')
            
            if audio_url:
                flash('Audio generated successfully!', 'success')
                return render_template('index.html', audio_url=audio_url, text=text)
            else:
                flash('Audio generation failed: No audio URL returned.', 'error')
                return redirect(url_for('index'))
        else:
            app.logger.error(f"Murf API error: {response.status_code} - {response.text}")
            flash(f'Audio generation failed: API returned status {response.status_code}', 'error')
            return redirect(url_for('index'))
            
    except requests.exceptions.Timeout:
        flash('Audio generation timed out. Please try again.', 'error')
        return redirect(url_for('index'))
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Request error: {str(e)}")
        flash('Network error occurred. Please check your connection and try again.', 'error')
        return redirect(url_for('index'))
    except Exception as e:
        app.logger.error(f"Unexpected error: {str(e)}")
        flash('An unexpected error occurred. Please try again.', 'error')
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
