import os
import logging
import requests
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, jsonify, flash, redirect, url_for

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "fallback_secret_key")

# Murf API configuration
MURF_API_KEY = os.getenv("MURF_API_KEY", "default_murf_key")
MURF_API_URL = "https://api.murf.ai/v1/speech/generate"

# Upload configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'webm', 'ogg', 'm4a', 'mp4'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    """Upload and save audio file from Echo Bot"""
    try:
        # Check if file is in request
        if 'audio' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No audio file provided'
            }), 400
        
        file = request.files['audio']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        # Check file extension
        if not file.filename or not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'File type not allowed. Supported formats: MP3, WAV, WEBM, OGG, M4A, MP4'
            }), 400
        
        # Secure filename and save
        filename = secure_filename(file.filename)
        if not filename:
            # Generate filename if empty or invalid
            import time
            filename = f"recording_{int(time.time())}.webm"
        
        # Ensure uploads directory exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Save file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Get file information
        file_size = os.path.getsize(filepath)
        content_type = file.content_type or 'audio/webm'
        
        app.logger.info(f"Audio file uploaded successfully: {filename} ({file_size} bytes)")
        
        return jsonify({
            'success': True,
            'message': 'Audio file uploaded successfully!',
            'file_info': {
                'name': filename,
                'content_type': content_type,
                'size': file_size,
                'size_mb': round(file_size / (1024 * 1024), 2)
            }
        })
        
    except Exception as e:
        app.logger.error(f"Error uploading audio file: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Upload failed: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
