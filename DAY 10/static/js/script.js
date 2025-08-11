// Voice Agent Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    initializeApp();
});

function initializeApp() {
    // Form handling
    const form = document.getElementById('ttsForm');
    const generateBtn = document.getElementById('generateBtn');
    const textArea = document.getElementById('text');
    
    if (form && generateBtn) {
        // Form submission handling
        form.addEventListener('submit', function(e) {
            // Show loading state
            showLoadingState(generateBtn);
        });
        
        // Character counter
        if (textArea) {
            addCharacterCounter(textArea);
        }
    }
    
    // Audio player enhancements
    enhanceAudioPlayer();
    
    // Add visual effects
    addVisualEffects();
    
    // Auto-hide alerts
    autoHideAlerts();
    
    // Initialize Echo Bot
    initializeEchoBot();
    
    // Initialize AI Assistant
    initializeAiAssistant();
    
    // Day 10: Initialize Conversation Bot
    initializeConversationBot();
}

function showLoadingState(button) {
    button.classList.add('loading');
    button.disabled = true;
    
    // Add a timeout fallback to prevent permanent loading state
    setTimeout(() => {
        if (button.classList.contains('loading')) {
            hideLoadingState(button);
        }
    }, 30000); // 30 second timeout
}

function hideLoadingState(button) {
    button.classList.remove('loading');
    button.disabled = false;
}

function addCharacterCounter(textArea) {
    const maxLength = textArea.getAttribute('maxlength') || 500;
    const counter = document.createElement('div');
    counter.className = 'character-counter glass-help mt-1';
    counter.style.textAlign = 'right';
    
    function updateCounter() {
        const currentLength = textArea.value.length;
        counter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.9) {
            counter.style.color = '#ff6b6b';
        } else if (currentLength > maxLength * 0.7) {
            counter.style.color = '#ffa726';
        } else {
            counter.style.color = 'var(--text-muted)';
        }
    }
    
    textArea.addEventListener('input', updateCounter);
    textArea.parentNode.appendChild(counter);
    updateCounter();
}

function enhanceAudioPlayer() {
    const audioElements = document.querySelectorAll('audio');
    
    audioElements.forEach(audio => {
        // Add loading event listener
        audio.addEventListener('loadstart', function() {
            console.log('Audio loading started');
        });
        
        // Add error handling
        audio.addEventListener('error', function(e) {
            console.error('Audio loading error:', e);
            showNotification('Error loading audio. Please try again.', 'error');
        });
        
        // Add loaded event listener
        audio.addEventListener('loadeddata', function() {
            console.log('Audio loaded successfully');
        });
        
        // Add play/pause visual feedback
        audio.addEventListener('play', function() {
            addAudioVisualFeedback(audio, 'playing');
        });
        
        audio.addEventListener('pause', function() {
            addAudioVisualFeedback(audio, 'paused');
        });
        
        audio.addEventListener('ended', function() {
            addAudioVisualFeedback(audio, 'ended');
        });
    });
}

function addAudioVisualFeedback(audio, state) {
    const audioCard = audio.closest('.audio-card');
    if (audioCard) {
        // Remove all state classes
        audioCard.classList.remove('audio-playing', 'audio-paused', 'audio-ended');
        
        // Add current state class
        if (state === 'playing') {
            audioCard.classList.add('audio-playing');
        } else if (state === 'paused') {
            audioCard.classList.add('audio-paused');
        } else if (state === 'ended') {
            audioCard.classList.add('audio-ended');
        }
    }
}

function addVisualEffects() {
    // Add hover effects to glass cards
    const glassCards = document.querySelectorAll('.glass-card');
    
    glassCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click ripple effect to buttons
    const buttons = document.querySelectorAll('.glass-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

function autoHideAlerts() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        // Auto-hide success alerts after 5 seconds
        if (alert.classList.contains('alert-success')) {
            setTimeout(() => {
                hideAlert(alert);
            }, 5000);
        }
        
        // Auto-hide error alerts after 10 seconds
        if (alert.classList.contains('alert-danger')) {
            setTimeout(() => {
                hideAlert(alert);
            }, 10000);
        }
    });
}

function hideAlert(alert) {
    alert.style.opacity = '0';
    alert.style.transform = 'translateY(-10px)';
    alert.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        alert.remove();
    }, 300);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} glass-alert notification`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Audio URL copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        // Fallback for browsers that don't support clipboard API
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Audio URL copied to clipboard!', 'success');
        } else {
            showNotification('Failed to copy URL. Please copy manually.', 'error');
        }
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        showNotification('Failed to copy URL. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
}

// CSS for ripple animation (injected via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .glass-btn {
        position: relative;
        overflow: hidden;
    }
    
    .audio-playing {
        border-color: rgba(40, 167, 69, 0.5) !important;
        box-shadow: 0 0 20px rgba(40, 167, 69, 0.2) !important;
    }
    
    .notification {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    
    .character-counter {
        font-size: 0.8rem;
        transition: color 0.3s ease;
    }
`;
document.head.appendChild(style);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.getElementById('ttsForm');
        if (form) {
            form.submit();
        }
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        const textArea = document.getElementById('text');
        if (textArea && document.activeElement === textArea) {
            textArea.value = '';
            textArea.focus();
        }
    }
});

// Add form validation
function validateForm() {
    const textArea = document.getElementById('text');
    const text = textArea.value.trim();
    
    if (!text) {
        showNotification('Please enter some text to convert to speech.', 'error');
        textArea.focus();
        return false;
    }
    
    if (text.length > 500) {
        showNotification('Text is too long. Maximum 500 characters allowed.', 'error');
        textArea.focus();
        return false;
    }
    
    return true;
}

// Add form validation to submit event
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ttsForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
                return false;
            }
        });
    }
});

// Echo Bot Implementation
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

