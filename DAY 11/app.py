import os
import logging
import requests
import assemblyai as aai
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
from google import genai
from google.genai import types

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

# Google Gemini configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_client = None
if GEMINI_API_KEY:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)

# Upload configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'webm', 'ogg', 'm4a', 'mp4'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Day 10: In-memory chat history datastore
# Format: {session_id: [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
chat_history_store = {}

# Day 11: Error handling constants and fallback responses
ERROR_RESPONSES = {
    'tts_fallback': "I'm having trouble generating speech right now. Please try again in a moment.",
    'stt_fallback': "I couldn't understand your audio. Could you please speak more clearly or try typing your message?",
    'llm_fallback': "I'm experiencing some connection issues right now. Let me try to help you in a moment.",
    'api_timeout': "The service is taking longer than expected. Please try again.",
    'network_error': "I'm having trouble connecting right now. Please check your connection and try again."
}

def generate_fallback_audio(error_type='network_error'):
    """Generate fallback audio response for API failures"""
    fallback_text = ERROR_RESPONSES.get(error_type, ERROR_RESPONSES['network_error'])
    
    try:
        # Try to use Murf API for fallback audio
        if MURF_API_KEY and MURF_API_KEY != "default_murf_key":
            headers = {
                'api-key': MURF_API_KEY,
                'Content-Type': 'application/json'
            }
            
            payload = {
                'text': fallback_text,
                'voiceId': 'en-US-natalie',
                'format': 'MP3'
            }
            
            response = requests.post(MURF_API_URL, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 200:
                import time
                audio_filename = f"fallback_{error_type}_{int(time.time())}.mp3"
                audio_path = os.path.join('static', 'audio', audio_filename)
                
                os.makedirs(os.path.dirname(audio_path), exist_ok=True)
                
                with open(audio_path, 'wb') as f:
                    f.write(response.content)
                
                return f"/static/audio/{audio_filename}", fallback_text
    except Exception as e:
        app.logger.error(f"Failed to generate fallback audio: {str(e)}")
    
    # Return text-only fallback if audio generation fails
    return None, fallback_text

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    """Main page with TTS interface"""
    # Accept session_id parameter but don't require it
    session_id = request.args.get('session_id')
    return render_template('index.html')

@app.route('/generate-audio', methods=['POST'])
def generate_audio():
    """Generate audio using Murf TTS API with comprehensive error handling"""
    try:
        # Get text from form
        text = request.form.get('text', '').strip()
        
        if not text:
            flash('Please enter some text to convert to speech.', 'error')
            return redirect(url_for('index'))
        
        # Check if Murf API key is configured
        if not MURF_API_KEY or MURF_API_KEY == "default_murf_key":
            app.logger.error("Murf API key not configured")
            flash('Text-to-speech service is currently unavailable. Please try again later.', 'error')
            return redirect(url_for('index'))
        
        # Validate text length
        if len(text) > 3000:
            flash('Text is too long. Please keep it under 3000 characters.', 'warning')
            return redirect(url_for('index'))
        
        app.logger.debug(f"Making request to Murf API with text: {text}")
        
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
        
        # Make request to Murf API with comprehensive error handling
        response = requests.post(MURF_API_URL, json=payload, headers=headers, timeout=30)
        
        if response.status_code == 200:
            audio_data = response.json()
            audio_url = audio_data.get('audioFile', '')
            
            if audio_url:
                flash('Audio generated successfully!', 'success')
                return render_template('index.html', audio_url=audio_url, text=text)
            else:
                app.logger.error("Murf API returned no audio URL")
                flash('Audio generation failed: No audio URL returned from service.', 'error')
                return redirect(url_for('index'))
        elif response.status_code == 401:
            app.logger.error("Murf API authentication failed")
            flash('Authentication failed. Please check API configuration.', 'error')
            return redirect(url_for('index'))
        elif response.status_code == 429:
            app.logger.error("Murf API rate limit exceeded")
            flash('Rate limit exceeded. Please wait a moment and try again.', 'warning')
            return redirect(url_for('index'))
        elif response.status_code >= 500:
            app.logger.error(f"Murf API server error: {response.status_code}")
            flash('Text-to-speech service is experiencing issues. Please try again later.', 'error')
            return redirect(url_for('index'))
        else:
            app.logger.error(f"Murf API error: {response.status_code} - {response.text}")
            flash(f'Audio generation failed: Service returned error {response.status_code}', 'error')
            return redirect(url_for('index'))
            
    except requests.exceptions.Timeout:
        app.logger.error("Murf API request timed out")
        flash('Audio generation timed out. The service may be busy. Please try again.', 'warning')
        return redirect(url_for('index'))
    except requests.exceptions.ConnectionError:
        app.logger.error("Failed to connect to Murf API")
        flash('Unable to connect to text-to-speech service. Please check your internet connection.', 'error')
        return redirect(url_for('index'))
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Request error: {str(e)}")
        flash('Network error occurred. Please check your connection and try again.', 'error')
        return redirect(url_for('index'))
    except ValueError as e:
        app.logger.error(f"JSON decode error: {str(e)}")
        flash('Invalid response from text-to-speech service. Please try again.', 'error')
        return redirect(url_for('index'))
    except Exception as e:
        app.logger.error(f"Unexpected error in generate_audio: {str(e)}")
        flash('An unexpected error occurred. Our team has been notified. Please try again.', 'error')
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

@app.route('/llm/query', methods=['POST'])
def llm_query():
    """Day 9: Enhanced LLM Query endpoint supporting both text and audio input with TTS response"""
    try:
        # Check if APIs are configured
        if not GEMINI_API_KEY or not gemini_client:
            return jsonify({
                'success': False,
                'error': 'Gemini API key not configured'
            }), 500
        
        if not MURF_API_KEY:
            return jsonify({
                'success': False,
                'error': 'Murf API key not configured'
            }), 500
        
        # Determine input type and extract text
        text_input = ""
        input_source = "text"
        
        # Check if audio file is provided
        if 'audio' in request.files and request.files['audio'].filename:
            # Audio input - transcribe first
            input_source = "audio"
            
            if not ASSEMBLYAI_API_KEY:
                return jsonify({
                    'success': False,
                    'error': 'AssemblyAI API key not configured for audio transcription'
                }), 500
            
            audio_file = request.files['audio']
            
            # Check file extension
            if not allowed_file(audio_file.filename):
                return jsonify({
                    'success': False,
                    'error': 'Audio file type not allowed. Supported formats: MP3, WAV, WEBM, OGG, M4A, MP4'
                }), 400
            
            # Read audio data and transcribe
            audio_data = audio_file.read()
            app.logger.info(f"Processing audio input: {audio_file.filename} ({len(audio_data)} bytes)")
            
            transcriber = aai.Transcriber()
            transcript = transcriber.transcribe(audio_data)
            
            if transcript.status == aai.TranscriptStatus.error:
                app.logger.error(f"Transcription failed: {transcript.error}")
                return jsonify({
                    'success': False,
                    'error': f'Audio transcription failed: {transcript.error}'
                }), 500
            
            text_input = (transcript.text or "").strip()
            if not text_input:
                app.logger.error("Transcription returned empty text")
                return jsonify({
                    'success': False,
                    'error': 'Audio transcription returned no text. Please speak more clearly or try again.'
                }), 400
            app.logger.info(f"Audio transcribed successfully: {text_input}")
            
        else:
            # Text input (JSON or form data)
            if request.is_json:
                data = request.get_json()
                if data:
                    text_input = data.get('text', '').strip()
            else:
                text_input = request.form.get('text', '').strip()
        
        if not text_input:
            return jsonify({
                'success': False,
                'error': f'No {"transcribable audio" if input_source == "audio" else "text"} input provided'
            }), 400
        
        app.logger.info(f"Processing LLM query from {input_source}: {text_input}")
        
        # Generate response using Gemini API with prompt optimization for TTS
        enhanced_prompt = f"""Please provide a concise, natural response suitable for text-to-speech conversion. Keep responses under 2500 characters for optimal voice synthesis. 

User question: {text_input}

Response:"""
        
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=enhanced_prompt
        )
        
        if not response.text:
            app.logger.error("Gemini API returned empty response")
            return jsonify({
                'success': False,
                'error': 'LLM generated empty response'
            }), 500
        
        llm_response = response.text.strip()
        
        # Truncate response if too long for Murf API (3000 character limit)
        if len(llm_response) > 2800:
            llm_response = llm_response[:2800] + "... [Response truncated for voice synthesis]"
            app.logger.warning(f"LLM response truncated to fit Murf API limits")
        
        app.logger.info(f"LLM response generated successfully ({len(llm_response)} characters)")
        
        # Generate speech using Murf API
        murf_headers = {
            'api-key': MURF_API_KEY,
            'Content-Type': 'application/json'
        }
        
        murf_payload = {
            'text': llm_response,
            'voiceId': 'en-US-natalie',
            'format': 'MP3'
        }
        
        app.logger.info(f"Generating speech for LLM response using Murf API")
        murf_response = requests.post(MURF_API_URL, json=murf_payload, headers=murf_headers, timeout=60)
        
        if murf_response.status_code == 200:
            # Save audio file
            import time
            audio_filename = f"llm_response_{int(time.time())}.mp3"
            audio_path = os.path.join('static', 'audio', audio_filename)
            
            # Ensure audio directory exists
            os.makedirs(os.path.dirname(audio_path), exist_ok=True)
            
            # Write audio data to file
            with open(audio_path, 'wb') as f:
                f.write(murf_response.content)
            
            audio_url = f"/static/audio/{audio_filename}"
            app.logger.info(f"Audio generated successfully: {audio_url}")
            
            return jsonify({
                'success': True,
                'response': llm_response,
                'input': text_input,
                'input_source': input_source,
                'model': 'gemini-2.5-flash',
                'audio_url': audio_url,
                'audio_file': audio_filename
            })
        else:
            app.logger.error(f"Murf API error: {murf_response.status_code} - {murf_response.text}")
            # Return text response even if audio generation fails
            return jsonify({
                'success': True,
                'response': llm_response,
                'input': text_input,
                'input_source': input_source,
                'model': 'gemini-2.5-flash',
                'audio_error': f'Speech generation failed: Murf API returned status {murf_response.status_code}'
            })
        
    except Exception as e:
        app.logger.error(f"Error in LLM query processing: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'LLM query failed: {str(e)}'
        }), 500

