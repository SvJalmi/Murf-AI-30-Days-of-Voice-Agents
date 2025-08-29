/**
 * Ultimate AI Voice Agent - Day 27 Revamped JavaScript
 * Enhanced functionality with API key management and modern UI
 */

class UltimateVoiceAgent {
    constructor() {
        this.currentPersona = 'pirate';
        this.audioPlayer = null;
        this.isPlaying = false;
        this.apiStatus = {};
        this.conversationHistory = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAudioPlayer();
        this.loadInitialData();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        // Persona management
        document.getElementById('set-persona-btn').addEventListener('click', () => this.setPersona());
        
        // Quick actions
        document.getElementById('greet-btn').addEventListener('click', () => this.generateGreeting());
        document.getElementById('clear-history-btn').addEventListener('click', () => this.clearHistory());
        
        // Skills
        document.getElementById('search-btn').addEventListener('click', () => this.performWebSearch());
        document.getElementById('weather-btn').addEventListener('click', () => this.getWeatherInfo());
        document.getElementById('send-message-btn').addEventListener('click', () => this.sendMessage());
        
        // Enter key support
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performWebSearch();
        });
        document.getElementById('weather-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.getWeatherInfo();
        });
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Modal controls
        document.getElementById('config-btn').addEventListener('click', () => this.openConfigModal());
        document.getElementById('stats-btn').addEventListener('click', () => this.openStatsModal());
        document.getElementById('close-config').addEventListener('click', () => this.closeModal('config-modal'));
        document.getElementById('close-stats').addEventListener('click', () => this.closeModal('stats-modal'));
        
        // Configuration
        document.getElementById('save-config').addEventListener('click', () => this.saveConfiguration());
        document.getElementById('reset-config').addEventListener('click', () => this.resetConfiguration());
        
        // Password visibility toggles
        document.querySelectorAll('.toggle-visibility').forEach(btn => {
            btn.addEventListener('click', (e) => this.togglePasswordVisibility(e.target));
        });
        
        // Audio controls
        document.getElementById('play-pause-btn').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('volume-btn').addEventListener('click', () => this.toggleMute());
        
        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    setupAudioPlayer() {
        this.audioPlayer = document.getElementById('audio-player');
        
        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.updateAudioInfo();
        });
        
        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
        
        this.audioPlayer.addEventListener('ended', () => {
            this.onAudioEnded();
        });
        
        this.audioPlayer.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
        });
        
        this.audioPlayer.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });
    }

    async loadInitialData() {
        try {
            await this.loadAPIStatus();
            await this.loadPersonaInfo();
        } catch (error) {
            this.showToast('Error loading initial data', 'error');
            console.error('Error loading initial data:', error);
        }
    }

    async loadAPIStatus() {
        try {
            const response = await fetch('/api/api_keys');
            const data = await response.json();
            
            if (response.ok) {
                this.apiStatus = data.status;
                this.updateAPIStatusDisplay();
            }
        } catch (error) {
            console.error('Error loading API status:', error);
        }
    }

    async loadPersonaInfo() {
        try {
            const response = await fetch('/api/persona_info');
            const data = await response.json();
            
            if (response.ok) {
                this.currentPersona = data.current_persona;
                this.updatePersonaDisplay(data.persona_info);
            }
        } catch (error) {
            console.error('Error loading persona info:', error);
        }
    }

    updateAPIStatusDisplay() {
        const statusList = document.getElementById('api-status-list');
        statusList.innerHTML = '';
        
        Object.entries(this.apiStatus).forEach(([service, status]) => {
            const statusItem = document.createElement('div');
            statusItem.className = `api-status-item ${status.configured ? '' : 'warning'}`;
            
            statusItem.innerHTML = `
                <span class="api-name">${status.service_name}</span>
                <span class="api-badge ${status.configured ? 'configured' : 'demo'}">
                    ${status.configured ? 'Configured' : 'Demo Mode'}
                </span>
            `;
            
            statusList.appendChild(statusItem);
        });
    }

    updatePersonaDisplay(personaInfo) {
        if (personaInfo) {
            const personaInfoDiv = document.getElementById('persona-info');
            const personaEmoji = document.getElementById('persona-emoji');
            const personaName = document.getElementById('persona-name');
            const personaPersonality = document.getElementById('persona-personality');
            
            personaEmoji.textContent = personaInfo.emoji;
            personaName.textContent = personaInfo.name;
            personaPersonality.textContent = personaInfo.personality;
            
            personaInfoDiv.classList.remove('hidden');
        }
    }

    showWelcomeMessage() {
        // Welcome message is already in HTML, just ensure it's visible
        const outputMessages = document.getElementById('output-messages');
        outputMessages.scrollTop = outputMessages.scrollHeight;
    }

    async setPersona() {
        const personaSelect = document.getElementById('persona-select');
        const selectedPersona = personaSelect.value;
        
        this.showLoading('Setting persona...');
        
        try {
            const response = await fetch('/api/set_persona', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ persona: selectedPersona }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.currentPersona = selectedPersona;
                this.updatePersonaDisplay(data.persona_info);
                this.addMessage(data.message, 'success');
                this.showToast('Persona updated successfully!', 'success');
            } else {
                this.addMessage(`Error: ${data.error}`, 'error');
                this.showToast('Failed to set persona', 'error');
            }
        } catch (error) {
            this.addMessage(`Network error: ${error.message}`, 'error');
            this.showToast('Network error occurred', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async generateGreeting() {
        this.showLoading('Generating greeting...');
        
        try {
            const response = await fetch('/api/greet');
            const data = await response.json();
            
            if (response.ok) {
                this.addMessage(data.message, 'success');
                this.playAudio(data.audio_url, 'Persona Greeting');
                this.showToast('Greeting generated!', 'success');
            } else {
                this.addMessage(`Error: ${data.error}`, 'error');
                this.showToast('Failed to generate greeting', 'error');
            }
        } catch (error) {
            this.addMessage(`Network error: ${error.message}`, 'error');
            this.showToast('Network error occurred', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async performWebSearch() {
        const searchInput = document.getElementById('search-input');
        const query = searchInput.value.trim();
        
        if (!query) {
            this.showToast('Please enter a search query', 'warning');
            return;
        }
        
        this.addMessage(`🔍 Searching for: ${query}`, 'info');
        searchInput.value = '';
        this.showLoading('Searching...');
        
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.addMessage(`Search Results: ${data.results}`, 'success');
                this.playAudio(data.audio_url, `Search: ${query}`);
                this.showToast('Search completed!', 'success');
            } else {
                this.addMessage(`Error: ${data.error}`, 'error');
                this.showToast('Search failed', 'error');
            }
        } catch (error) {
            this.addMessage(`Network error: ${error.message}`, 'error');
            this.showToast('Network error occurred', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async getWeatherInfo() {
        const weatherInput = document.getElementById('weather-input');
        const location = weatherInput.value.trim() || 'New York';
        
        this.addMessage(`🌤️ Getting weather for: ${location}`, 'info');
        weatherInput.value = '';
        this.showLoading('Getting weather...');
        
        try {
            const response = await fetch('/api/weather', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ location: location }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.addMessage(`Weather Info: ${data.weather}`, 'success');
                this.playAudio(data.audio_url, `Weather: ${location}`);
                this.showToast('Weather information retrieved!', 'success');
            } else {
                this.addMessage(`Error: ${data.error}`, 'error');
                this.showToast('Failed to get weather', 'error');
            }
        } catch (error) {
            this.addMessage(`Network error: ${error.message}`, 'error');
            this.showToast('Network error occurred', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async sendMessage() {
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();
        
        if (!message) {
            this.showToast('Please enter a message', 'warning');
            return;
        }
        
        this.addMessage(`You: ${message}`, 'user');
        userInput.value = '';
        this.showLoading('Generating response...');
        
        try {
            const response = await fetch('/api/respond', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.addMessage(data.message, 'agent');
                this.playAudio(data.audio_url, 'Agent Response');
                this.showToast('Response generated!', 'success');
            } else {
                this.addMessage(`Error: ${data.error}`, 'error');
                this.showToast('Failed to generate response', 'error');
            }
        } catch (error) {
            this.addMessage(`Network error: ${error.message}`, 'error');
            this.showToast('Network error occurred', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async clearHistory() {
        if (!confirm('Are you sure you want to clear the conversation history?')) {
            return;
        }
        
        try {
            const response = await fetch('/api/conversation_history', {
                method: 'DELETE'
            });
            
            if (response.ok) {
                const outputMessages = document.getElementById('output-messages');
                outputMessages.innerHTML = `
                    <div class="welcome-message">
                        <div class="message-icon">🎭</div>
                        <div class="message-content">
                            <h4>Conversation history cleared!</h4>
                            <p>Start a new conversation with your AI voice agent.</p>
                        </div>
                    </div>
                `;
                this.showToast('History cleared successfully!', 'success');
            }
        } catch (error) {
            this.showToast('Failed to clear history', 'error');
        }
    }

    addMessage(text, type = 'info') {
        const outputMessages = document.getElementById('output-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const timestamp = new Date().toLocaleTimeString();
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;
        
        outputMessages.appendChild(messageDiv);
        outputMessages.scrollTop = outputMessages.scrollHeight;
        
        // Store in conversation history
        this.conversationHistory.push({
            text,
            type,
            timestamp: new Date().toISOString()
        });
    }

    playAudio(audioUrl, title = 'Audio') {
        if (audioUrl) {
            this.audioPlayer.src = audioUrl;
            document.getElementById('audio-title').textContent = title;
            document.getElementById('play-pause-btn').disabled = false;
            
            this.audioPlayer.play().catch(error => {
                console.error('Error playing audio:', error);
                this.showToast('Failed to play audio', 'error');
            });
        }
    }

    togglePlayPause() {
        if (this.audioPlayer.paused) {
            this.audioPlayer.play();
        } else {
            this.audioPlayer.pause();
        }
    }

    toggleMute() {
        this.audioPlayer.muted = !this.audioPlayer.muted;
        const volumeBtn = document.getElementById('volume-btn');
        const icon = volumeBtn.querySelector('i');
        
        if (this.audioPlayer.muted) {
            icon.className = 'fas fa-volume-mute';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    updatePlayButton() {
        const playBtn = document.getElementById('play-pause-btn');
        const icon = playBtn.querySelector('i');
        
        if (this.isPlaying) {
            icon.className = 'fas fa-pause';
        } else {
            icon.className = 'fas fa-play';
        }
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const timeDisplay = document.querySelector('.time-display');
        
        if (this.audioPlayer.duration) {
            const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            progressFill.style.width = `${progress}%`;
            
            const current = this.formatTime(this.audioPlayer.currentTime);
            const total = this.formatTime(this.audioPlayer.duration);
            timeDisplay.textContent = `${current} / ${total}`;
        }
    }

    updateAudioInfo() {
        const timeDisplay = document.querySelector('.time-display');
        const total = this.formatTime(this.audioPlayer.duration);
        timeDisplay.textContent = `0:00 / ${total}`;
    }

    onAudioEnded() {
        this.isPlaying = false;
        this.updatePlayButton();
        document.querySelector('.progress-fill').style.width = '0%';
        document.querySelector('.time-display').textContent = '0:00 / 0:00';
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    openConfigModal() {
        document.getElementById('config-modal').classList.remove('hidden');
        this.loadCurrentConfig();
    }

    openStatsModal() {
        document.getElementById('stats-modal').classList.remove('hidden');
        this.loadStats();
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    async loadCurrentConfig() {
        // Load current API keys (masked for security)
        const tavilyInput = document.getElementById('tavily-key');
        const weatherInput = document.getElementById('weather-key');
        
        // Don't load actual keys for security - just show if they're configured
        if (this.apiStatus.tavily?.configured) {
            tavilyInput.placeholder = 'API key configured (hidden for security)';
        }
        if (this.apiStatus.weather?.configured) {
            weatherInput.placeholder = 'API key configured (hidden for security)';
        }
    }

    async saveConfiguration() {
        const tavilyKey = document.getElementById('tavily-key').value;
        const weatherKey = document.getElementById('weather-key').value;
        
        const apiKeys = {};
        if (tavilyKey) apiKeys.tavily = tavilyKey;
        if (weatherKey) apiKeys.weather = weatherKey;
        
        if (Object.keys(apiKeys).length === 0) {
            this.showToast('No API keys to update', 'warning');
            return;
        }
        
        this.showLoading('Saving configuration...');
        
        try {
            const response = await fetch('/api/api_keys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ api_keys: apiKeys }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.apiStatus = data.status;
                this.updateAPIStatusDisplay();
                this.closeModal('config-modal');
                this.showToast('Configuration saved successfully!', 'success');
                
                // Clear the input fields for security
                document.getElementById('tavily-key').value = '';
                document.getElementById('weather-key').value = '';
            } else {
                this.showToast('Failed to save configuration', 'error');
            }
        } catch (error) {
            this.showToast('Network error occurred', 'error');
        } finally {
            this.hideLoading();
        }
    }

    resetConfiguration() {
        if (!confirm('Are you sure you want to reset all configuration to defaults?')) {
            return;
        }
        
        document.getElementById('tavily-key').value = '';
        document.getElementById('weather-key').value = '';
        document.getElementById('theme-select').value = 'dark';
        document.getElementById('animation-select').value = 'normal';
        
        this.showToast('Configuration reset to defaults', 'info');
    }

    async loadStats() {
        try {
            const response = await fetch('/api/stats');
            const data = await response.json();
            
            if (response.ok) {
                this.displayStats(data.stats);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    displayStats(stats) {
        const statsContent = document.getElementById('stats-content');
        
        statsContent.innerHTML = `
            <div class="stat-group">
                <h4><i class="fas fa-info-circle"></i> General Statistics</h4>
                <div class="stat-grid">
                    <div class="stat-item">
                        <span class="stat-value">${stats.total_personas}</span>
                        <span class="stat-label">Personas</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.available_skills}</span>
                        <span class="stat-label">Skills</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.conversation_entries}</span>
                        <span class="stat-label">Conversations</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.current_persona}</span>
                        <span class="stat-label">Current Persona</span>
                    </div>
                </div>
            </div>
            
            <div class="stat-group">
                <h4><i class="fas fa-key"></i> API Status</h4>
                <div class="stat-grid">
                    ${Object.entries(stats.api_key_status).map(([service, status]) => `
                        <div class="stat-item">
                            <span class="stat-value ${status.configured ? 'text-success' : 'text-warning'}">
                                ${status.configured ? '✓' : '⚠'}
                            </span>
                            <span class="stat-label">${status.service_name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="stat-group">
                <h4><i class="fas fa-users"></i> Available Personas</h4>
                <div class="persona-list">
                    ${Object.entries(stats.personas).map(([key, persona]) => `
                        <div class="persona-stat-item">
                            <span class="persona-emoji">${persona.emoji}</span>
                            <div class="persona-stat-info">
                                <strong>${persona.name}</strong>
                                <p>${persona.personality}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    togglePasswordVisibility(button) {
        const targetId = button.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + K for search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            document.getElementById('search-input').focus();
        }
        
        // Ctrl/Cmd + Enter for send message
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            this.sendMessage();
        }
        
        // Escape to close modals
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                this.closeModal(modal.id);
            });
        }
    }

    showLoading(text = 'Loading...') {
        const loadingOverlay = document.getElementById('loading-overlay');
        const loadingText = document.getElementById('loading-text');
        
        loadingText.textContent = text;
        loadingOverlay.classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
    }

    showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);
        
        // Remove on click
        toast.addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.voiceAgent = new UltimateVoiceAgent();
    
    // Add some CSS for dynamic elements
    const style = document.createElement('style');
    style.textContent = `
        .message-time {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-top: 0.25rem;
        }
        
        .persona-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .persona-stat-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg-primary);
            border-radius: var(--radius-md);
        }
        
        .persona-emoji {
            font-size: 2rem;
        }
        
        .persona-stat-info strong {
            color: var(--text-primary);
            display: block;
            margin-bottom: 0.25rem;
        }
        
        .persona-stat-info p {
            color: var(--text-muted);
            font-size: 0.875rem;
            margin: 0;
        }
        
        .text-success {
            color: var(--success-color) !important;
        }
        
        .text-warning {
            color: var(--warning-color) !important;
        }
    `;
    document.head.appendChild(style);
});