function initializeEchoBot() {
    const startBtn = document.getElementById('startRecordBtn');
    const stopBtn = document.getElementById('stopRecordBtn');
    const recordAgainBtn = document.getElementById('recordAgainBtn');
    const downloadBtn = document.getElementById('downloadRecordingBtn');
    
    if (startBtn && stopBtn) {
        startBtn.addEventListener('click', startRecording);
        stopBtn.addEventListener('click', stopRecording);
    }
    
    if (recordAgainBtn) {
        recordAgainBtn.addEventListener('click', recordAgain);
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadRecording);
    }
    
    // Transcription button handlers
    const copyTranscriptionBtn = document.getElementById('copyTranscriptionBtn');
    const transcribeAgainBtn = document.getElementById('transcribeAgainBtn');
    
    if (copyTranscriptionBtn) {
        copyTranscriptionBtn.addEventListener('click', function() {
            const transcriptionText = document.getElementById('transcriptionText');
            if (transcriptionText && transcriptionText.dataset.transcript) {
                navigator.clipboard.writeText(transcriptionText.dataset.transcript).then(() => {
                    showNotification('Transcription copied to clipboard!', 'success');
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    showNotification('Failed to copy transcription', 'error');
                });
            }
        });
    }
    
    if (transcribeAgainBtn) {
        transcribeAgainBtn.addEventListener('click', function() {
            const audioElement = document.getElementById('recordedAudio');
            if (audioElement && audioElement.recordedBlob) {
                // Hide current transcription results
                const transcriptionResults = document.getElementById('transcriptionResults');
                if (transcriptionResults) {
                    transcriptionResults.classList.add('d-none');
                }
                
                // Start new transcription
                transcribeAudioFile(audioElement.recordedBlob);
            }
        });
    }
    
    // Check browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showEchoBotError('Your browser does not support audio recording. Please use a modern browser like Chrome, Firefox, or Safari.');
        return;
    }
}

async function startRecording() {
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                sampleRate: 44100
            } 
        });
        
        // Reset recorded chunks
        recordedChunks = [];
        
        // Create MediaRecorder
        const options = { mimeType: 'audio/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options.mimeType = 'audio/mp4';
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options.mimeType = 'audio/wav';
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    options.mimeType = '';
                }
            }
        }
        
        mediaRecorder = new MediaRecorder(stream, options);
        
        // Event handlers
        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = function() {
            // Stop all tracks to release microphone
            stream.getTracks().forEach(track => track.stop());
            
            // Create blob and play audio
            const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
            const audioURL = URL.createObjectURL(blob);
            
            // Set up audio element
            const audioElement = document.getElementById('recordedAudio');
            audioElement.src = audioURL;
            
            // Show playback section
            const playbackSection = document.getElementById('playbackSection');
            playbackSection.classList.remove('d-none');
            
            // Update status
            updateRecordingStatus('ready', 'Recording complete! Click play to hear your voice.');
            
            // Store blob for download
            audioElement.recordedBlob = blob;
            
            // Process with Echo Bot v2 (transcribe + generate new audio)
            processEchoBotV2(blob);
        };
        
        // Start recording
        mediaRecorder.start();
        isRecording = true;
        
        // Update UI
        updateRecordingButtons(true);
        updateRecordingStatus('recording', 'Recording... Click "Stop Recording" when finished.');
        
        showNotification('Recording started! Speak into your microphone.', 'success');
        
    } catch (error) {
        console.error('Error starting recording:', error);
        
        if (error.name === 'NotAllowedError') {
            showEchoBotError('Microphone access denied. Please allow microphone access and try again.');
        } else if (error.name === 'NotFoundError') {
            showEchoBotError('No microphone found. Please connect a microphone and try again.');
        } else {
            showEchoBotError('Error starting recording: ' + error.message);
        }
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        // Update UI
        updateRecordingButtons(false);
        updateRecordingStatus('processing', 'Processing with Echo Bot v2 (transcribing + generating AI voice)...');
        
        showNotification('Recording stopped! Processing with Echo Bot v2...', 'success');
    }
}

function recordAgain() {
    // Hide playback section
    const playbackSection = document.getElementById('playbackSection');
    playbackSection.classList.add('d-none');
    
    // Hide upload status
    hideUploadStatus();
    
    // Hide transcription status and results
    hideTranscriptionStatus();
    const transcriptionResults = document.getElementById('transcriptionResults');
    if (transcriptionResults) {
        transcriptionResults.classList.add('d-none');
    }
    
    // Reset audio element
    const audioElement = document.getElementById('recordedAudio');
    if (audioElement.src) {
        URL.revokeObjectURL(audioElement.src);
        audioElement.src = '';
    }
    
    // Reset status
    updateRecordingStatus('ready', 'Click "Start Recording" to record again.');
    
    // Reset recorded chunks
    recordedChunks = [];
}

