
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { AgentSelector } from './components/AgentSelector';
import { ChatInterface } from './components/ChatInterface';
import { AGENTS } from './constants';
import type { VoiceAgent } from './types';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<VoiceAgent>(AGENTS[0]);

  const handleSelectAgent = useCallback((agent: VoiceAgent) => {
    setSelectedAgent(agent);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-base-100 text-content-100 font-sans">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="w-full h-full flex flex-col md:flex-row">
          <aside className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5 bg-base-200 border-r border-base-300 overflow-y-auto p-4 h-1/3 md:h-full">
            <AgentSelector
              agents={AGENTS}
              selectedAgent={selectedAgent}
              onSelectAgent={handleSelectAgent}
            />
          </aside>
          <section className="flex-1 flex flex-col bg-base-100 h-2/3 md:h-full">
            <ChatInterface key={selectedAgent.id} agent={selectedAgent} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