@app.route('/agent/chat/<session_id>', methods=['POST'])
def agent_chat(session_id):
    """Day 10: Chat endpoint with conversation history and comprehensive error handling"""
    try:
        # Check for Gemini API key
        if not gemini_client:
            return jsonify({
                'success': False,
                'error': 'Google Gemini API key not configured'
            }), 500
        
        # Initialize variables at the start
        input_source = "text" 
        text_input = ""
        
        if 'audio' in request.files:
            # Audio input processing
            input_source = "audio"
            
            if not ASSEMBLYAI_API_KEY:
                return jsonify({
                    'success': False,
                    'error': 'AssemblyAI API key not configured for audio transcription'
                }), 500
            
            audio_file = request.files['audio']
            
            # Check file extension
            if not allowed_file(audio_file.filename):
                return jsonify({
                    'success': False,
                    'error': 'Audio file type not allowed. Supported formats: MP3, WAV, WEBM, OGG, M4A, MP4'
                }), 400
            
            # Read audio data and transcribe
            audio_data = audio_file.read()
            app.logger.info(f"Processing audio input for session {session_id}: {audio_file.filename} ({len(audio_data)} bytes)")
            
            transcriber = aai.Transcriber()
            transcript = transcriber.transcribe(audio_data)
            
            if transcript.status == aai.TranscriptStatus.error:
                app.logger.error(f"Transcription failed: {transcript.error}")
                return jsonify({
                    'success': False,
                    'error': f'Audio transcription failed: {transcript.error}'
                }), 500
            
            text_input = (transcript.text or "").strip()
            if not text_input:
                app.logger.error("Transcription returned empty text")
                return jsonify({
                    'success': False,
                    'error': 'Audio transcription returned no text. Please speak more clearly or try again.'
                }), 400
            app.logger.info(f"Audio transcribed successfully: {text_input}")
            
        else:
            # Text input (JSON or form data)
            if request.is_json:
                data = request.get_json()
                if data:
                    text_input = data.get('text', '').strip()
            else:
                text_input = request.form.get('text', '').strip()
        
        if not text_input:
            return jsonify({
                'success': False,
                'error': f'No {"transcribable audio" if input_source == "audio" else "text"} input provided'
            }), 400
        
        app.logger.info(f"Processing chat message for session {session_id} from {input_source}: {text_input}")
        
        # Initialize session history if it doesn't exist
        if session_id not in chat_history_store:
            chat_history_store[session_id] = []
        
        # Add user message to chat history
        chat_history_store[session_id].append({
            "role": "user",
            "content": text_input
        })
        
        # Build conversation context for LLM
        conversation_context = "You are a helpful AI voice assistant engaged in a natural conversation. Provide concise, natural responses suitable for text-to-speech conversion. Keep responses under 2500 characters for optimal voice synthesis.\n\nConversation history:\n"
        
        # Add previous messages to context
        for message in chat_history_store[session_id]:
            if message["role"] == "user":
                conversation_context += f"User: {message['content']}\n"
            else:
                conversation_context += f"Assistant: {message['content']}\n"
        
        conversation_context += "\nPlease respond to the latest user message:"
        
        # Generate response using Gemini API
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=conversation_context
        )
        
        if not response or not response.text:
            app.logger.error("Gemini API returned empty response")
            return jsonify({
                'success': False,
                'error': 'LLM failed to generate a response'
            }), 500
        
        llm_response = response.text.strip()
        
        # Add assistant response to chat history
        chat_history_store[session_id].append({
            "role": "assistant",
            "content": llm_response
        })
        
        # Truncate response if needed for Murf API
        if len(llm_response) > 3000:
            llm_response = llm_response[:2800] + "... [Response truncated for voice synthesis]"
            app.logger.warning(f"LLM response truncated to fit Murf API limits")
        
        app.logger.info(f"Chat response generated for session {session_id} ({len(llm_response)} characters)")
        
        # Generate speech using Murf API
        murf_headers = {
            'api-key': MURF_API_KEY,
            'Content-Type': 'application/json'
        }
        
        murf_payload = {
            'text': llm_response,
            'voiceId': 'en-US-natalie',
            'format': 'MP3'
        }
        
        app.logger.info(f"Generating speech for chat response using Murf API")
        murf_response = requests.post(MURF_API_URL, json=murf_payload, headers=murf_headers, timeout=60)
        
        if murf_response.status_code == 200:
            # Save audio file
            import time
            audio_filename = f"chat_response_{session_id}_{int(time.time())}.mp3"
            audio_path = os.path.join('static', 'audio', audio_filename)
            
            # Ensure audio directory exists
            os.makedirs(os.path.dirname(audio_path), exist_ok=True)
            
            # Write audio data to file
            with open(audio_path, 'wb') as f:
                f.write(murf_response.content)
            
            audio_url = f"/static/audio/{audio_filename}"
            app.logger.info(f"Chat audio generated successfully: {audio_url}")
            
            return jsonify({
                'success': True,
                'response': llm_response,
                'input': text_input,
                'input_source': input_source,
                'session_id': session_id,
                'model': 'gemini-2.5-flash',
                'audio_url': audio_url,
                'audio_file': audio_filename,
                'conversation_length': len(chat_history_store[session_id])
            })
        else:
            app.logger.error(f"Murf API error: {murf_response.status_code} - {murf_response.text}")
            # Return text response even if audio generation fails
            return jsonify({
                'success': True,
                'response': llm_response,
                'input': text_input,
                'input_source': input_source,
                'session_id': session_id,
                'model': 'gemini-2.5-flash',
                'conversation_length': len(chat_history_store[session_id]),
                'audio_error': f'Speech generation failed: Murf API returned status {murf_response.status_code}'
            })
        
    except requests.exceptions.Timeout:
        app.logger.error(f"Timeout in chat processing for session {session_id}")
        
        # Generate fallback audio response for timeout
        fallback_audio_url, fallback_text = generate_fallback_audio('api_timeout')
        
        return jsonify({
            'success': True,
            'response': fallback_text,
            'input': text_input if 'text_input' in locals() else "Audio input timed out",
            'input_source': input_source if 'input_source' in locals() else "unknown",
            'session_id': session_id,
            'is_fallback': True,
            'audio_url': fallback_audio_url,
            'conversation_length': len(chat_history_store.get(session_id, []))
        })
    
    except requests.exceptions.ConnectionError:
        app.logger.error(f"Connection error in chat processing for session {session_id}")
        
        # Generate fallback audio response for network error
        fallback_audio_url, fallback_text = generate_fallback_audio('network_error')
        
        return jsonify({
            'success': True,
            'response': fallback_text,
            'input': text_input if 'text_input' in locals() else "Connection error occurred",
            'input_source': input_source if 'input_source' in locals() else "unknown",
            'session_id': session_id,
            'is_fallback': True,
            'audio_url': fallback_audio_url,
            'conversation_length': len(chat_history_store.get(session_id, []))
        })
    
    except Exception as e:
        app.logger.error(f"Unexpected error in chat processing for session {session_id}: {str(e)}")
        
        # Try to generate a more specific fallback based on error type
        if "assemblyai" in str(e).lower() or "transcrib" in str(e).lower():
            fallback_audio_url, fallback_text = generate_fallback_audio('stt_fallback')
        elif "gemini" in str(e).lower() or "llm" in str(e).lower():
            fallback_audio_url, fallback_text = generate_fallback_audio('llm_fallback')
        elif "murf" in str(e).lower() or "tts" in str(e).lower():
            fallback_audio_url, fallback_text = generate_fallback_audio('tts_fallback')
        else:
            fallback_audio_url, fallback_text = generate_fallback_audio('network_error')
        
        return jsonify({
            'success': True,
            'response': fallback_text,
            'input': text_input if 'text_input' in locals() else "Unable to process input",
            'input_source': input_source if 'input_source' in locals() else "unknown",
            'session_id': session_id,
            'is_fallback': True,
            'audio_url': fallback_audio_url,
            'conversation_length': len(chat_history_store.get(session_id, [])),
            'error_details': f'Service temporarily unavailable: {str(e)[:100]}'
        })

@app.route('/agent/chat/<session_id>', methods=['GET'])
def get_chat_history(session_id):
    """Get chat history for a session"""
    if session_id not in chat_history_store:
        return jsonify({
            'success': True,
            'session_id': session_id,
            'conversation_length': 0,
            'history': []
        })
    
    return jsonify({
        'success': True,
        'session_id': session_id,
        'conversation_length': len(chat_history_store[session_id]),
        'history': chat_history_store[session_id]
    })

@app.route('/agent/chat/<session_id>', methods=['DELETE'])
def clear_chat_history(session_id):
    """Clear chat history for a session"""
    if session_id in chat_history_store:
        del chat_history_store[session_id]
        app.logger.info(f"Cleared chat history for session {session_id}")
    
    return jsonify({
        'success': True,
        'session_id': session_id,
        'message': 'Chat history cleared'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