function downloadRecording() {
    const audioElement = document.getElementById('recordedAudio');
    
    if (audioElement.recordedBlob) {
        const url = URL.createObjectURL(audioElement.recordedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `voice-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Recording downloaded!', 'success');
    } else {
        showNotification('No recording available to download.', 'error');
    }
}

function updateRecordingButtons(recording) {
    const startBtn = document.getElementById('startRecordBtn');
    const stopBtn = document.getElementById('stopRecordBtn');
    
    if (startBtn && stopBtn) {
        startBtn.disabled = recording;
        stopBtn.disabled = !recording;
        
        if (recording) {
            startBtn.innerHTML = '<i class="fas fa-circle me-2"></i>Recording...';
            stopBtn.innerHTML = '<i class="fas fa-stop me-2"></i>Stop Recording';
        } else {
            startBtn.innerHTML = '<i class="fas fa-circle me-2"></i>Start Recording';
            stopBtn.innerHTML = '<i class="fas fa-stop me-2"></i>Stop Recording';
        }
    }
}

function updateRecordingStatus(state, message) {
    const statusElement = document.getElementById('recordingStatus');
    
    if (statusElement) {
        // Remove all state classes
        statusElement.classList.remove('recording', 'ready', 'processing');
        
        // Add current state class
        if (state) {
            statusElement.classList.add(state);
        }
        
        // Update icon and message
        let icon = 'fas fa-info-circle';
        if (state === 'recording') {
            icon = 'fas fa-microphone recording-indicator';
        } else if (state === 'ready') {
            icon = 'fas fa-check-circle';
        } else if (state === 'processing') {
            icon = 'fas fa-spinner fa-spin';
        }
        
        statusElement.innerHTML = `
            <div class="d-flex align-items-center justify-content-center">
                <i class="${icon} me-2"></i>
                <span>${message}</span>
            </div>
        `;
    }
}

function showEchoBotError(message) {
    updateRecordingStatus('error', message);
    showNotification(message, 'error');
    
    // Disable recording buttons
    const startBtn = document.getElementById('startRecordBtn');
    const stopBtn = document.getElementById('stopRecordBtn');
    
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = true;
}

// Upload audio file to server
async function uploadAudioFile(blob) {
    try {
        // Show upload status
        updateUploadStatus('uploading', 'Uploading audio to server...');
        
        // Create FormData
        const formData = new FormData();
        const filename = `voice-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
        formData.append('audio', blob, filename);
        
        // Upload file
        const response = await fetch('/upload-audio', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success status with file info
            const fileInfo = result.file_info;
            const message = `Upload successful! File: ${fileInfo.name} (${fileInfo.size_mb}MB)`;
            updateUploadStatus('success', message);
            
            showNotification(`Audio uploaded successfully! Size: ${fileInfo.size_mb}MB`, 'success');
            
            // Hide upload status after 5 seconds
            setTimeout(() => {
                hideUploadStatus();
            }, 5000);
            
        } else {
            // Show error status
            updateUploadStatus('error', `Upload failed: ${result.error}`);
            showNotification(`Upload failed: ${result.error}`, 'error');
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        updateUploadStatus('error', 'Network error during upload');
        showNotification('Network error during upload. Please try again.', 'error');
    }
}

function updateUploadStatus(state, message) {
    const uploadStatus = document.getElementById('uploadStatus');
    const uploadContent = document.getElementById('uploadStatusContent');
    
    if (uploadStatus && uploadContent) {
        // Show upload status section
        uploadStatus.classList.remove('d-none');
        
        // Remove all state classes
        uploadStatus.classList.remove('upload-uploading', 'upload-success', 'upload-error');
        
        // Add current state class
        uploadStatus.classList.add(`upload-${state}`);
        
        // Update icon and message
        let icon = 'fas fa-upload';
        if (state === 'uploading') {
            icon = 'fas fa-spinner fa-spin';
        } else if (state === 'success') {
            icon = 'fas fa-check-circle';
        } else if (state === 'error') {
            icon = 'fas fa-exclamation-triangle';
        }
        
        uploadContent.innerHTML = `
            <i class="${icon} me-2"></i>
            <span>${message}</span>
        `;
    }
}

function hideUploadStatus() {
    const uploadStatus = document.getElementById('uploadStatus');
    if (uploadStatus) {
        uploadStatus.classList.add('d-none');
    }
}

// Transcribe audio file using AssemblyAI
async function transcribeAudioFile(blob) {
    try {
        // Show transcription status
        updateTranscriptionStatus('transcribing', 'Transcribing audio with AssemblyAI...');
        
        // Create FormData
        const formData = new FormData();
        const filename = `voice-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
        formData.append('audio', blob, filename);
        
        // Send to transcription endpoint
        const response = await fetch('/transcribe/file', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Hide transcription status
            hideTranscriptionStatus();
            
            // Show transcription results
            showTranscriptionResults(result.transcript, result.file_info);
            
            showNotification('Transcription completed successfully!', 'success');
            
        } else {
            // Show error status
            updateTranscriptionStatus('error', `Transcription failed: ${result.error}`);
            showNotification(`Transcription failed: ${result.error}`, 'error');
        }
        
    } catch (error) {
        console.error('Transcription error:', error);
        updateTranscriptionStatus('error', 'Network error during transcription');
        showNotification('Network error during transcription. Please try again.', 'error');
    }
}

// Echo Bot v2: Process audio with transcription + TTS generation
async function processEchoBotV2(blob) {
    try {
        // Show processing status
        updateRecordingStatus('processing', 'Echo Bot v2: Transcribing audio and generating AI voice...');
        
        // Create FormData
        const formData = new FormData();
        const filename = `voice-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
        formData.append('audio', blob, filename);
        
        // Send to Echo Bot v2 endpoint
        const response = await fetch('/tts/echo', {
            method: 'POST',
            body: formData
        });
        
        // Check if response is ok
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Echo Bot v2 response:', result);
        
        if (result.success) {
            console.log('Echo Bot v2 success - showing results');
            
            // Show transcription results
            showTranscriptionResults(result.transcript, result.file_info);
            
            // Set up AI-generated audio instead of original recording
            const audioElement = document.getElementById('recordedAudio');
            console.log('Audio element:', audioElement);
            console.log('Audio URL:', result.audio_url);
            
            if (audioElement && result.audio_url) {
                audioElement.src = result.audio_url;
                
                // Show playback section
                const playbackSection = document.getElementById('playbackSection');
                console.log('Playback section:', playbackSection);
                
                if (playbackSection) {
                    playbackSection.classList.remove('d-none');
                    console.log('Playback section should now be visible');
                } else {
                    console.error('Playback section not found!');
                }
                
                // Store original blob for download (if user wants original)
                audioElement.recordedBlob = blob;
                audioElement.aiGeneratedUrl = result.audio_url;
            } else {
                console.error('Audio element or URL missing:', { audioElement, audioUrl: result.audio_url });
            }
            
            // Update status to completed
            updateRecordingStatus('ready', `Echo Bot v2 complete! Your voice has been transcribed and regenerated with AI. Click play to hear the AI version.`);
            
            showNotification('Echo Bot v2 processing complete! AI voice generated successfully.', 'success');
            
        } else {
            // Show error status
            updateRecordingStatus('error', `Echo Bot v2 failed: ${result.error}`);
            showNotification(`Echo Bot v2 failed: ${result.error}`, 'error');
        }
        
    } catch (error) {
        console.error('Echo Bot v2 error:', error);
        console.error('Error details:', error.message, error.stack);
        updateRecordingStatus('error', `Echo Bot v2 error: ${error.message}`);
        showNotification(`Echo Bot v2 error: ${error.message}`, 'error');
    }
}

function updateTranscriptionStatus(state, message) {
    const transcriptionStatus = document.getElementById('transcriptionStatus');
    const transcriptionContent = document.getElementById('transcriptionStatusContent');
    
    if (transcriptionStatus && transcriptionContent) {
        // Show transcription status section
        transcriptionStatus.classList.remove('d-none');
        
        // Remove all state classes
        transcriptionStatus.classList.remove('transcription-transcribing', 'transcription-success', 'transcription-error');
        
        // Add current state class
        transcriptionStatus.classList.add(`transcription-${state}`);
        
        // Update icon and message
        let icon = 'fas fa-file-alt';
        if (state === 'transcribing') {
            icon = 'fas fa-spinner fa-spin';
        } else if (state === 'success') {
            icon = 'fas fa-check-circle';
        } else if (state === 'error') {
            icon = 'fas fa-exclamation-triangle';
        }
        
        transcriptionContent.innerHTML = `
            <i class="${icon} me-2"></i>
            <span>${message}</span>
        `;
    }
}

function hideTranscriptionStatus() {
    const transcriptionStatus = document.getElementById('transcriptionStatus');
    if (transcriptionStatus) {
        transcriptionStatus.classList.add('d-none');
    }
}

function showTranscriptionResults(transcript, fileInfo) {
    const transcriptionResults = document.getElementById('transcriptionResults');
    const transcriptionText = document.getElementById('transcriptionText');
    
    if (transcriptionResults && transcriptionText) {
        // Show results section
        transcriptionResults.classList.remove('d-none');
        
        // Set transcription text
        transcriptionText.textContent = transcript || 'No speech detected in the audio.';
        
        // Store transcript for copying
        transcriptionText.dataset.transcript = transcript || '';
    }
}

// Audio Library functionality
document.addEventListener('DOMContentLoaded', function() {
    const viewLibraryBtn = document.getElementById('viewLibraryBtn');
    const audioUpload = document.getElementById('audioUpload');
    const audioFilesList = document.getElementById('audioFilesList');
    
    if (viewLibraryBtn) {
        viewLibraryBtn.addEventListener('click', function() {
            // Toggle library view
            if (audioFilesList.style.display === 'none') {
                audioFilesList.style.display = 'block';
                viewLibraryBtn.innerHTML = '<i class="fas fa-folder me-2"></i>Hide Library';
            } else {
                audioFilesList.style.display = 'none';
                viewLibraryBtn.innerHTML = '<i class="fas fa-folder-open me-2"></i>View Library';
            }
        });
    }
    
    if (audioUpload) {
        audioUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Simple file display (in a real app, you'd upload to server)
                const fileName = file.name;
                const fileSize = (file.size / 1024 / 1024).toFixed(2);
                
                audioFilesList.innerHTML = `
                    <div class="audio-file-item p-3 border rounded mb-2">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <i class="fas fa-file-audio me-2"></i>
                                <span>${fileName}</span>
                                <small class="text-muted d-block">${fileSize} MB</small>
                            </div>
                            <button class="btn btn-sm glass-btn">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    </div>
                `;
            }
        });
    }
});

