import React from 'react';
import type { VoiceAgent } from '../types';

interface AgentSelectorProps {
  agents: VoiceAgent[];
  selectedAgent: VoiceAgent;
  onSelectAgent: (agent: VoiceAgent) => void;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({ agents, selectedAgent, onSelectAgent }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4 text-content-100 sticky top-0 bg-base-200 py-2">Select an Agent</h2>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary ${
              selectedAgent.id === agent.id
                ? 'bg-brand-primary text-white shadow-lg'
                : 'bg-base-300 hover:bg-opacity-70 text-content-100'
            }`}
          >
            <img src={agent.avatarUrl} alt={agent.name} className="w-10 h-10 rounded-full border-2 border-brand-light" />
            <div>
              <p className="font-bold">{agent.name}</p>
              <p className={`text-xs ${selectedAgent.id === agent.id ? 'text-gray-300' : 'text-content-200'}`}>{agent.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
