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
        updateRecordingStatus('processing', 'Processing recording...');
        
        showNotification('Recording stopped! Processing audio...', 'success');
    }
}

function recordAgain() {
    // Hide playback section
    const playbackSection = document.getElementById('playbackSection');
    playbackSection.classList.add('d-none');
    
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
            startBtn.innerHTML = '<i class="fas fa-record-vinyl me-2"></i>Recording...';
            stopBtn.innerHTML = '<i class="fas fa-stop me-2"></i>Stop Recording';
        } else {
            startBtn.innerHTML = '<i class="fas fa-record-vinyl me-2"></i>Start Recording';
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
