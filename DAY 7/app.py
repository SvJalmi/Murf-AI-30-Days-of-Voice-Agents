import os
import logging
import requests
import assemblyai as aai
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, jsonify, flash, redirect, url_for

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "fallback_secret_key")

# API configurations
MURF_API_KEY = os.getenv("MURF_API_KEY", "default_murf_key")
MURF_API_URL = "https://api.murf.ai/v1/speech/generate"

# AssemblyAI configuration
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
if ASSEMBLYAI_API_KEY:
    aai.settings.api_key = ASSEMBLYAI_API_KEY

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

@app.route('/transcribe/file', methods=['POST'])
def transcribe_file():
    """Transcribe audio file using AssemblyAI"""
    try:
        # Check if AssemblyAI API key is configured
        if not ASSEMBLYAI_API_KEY:
            return jsonify({
                'success': False,
                'error': 'AssemblyAI API key not configured'
            }), 500
        
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
        
        # Read file data directly into memory
        audio_data = file.read()
        
        app.logger.info(f"Starting transcription for file: {file.filename} ({len(audio_data)} bytes)")
        
        # Create transcriber and transcribe the audio data
        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(audio_data)
        
        # Check if transcription was successful
        if transcript.status == aai.TranscriptStatus.error:
            app.logger.error(f"Transcription failed: {transcript.error}")
            return jsonify({
                'success': False,
                'error': f'Transcription failed: {transcript.error}'
            }), 500
        
        app.logger.info(f"Transcription completed successfully for {file.filename}")
        
        return jsonify({
            'success': True,
            'transcript': transcript.text,
            'confidence': getattr(transcript, 'confidence', None),
            'file_info': {
                'name': file.filename,
                'size': len(audio_data),
                'size_mb': round(len(audio_data) / (1024 * 1024), 2)
            }
        })
        
    except Exception as e:
        app.logger.error(f"Error transcribing audio file: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Transcription failed: {str(e)}'
        }), 500

@app.route('/tts/echo', methods=['POST'])
def tts_echo():
    """Day 7: Echo Bot v2 - Transcribe audio and generate new audio with Murf TTS"""
    try:
        # Check if both APIs are configured
        if not ASSEMBLYAI_API_KEY:
            return jsonify({
                'success': False,
                'error': 'AssemblyAI API key not configured'
            }), 500
            
        if not MURF_API_KEY or MURF_API_KEY == "default_murf_key":
            return jsonify({
                'success': False,
                'error': 'Murf API key not configured'
            }), 500
        
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
        
        # Read file data directly into memory
        audio_data = file.read()
        
        app.logger.info(f"Starting Echo Bot v2 processing for file: {file.filename} ({len(audio_data)} bytes)")
        
        # Step 1: Transcribe the audio using AssemblyAI
        app.logger.info("Step 1: Transcribing audio with AssemblyAI...")
        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(audio_data)
        
        # Check if transcription was successful
        if transcript.status == aai.TranscriptStatus.error:
            app.logger.error(f"Transcription failed: {transcript.error}")
            return jsonify({
                'success': False,
                'error': f'Transcription failed: {transcript.error}'
            }), 500
        
        transcribed_text = transcript.text
        app.logger.info(f"Transcription successful: {transcribed_text}")
        
        # Step 2: Generate new audio using Murf TTS API
        app.logger.info("Step 2: Generating new audio with Murf TTS...")
        
        # Prepare Murf API request
        headers = {
            'api-key': MURF_API_KEY,
            'Content-Type': 'application/json'
        }
        
        payload = {
            'text': transcribed_text,
            'voiceId': 'en-US-natalie',  # Valid Murf voice ID
            'format': 'MP3'
        }
        
        # Make request to Murf API
        response = requests.post(MURF_API_URL, json=payload, headers=headers, timeout=30)
        
        if response.status_code == 200:
            audio_data_response = response.json()
            audio_url = audio_data_response.get('audioFile', '')
            
            if audio_url:
                app.logger.info(f"Echo Bot v2 processing completed successfully!")
                return jsonify({
                    'success': True,
                    'audio_url': audio_url,
                    'transcript': transcribed_text,
                    'confidence': getattr(transcript, 'confidence', None),
                    'file_info': {
                        'name': file.filename,
                        'size': len(audio_data),
                        'size_mb': round(len(audio_data) / (1024 * 1024), 2)
                    }
                })
            else:
                app.logger.error("Murf API returned no audio URL")
                return jsonify({
                    'success': False,
                    'error': 'Audio generation failed: No audio URL returned from Murf API'
                }), 500
        else:
            app.logger.error(f"Murf API error: {response.status_code} - {response.text}")
            return jsonify({
                'success': False,
                'error': f'Audio generation failed: Murf API returned status {response.status_code}'
            }), 500
            
    except requests.exceptions.Timeout:
        app.logger.error("Echo Bot v2 request timed out")
        return jsonify({
            'success': False,
            'error': 'Request timed out. Please try again.'
        }), 500
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Network error in Echo Bot v2: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Network error occurred. Please check your connection and try again.'
        }), 500
    except Exception as e:
        app.logger.error(f"Error in Echo Bot v2 processing: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Echo Bot v2 processing failed: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