// AI Assistant Functions
function initializeAiAssistant() {
    const aiForm = document.getElementById('aiChatForm');
    const aiPrompt = document.getElementById('aiPrompt');
    const askAiBtn = document.getElementById('askAiBtn');
    const askAiWithVoiceBtn = document.getElementById('askAiWithVoiceBtn');
    const copyResponseBtn = document.getElementById('copyResponseBtn');
    const newQuestionBtn = document.getElementById('newQuestionBtn');
    const convertToSpeechBtn = document.getElementById('convertToSpeechBtn');
    
    // AI Voice recording elements
    const aiVoiceSection = document.getElementById('aiVoiceSection');
    const aiStartRecordBtn = document.getElementById('aiStartRecordBtn');
    const aiStopRecordBtn = document.getElementById('aiStopRecordBtn');
    const aiRecordingStatus = document.getElementById('aiRecordingStatus');
    const aiVoicePlaybackSection = document.getElementById('aiVoicePlaybackSection');
    const aiRecordedAudio = document.getElementById('aiRecordedAudio');
    const aiSendVoiceBtn = document.getElementById('aiSendVoiceBtn');
    const aiRecordAgainBtn = document.getElementById('aiRecordAgainBtn');
    const aiCancelVoiceBtn = document.getElementById('aiCancelVoiceBtn');
    
    if (aiForm && askAiBtn) {
        aiForm.addEventListener('submit', handleAiQuery);
        
        // Character counter for AI prompt
        if (aiPrompt) {
            addCharacterCounter(aiPrompt);
        }
    }
    
    // Voice recording button
    if (askAiWithVoiceBtn) {
        askAiWithVoiceBtn.addEventListener('click', startAiVoiceRecording);
    }
    
    // Voice recording controls
    if (aiStartRecordBtn) {
        aiStartRecordBtn.addEventListener('click', startAiAudioRecording);
    }
    
    if (aiStopRecordBtn) {
        aiStopRecordBtn.addEventListener('click', stopAiAudioRecording);
    }
    
    if (aiSendVoiceBtn) {
        aiSendVoiceBtn.addEventListener('click', sendAiVoiceQuery);
    }
    
    if (aiRecordAgainBtn) {
        aiRecordAgainBtn.addEventListener('click', startAiAudioRecording);
    }
    
    if (aiCancelVoiceBtn) {
        aiCancelVoiceBtn.addEventListener('click', cancelAiVoiceRecording);
    }
    
    if (copyResponseBtn) {
        copyResponseBtn.addEventListener('click', copyAiResponse);
    }
    
    if (newQuestionBtn) {
        newQuestionBtn.addEventListener('click', startNewQuestion);
    }
    
    if (convertToSpeechBtn) {
        convertToSpeechBtn.addEventListener('click', convertResponseToSpeech);
    }
}

