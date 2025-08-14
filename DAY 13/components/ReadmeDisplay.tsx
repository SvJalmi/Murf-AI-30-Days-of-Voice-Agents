import React from 'react';
import Section from './Section';
import CodeBlock from './CodeBlock';

const setupInstructions = `
# 1. Clone the repository
git clone https://github.com/SvJalmi/Murf-AI-30-Days-of-Voice-Agents.git
cd Murf-AI-30-Days-of-Voice-Agents

# 2. Install dependencies for backend and frontend
# (Assuming separate frontend/backend directories)
cd backend && npm install
cd ../frontend && npm install
`;

const envVariables = `
GEMINI_API_KEY=your_google_gemini_api_key
MURF_API_KEY=your_murf_ai_api_key
PORT=8080
`;

const runInstructions = `
# 1. Start the backend server (from the /backend directory)
npm start

# 2. Start the frontend dev server (from the /frontend directory)
npm start

# 3. Open your browser
# The application should be running on http://localhost:3000
`;

function ReadmeDisplay(): React.ReactNode {
  return (
    <div className="space-y-12">
      <Section title="About The Project">
        <p className="text-gray-300 leading-relaxed">
          This project chronicles a 30-day journey to build sophisticated, conversational AI voice agents. This repository contains the daily progress, code, and learnings from integrating Murf AI's text-to-speech capabilities with large language models like Google Gemini to create interactive and expressive voice-based applications.
        </p>
      </Section>

      <Section title="Features">
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Dynamic, real-time voice generation from text.</li>
          <li>Conversational AI powered by Google Gemini.</li>
          <li>Streaming audio responses for low-latency interaction.</li>
          <li>Customizable voice avatars using different Murf AI voices.</li>
          <li>Secure backend server to manage API keys and business logic.</li>
          <li>Simple and intuitive web-based interface for user interaction.</li>
        </ul>
      </Section>

      <Section title="Tech Stack & Architecture">
        <p className="text-gray-300 mb-6">
          The project follows a modern client-server architecture to ensure security and separation of concerns.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-cyan-400">Frontend</h3>
            <p className="text-sm text-gray-400 mt-1">React, TypeScript, Tailwind CSS</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-cyan-400">Backend</h3>
            <p className="text-sm text-gray-400 mt-1">Node.js, Express.js</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-cyan-400">AI Services</h3>
            <p className="text-sm text-gray-400 mt-1">Google Gemini, Murf AI</p>
          </div>
        </div>
        <h4 className="font-semibold text-lg text-gray-100 mt-8 mb-4">Data Flow</h4>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 border border-gray-700 p-6 rounded-lg bg-gray-900/50">
            <li>User provides input (text or speech) via the React frontend.</li>
            <li>The frontend sends the request to the Node.js backend server.</li>
            <li>The backend forwards the user query to the Google Gemini API for processing and response generation.</li>
            <li>Gemini's text response is sent from the backend to the Murf AI API.</li>
            <li>Murf AI generates a high-quality audio stream from the text.</li>
            <li>The backend streams the audio data back to the frontend.</li>
            <li>The frontend plays the audio response to the user.</li>
        </ol>
      </Section>

      <Section title="Setup & Installation">
         <CodeBlock language="bash" code={setupInstructions} />
      </Section>

      <Section title="Environment Variables">
        <p className="text-gray-300 mb-4">
          Create a <code className="bg-gray-700 text-sm font-mono p-1 rounded">.env</code> file in the <code className="bg-gray-700 text-sm font-mono p-1 rounded">/backend</code> directory and add the following keys. These are essential for connecting to the AI services.
        </p>
        <CodeBlock language="env" code={envVariables} />
      </Section>
      
      <Section title="Running the Application">
        <p className="text-gray-300 mb-4">
          Follow these steps to run the client and server locally.
        </p>
        <CodeBlock language="bash" code={runInstructions} />
      </Section>
    </div>
  );
}

export default ReadmeDisplay;