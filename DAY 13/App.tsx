
import React from 'react';
import ReadmeDisplay from './components/ReadmeDisplay';
import GitHubIcon from './components/icons/GitHubIcon';

function App(): React.ReactNode {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex justify-between items-center mb-10 border-b border-gray-700 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400">30 Days of AI Voice Agents</h1>
            <p className="text-gray-400 mt-2">Project Documentation & Guide</p>
          </div>
          <a
            href="https://github.com/SvJalmi/Murf-AI-30-Days-of-Voice-Agents"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <GitHubIcon className="h-8 w-8" />
          </a>
        </header>
        <ReadmeDisplay />
      </main>
      <footer className="text-center py-6 text-sm text-gray-500">
        Generated for Day 13 Challenge
      </footer>
    </div>
  );
}

export default App;