async function handleAiQuery(event) {
    event.preventDefault();
    
    const aiPrompt = document.getElementById('aiPrompt');
    const askAiBtn = document.getElementById('askAiBtn');
    const aiResponseSection = document.getElementById('aiResponseSection');
    
    if (!aiPrompt.value.trim()) {
        showNotification('Please enter a question or prompt for the AI.', 'error');
        return;
    }
    
    try {
        // Show loading state
        showAiLoadingState(askAiBtn);
        
        // Hide previous response
        if (aiResponseSection) {
            aiResponseSection.classList.add('d-none');
        }
        
        // Prepare request
        const requestData = {
            text: aiPrompt.value.trim()
        };
        
        // Send to LLM endpoint
        const response = await fetch('/llm/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show AI response
            showAiResponse(result.response, result.input);
            showNotification('AI response generated successfully!', 'success');
        } else {
            // Show error
            showNotification('AI query failed: ' + result.error, 'error');
        }
        
    } catch (error) {
        console.error('AI query error:', error);
        showNotification('Network error during AI query. Please try again.', 'error');
    } finally {
        // Hide loading state
        hideAiLoadingState(askAiBtn);
    }
}

function showAiLoadingState(button) {
    const btnContent = button.querySelector('.btn-content');
    const loadingSpinner = button.querySelector('.loading-spinner');
    
    if (btnContent && loadingSpinner) {
        btnContent.classList.add('d-none');
        loadingSpinner.classList.remove('d-none');
    }
    
    button.disabled = true;
}

function hideAiLoadingState(button) {
    const btnContent = button.querySelector('.btn-content');
    const loadingSpinner = button.querySelector('.loading-spinner');
    
    if (btnContent && loadingSpinner) {
        btnContent.classList.remove('d-none');
        loadingSpinner.classList.add('d-none');
    }
    
    button.disabled = false;
}

function showAiResponse(response, originalPrompt) {
    const aiResponseSection = document.getElementById('aiResponseSection');
    const aiResponseContent = document.getElementById('aiResponseContent');
    
    if (aiResponseSection && aiResponseContent) {
        // Format the response text with line breaks and proper formatting
        const formattedResponse = formatAiResponse(response);
        aiResponseContent.innerHTML = formattedResponse;
        
        // Store original response for copying
        aiResponseContent.dataset.originalResponse = response;
        aiResponseContent.dataset.originalPrompt = originalPrompt;
        
        // Show response section
        aiResponseSection.classList.remove('d-none');
        
        // Scroll to response
        aiResponseSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function formatAiResponse(text) {
    // Convert markdown-style formatting to HTML
    let formatted = text
        // Convert **bold** to <strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Convert *italic* to <em>
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Convert numbered lists
        .replace(/^\d+\.\s+(.+)$/gm, '<div class="ai-list-item">$1</div>')
        // Convert bullet points
        .replace(/^[\*\-]\s+(.+)$/gm, '<div class="ai-bullet-item">• $1</div>')
        // Convert line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    // Wrap in paragraphs if not already formatted
    if (!formatted.includes('<p>') && !formatted.includes('<div>')) {
        formatted = '<p>' + formatted + '</p>';
    }
    
    return formatted;
}

function copyAiResponse() {
    const aiResponseContent = document.getElementById('aiResponseContent');
    
    if (aiResponseContent && aiResponseContent.dataset.originalResponse) {
        navigator.clipboard.writeText(aiResponseContent.dataset.originalResponse).then(() => {
            showNotification('AI response copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy AI response:', err);
            showNotification('Failed to copy AI response', 'error');
        });
    }
}

function startNewQuestion() {
    const aiPrompt = document.getElementById('aiPrompt');
    const aiResponseSection = document.getElementById('aiResponseSection');
    
    if (aiPrompt) {
        aiPrompt.value = '';
        aiPrompt.focus();
    }
    
    if (aiResponseSection) {
        aiResponseSection.classList.add('d-none');
    }
}

function convertResponseToSpeech() {
    const aiResponseContent = document.getElementById('aiResponseContent');
    const textArea = document.getElementById('text');
    
    if (aiResponseContent && aiResponseContent.dataset.originalResponse && textArea) {
        // Copy AI response to TTS text area
        textArea.value = aiResponseContent.dataset.originalResponse;
        
        // Scroll to TTS section
        textArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Flash the text area to indicate it's been updated
        textArea.style.boxShadow = '0 0 20px #64b5f6';
        textArea.style.border = '2px solid #64b5f6';
        textArea.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            textArea.style.boxShadow = '';
            textArea.style.border = '';
            textArea.style.transform = '';
        }, 2000);
        
        // Show clear feedback to user
        alert('✅ AI response copied to text-to-speech! Now scroll up and click "Generate Audio" to convert it to voice.');
    } else {
        alert('❌ Unable to convert to speech. Please ask the AI a question first, then try again.');
    }
}

// Day 9: AI Assistant Voice Recording Functions
let aiMediaRecorder = null;
let aiAudioChunks = [];

function startAiVoiceRecording() {
    const aiVoiceSection = document.getElementById('aiVoiceSection');
    const aiResponseSection = document.getElementById('aiResponseSection');
    
    // Hide any existing response and show voice section
    if (aiResponseSection) {
        aiResponseSection.classList.add('d-none');
    }
    
    if (aiVoiceSection) {
        aiVoiceSection.classList.remove('d-none');
        // Scroll to voice section
        aiVoiceSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

async function startAiAudioRecording() {
    const aiStartRecordBtn = document.getElementById('aiStartRecordBtn');
    const aiStopRecordBtn = document.getElementById('aiStopRecordBtn');
    const aiRecordingStatus = document.getElementById('aiRecordingStatus');
    const aiVoicePlaybackSection = document.getElementById('aiVoicePlaybackSection');
    
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Reset audio chunks
        aiAudioChunks = [];
        
        // Create MediaRecorder
        aiMediaRecorder = new MediaRecorder(stream);
        
        aiMediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                aiAudioChunks.push(event.data);
            }
        };
        
        aiMediaRecorder.onstop = () => {
            // Create audio blob and URL
            const audioBlob = new Blob(aiAudioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Set up audio player
            const aiRecordedAudio = document.getElementById('aiRecordedAudio');
            if (aiRecordedAudio) {
                aiRecordedAudio.src = audioUrl;
                aiRecordedAudio.audioBlob = audioBlob; // Store blob for uploading
            }
            
            // Show playback section
            if (aiVoicePlaybackSection) {
                aiVoicePlaybackSection.classList.remove('d-none');
            }
            
            // Stop all tracks to release microphone
            stream.getTracks().forEach(track => track.stop());
        };
        
        // Start recording
        aiMediaRecorder.start();
        
        // Update UI
        if (aiStartRecordBtn) aiStartRecordBtn.classList.add('d-none');
        if (aiStopRecordBtn) aiStopRecordBtn.classList.remove('d-none');
        if (aiRecordingStatus) aiRecordingStatus.classList.remove('d-none');
        if (aiVoicePlaybackSection) aiVoicePlaybackSection.classList.add('d-none');
        
    } catch (error) {
        console.error('Error starting AI voice recording:', error);
        alert('Unable to access microphone. Please check permissions and try again.');
    }
}

function stopAiAudioRecording() {
    const aiStartRecordBtn = document.getElementById('aiStartRecordBtn');
    const aiStopRecordBtn = document.getElementById('aiStopRecordBtn');
    const aiRecordingStatus = document.getElementById('aiRecordingStatus');
    
    if (aiMediaRecorder && aiMediaRecorder.state === 'recording') {
        aiMediaRecorder.stop();
        
        // Update UI
        if (aiStartRecordBtn) aiStartRecordBtn.classList.remove('d-none');
        if (aiStopRecordBtn) aiStopRecordBtn.classList.add('d-none');
        if (aiRecordingStatus) aiRecordingStatus.classList.add('d-none');
    }
}

async function sendAiVoiceQuery() {
    const aiRecordedAudio = document.getElementById('aiRecordedAudio');
    const aiSendVoiceBtn = document.getElementById('aiSendVoiceBtn');
    
    if (!aiRecordedAudio || !aiRecordedAudio.audioBlob) {
        alert('No audio recording found. Please record your question first.');
        return;
    }
    
    try {
        // Show loading state
        showAiLoadingState(aiSendVoiceBtn);
        
        // Create FormData with audio file
        const formData = new FormData();
        formData.append('audio', aiRecordedAudio.audioBlob, 'ai_voice_query.webm');
        
        // Send to Day 9 enhanced /llm/query endpoint
        const response = await fetch('/llm/query', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Hide voice section and show AI response
            const aiVoiceSection = document.getElementById('aiVoiceSection');
            if (aiVoiceSection) {
                aiVoiceSection.classList.add('d-none');
            }
            
            // Show text response
            showAiResponse(result.response, result.input);
            
            // Show voice response if available
            if (result.audio_url) {
                showAiAudioResponse(result.audio_url);
            }
        } else {
            console.error('AI voice query failed:', result.error);
            // Show error in UI instead of alert
            showAiResponse(`Sorry, I couldn't process your voice message: ${result.error}`, result.input || 'Voice input');
        }
        
    } catch (error) {
        console.error('AI voice query error:', error);
        // Show error in UI instead of alert
        showAiResponse('Sorry, there was a network error processing your voice message. Please try again.', 'Voice input');
    } finally {
        // Hide loading state
        hideAiLoadingState(aiSendVoiceBtn);
    }
}

function showAiAudioResponse(audioUrl) {
    const aiAudioSection = document.getElementById('aiAudioSection');
    const aiResponseAudio = document.getElementById('aiResponseAudio');
    
    if (aiAudioSection && aiResponseAudio) {
        aiResponseAudio.src = audioUrl;
        aiAudioSection.classList.remove('d-none');
        
        // Auto-play AI voice response
        setTimeout(() => {
            if (aiResponseAudio) {
                aiResponseAudio.play().catch(e => {
                    console.log('Auto-play blocked by browser:', e);
                });
            }
        }, 500);
    }
}

function cancelAiVoiceRecording() {
    const aiVoiceSection = document.getElementById('aiVoiceSection');
    const aiStartRecordBtn = document.getElementById('aiStartRecordBtn');
    const aiStopRecordBtn = document.getElementById('aiStopRecordBtn');
    const aiRecordingStatus = document.getElementById('aiRecordingStatus');
    const aiVoicePlaybackSection = document.getElementById('aiVoicePlaybackSection');
    
    // Stop recording if in progress
    if (aiMediaRecorder && aiMediaRecorder.state === 'recording') {
        aiMediaRecorder.stop();
    }
    
    // Reset UI
    if (aiStartRecordBtn) aiStartRecordBtn.classList.remove('d-none');
    if (aiStopRecordBtn) aiStopRecordBtn.classList.add('d-none');
    if (aiRecordingStatus) aiRecordingStatus.classList.add('d-none');
    if (aiVoicePlaybackSection) aiVoicePlaybackSection.classList.add('d-none');
    if (aiVoiceSection) aiVoiceSection.classList.add('d-none');
    
    // Clear audio chunks
    aiAudioChunks = [];
}

// Day 10: Conversation Bot Functions
let currentSessionId = null;
let chatMediaRecorder = null;
let chatAudioChunks = [];
let autoRecordEnabled = false;
let autoRecordTimer = null;

function initializeConversationBot() {
    console.log('Initializing Conversation Bot...');
    
    // Initialize session
    initializeSession();
    
    // Get UI elements
    const newChatBtn = document.getElementById('newChatBtn');
    const chatStartRecordBtn = document.getElementById('chatStartRecordBtn');
    const chatStopRecordBtn = document.getElementById('chatStopRecordBtn');
    const chatSendVoiceBtn = document.getElementById('chatSendVoiceBtn');
    const chatRecordAgainBtn = document.getElementById('chatRecordAgainBtn');
    const chatCancelVoiceBtn = document.getElementById('chatCancelVoiceBtn');
    
    // Add event listeners
    if (newChatBtn) {
        newChatBtn.addEventListener('click', createNewChatSession);
    }
    
    if (chatStartRecordBtn) {
        chatStartRecordBtn.addEventListener('click', startChatAudioRecording);
    }
    
    if (chatStopRecordBtn) {
        chatStopRecordBtn.addEventListener('click', stopChatAudioRecording);
    }
    
    if (chatSendVoiceBtn) {
        chatSendVoiceBtn.addEventListener('click', sendChatVoiceMessage);
    }
    
    if (chatRecordAgainBtn) {
        chatRecordAgainBtn.addEventListener('click', startChatAudioRecording);
    }
    
    if (chatCancelVoiceBtn) {
        chatCancelVoiceBtn.addEventListener('click', cancelChatVoiceRecording);
    }
}

function initializeSession() {
    console.log('Initializing session...');
    
    // Get session ID from URL parameter or create new one
    const urlParams = new URLSearchParams(window.location.search);
    let sessionId = urlParams.get('session_id');
    
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        console.log('Generated new session ID:', sessionId);
        // Don't modify URL to avoid navigation issues
    }
    
    currentSessionId = sessionId;
    console.log('Session ID:', currentSessionId);
    
    // Update UI
    const sessionDisplay = document.getElementById('currentSessionId');
    if (sessionDisplay) {
        sessionDisplay.textContent = sessionId;
        console.log('Updated session display');
    } else {
        console.error('Session display element not found');
    }
    
    // Load existing chat history
    loadChatHistory();
}

async function loadChatHistory() {
    if (!currentSessionId) return;
    
    try {
        const response = await fetch(`/agent/chat/${currentSessionId}`, {
            method: 'GET'
        });
        
        const result = await response.json();
        
        if (result.success && result.history.length > 0) {
            displayChatHistory(result.history);
        }
        
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

function displayChatHistory(history) {
    const chatContainer = document.getElementById('chatHistoryContainer');
    const emptyMessage = document.getElementById('emptyChatMessage');
    
    if (!chatContainer) return;
    
    if (history.length === 0) {
        if (emptyMessage) emptyMessage.classList.remove('d-none');
        return;
    }
    
    if (emptyMessage) emptyMessage.classList.add('d-none');
    
    let historyHtml = '';
    history.forEach((message, index) => {
        const isUser = message.role === 'user';
        const bgClass = isUser ? 'bg-primary' : 'bg-secondary';
        const textClass = isUser ? 'text-white' : 'text-white';
        const icon = isUser ? 'fas fa-user' : 'fas fa-robot';
        
        historyHtml += `
            <div class="chat-message mb-2">
                <div class="d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'}">
                    <div class="message-bubble ${bgClass} ${textClass} p-2 rounded" style="max-width: 80%;">
                        <div class="d-flex align-items-start">
                            <i class="${icon} me-2 mt-1" style="font-size: 0.8rem;"></i>
                            <div>${message.content}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    chatContainer.innerHTML = historyHtml;
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function createNewChatSession() {
    // Generate new session ID
    const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Reset current session
    currentSessionId = newSessionId;
    
    // Update UI
    const sessionDisplay = document.getElementById('currentSessionId');
    if (sessionDisplay) {
        sessionDisplay.textContent = newSessionId;
    }
    
    // Clear chat history display
    const chatContainer = document.getElementById('chatHistoryContainer');
    const emptyMessage = document.getElementById('emptyChatMessage');
    
    if (chatContainer) {
        chatContainer.innerHTML = '<div class="text-muted text-center p-3" id="emptyChatMessage"><i class="fas fa-robot me-2"></i>Start a voice conversation! I\'ll remember our chat history.</div>';
    }
    
    // Reset any ongoing recordings
    cancelChatVoiceRecording();
}

async function startChatAudioRecording() {
    const chatStartRecordBtn = document.getElementById('chatStartRecordBtn');
    const chatStopRecordBtn = document.getElementById('chatStopRecordBtn');
    const chatRecordingStatus = document.getElementById('chatRecordingStatus');
    const chatVoicePlaybackSection = document.getElementById('chatVoicePlaybackSection');
    
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Reset audio chunks
        chatAudioChunks = [];
        
        // Create MediaRecorder
        chatMediaRecorder = new MediaRecorder(stream);
        
        chatMediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chatAudioChunks.push(event.data);
            }
        };
        
        chatMediaRecorder.onstop = () => {
            // Create audio blob and URL
            const audioBlob = new Blob(chatAudioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Set up audio player
            const chatRecordedAudio = document.getElementById('chatRecordedAudio');
            if (chatRecordedAudio) {
                chatRecordedAudio.src = audioUrl;
                chatRecordedAudio.audioBlob = audioBlob; // Store blob for uploading
            }
            
            // Show playback section
            if (chatVoicePlaybackSection) {
                chatVoicePlaybackSection.classList.remove('d-none');
            }
            
            // Stop all tracks to release microphone
            stream.getTracks().forEach(track => track.stop());
        };
        
        // Start recording
        chatMediaRecorder.start();
        
        // Update UI
        if (chatStartRecordBtn) chatStartRecordBtn.classList.add('d-none');
        if (chatStopRecordBtn) chatStopRecordBtn.classList.remove('d-none');
        if (chatRecordingStatus) chatRecordingStatus.classList.remove('d-none');
        if (chatVoicePlaybackSection) chatVoicePlaybackSection.classList.add('d-none');
        
    } catch (error) {
        console.error('Error starting chat voice recording:', error);
        alert('Unable to access microphone. Please check permissions and try again.');
    }
}

function stopChatAudioRecording() {
    const chatStartRecordBtn = document.getElementById('chatStartRecordBtn');
    const chatStopRecordBtn = document.getElementById('chatStopRecordBtn');
    const chatRecordingStatus = document.getElementById('chatRecordingStatus');
    
    if (chatMediaRecorder && chatMediaRecorder.state === 'recording') {
        chatMediaRecorder.stop();
        
        // Update UI
        if (chatStartRecordBtn) chatStartRecordBtn.classList.remove('d-none');
        if (chatStopRecordBtn) chatStopRecordBtn.classList.add('d-none');
        if (chatRecordingStatus) chatRecordingStatus.classList.add('d-none');
    }
}

async function sendChatVoiceMessage() {
    const chatRecordedAudio = document.getElementById('chatRecordedAudio');
    const chatSendVoiceBtn = document.getElementById('chatSendVoiceBtn');
    
    if (!chatRecordedAudio || !chatRecordedAudio.audioBlob) {
        alert('No audio recording found. Please record your message first.');
        return;
    }
    
    if (!currentSessionId) {
        alert('No active session. Please try again.');
        return;
    }
    
    try {
        // Show loading state
        showChatLoadingState(chatSendVoiceBtn);
        
        // Create FormData with audio file
        const formData = new FormData();
        formData.append('audio', chatRecordedAudio.audioBlob, 'chat_voice_message.webm');
        
        // Send to Day 10 chat endpoint
        const response = await fetch(`/agent/chat/${currentSessionId}`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Hide voice recording section
            cancelChatVoiceRecording();
            
            // Reload and display updated chat history
            await loadChatHistory();
            
            // Show voice response if available
            if (result.audio_url) {
                showChatAudioResponse(result.audio_url);
            }
        } else {
            console.error('Chat message failed:', result.error);
            // Show error in chat
            addErrorMessageToChat(`Sorry, I couldn't process your message: ${result.error}`);
        }
        
    } catch (error) {
        console.error('Chat message error:', error);
        addErrorMessageToChat('Sorry, there was a network error. Please try again.');
    } finally {
        // Hide loading state
        hideChatLoadingState(chatSendVoiceBtn);
    }
}

function showChatAudioResponse(audioUrl) {
    const chatAudioSection = document.getElementById('chatAudioSection');
    const chatResponseAudio = document.getElementById('chatResponseAudio');
    
    if (chatAudioSection && chatResponseAudio) {
        chatResponseAudio.src = audioUrl;
        chatAudioSection.classList.remove('d-none');
        
        // Auto-play response and setup auto-record
        setTimeout(() => {
            if (chatResponseAudio) {
                chatResponseAudio.play().catch(e => {
                    console.log('Auto-play blocked by browser:', e);
                });
                
                // Setup auto-record after response ends
                chatResponseAudio.addEventListener('ended', function() {
                    setupAutoRecord();
                }, { once: true });
            }
        }, 500);
    }
}

function setupAutoRecord() {
    const autoRecordNotification = document.getElementById('autoRecordNotification');
    
    if (autoRecordNotification) {
        autoRecordNotification.classList.remove('d-none');
        
        // Auto start recording after 2 seconds
        autoRecordTimer = setTimeout(() => {
            startChatAudioRecording();
            autoRecordNotification.classList.add('d-none');
        }, 2000);
    }
}

function cancelChatVoiceRecording() {
    const chatVoiceSection = document.getElementById('chatVoiceSection');
    const chatStartRecordBtn = document.getElementById('chatStartRecordBtn');
    const chatStopRecordBtn = document.getElementById('chatStopRecordBtn');
    const chatRecordingStatus = document.getElementById('chatRecordingStatus');
    const chatVoicePlaybackSection = document.getElementById('chatVoicePlaybackSection');
    const autoRecordNotification = document.getElementById('autoRecordNotification');
    
    // Stop recording if in progress
    if (chatMediaRecorder && chatMediaRecorder.state === 'recording') {
        chatMediaRecorder.stop();
    }
    
    // Clear auto-record timer
    if (autoRecordTimer) {
        clearTimeout(autoRecordTimer);
        autoRecordTimer = null;
    }
    
    // Reset UI
    if (chatStartRecordBtn) chatStartRecordBtn.classList.remove('d-none');
    if (chatStopRecordBtn) chatStopRecordBtn.classList.add('d-none');
    if (chatRecordingStatus) chatRecordingStatus.classList.add('d-none');
    if (chatVoicePlaybackSection) chatVoicePlaybackSection.classList.add('d-none');
    if (autoRecordNotification) autoRecordNotification.classList.add('d-none');
    
    // Clear audio chunks
    chatAudioChunks = [];
}

function showChatLoadingState(button) {
    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    }
}

function hideChatLoadingState(button) {
    if (button) {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send to Bot';
    }
}

function addErrorMessageToChat(errorMessage) {
    const chatContainer = document.getElementById('chatHistoryContainer');
    if (!chatContainer) return;
    
    const errorHtml = `
        <div class="chat-message mb-2">
            <div class="d-flex justify-content-start">
                <div class="message-bubble bg-danger text-white p-2 rounded" style="max-width: 80%;">
                    <div class="d-flex align-items-start">
                        <i class="fas fa-exclamation-triangle me-2 mt-1" style="font-size: 0.8rem;"></i>
                        <div>${errorMessage}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    chatContainer.insertAdjacentHTML('beforeend', errorHtml);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
