#!/usr/bin/env python3
"""
Advanced AI Voice Agent with Persona System
Day 24: Agent Persona Implementation
"""

import os
import json
from datetime import datetime
from gtts import gTTS
import tempfile

class VoiceAgent:
    def __init__(self):
        self.personas = {
            "pirate": {
                "name": "Captain Blackbeard",
                "greeting": "Ahoy there, matey! Welcome aboard me ship!",
                "speech_patterns": ["Arrr", "Ahoy", "matey", "ye", "me hearty"],
                "personality": "adventurous, bold, seafaring",
                "voice_style": "gruff and commanding"
            },
            "cowboy": {
                "name": "Sheriff Jake",
                "greeting": "Howdy, partner! What brings ya to these parts?",
                "speech_patterns": ["Howdy", "partner", "y'all", "reckon", "mighty fine"],
                "personality": "friendly, honest, down-to-earth",
                "voice_style": "warm and drawling"
            },
            "robot": {
                "name": "ARIA-7",
                "greeting": "Greetings, human. I am ARIA-7, your artificial intelligence assistant.",
                "speech_patterns": ["Computing", "Processing", "Affirmative", "System ready"],
                "personality": "logical, precise, helpful",
                "voice_style": "mechanical and precise"
            },
            "wizard": {
                "name": "Merlin the Wise",
                "greeting": "Greetings, young apprentice! The ancient magic flows through me.",
                "speech_patterns": ["By my beard", "Ancient wisdom", "Magic flows", "Mystical"],
                "personality": "wise, mysterious, magical",
                "voice_style": "deep and mystical"
            },
            "detective": {
                "name": "Inspector Holmes",
                "greeting": "Good day. I'm Inspector Holmes, and I notice everything.",
                "speech_patterns": ["Elementary", "Observe", "Deduce", "Fascinating"],
                "personality": "analytical, observant, methodical",
                "voice_style": "sharp and analytical"
            }
        }
        self.current_persona = "pirate"
        self.conversation_history = []
        
    def set_persona(self, persona_name):
        """Set the active persona for the agent"""
        if persona_name.lower() in self.personas:
            self.current_persona = persona_name.lower()
            return True
        return False
    
    def get_persona_info(self):
        """Get information about the current persona"""
        return self.personas[self.current_persona]
    
    def apply_persona_style(self, text):
        """Apply persona-specific styling to text"""
        persona = self.personas[self.current_persona]
        
        # Add persona-specific speech patterns
        if self.current_persona == "pirate":
            text = f"Arrr! {text} Ye savvy?"
        elif self.current_persona == "cowboy":
            text = f"Well, I reckon {text.lower()}, partner."
        elif self.current_persona == "robot":
            text = f"PROCESSING: {text} END TRANSMISSION."
        elif self.current_persona == "wizard":
            text = f"By my ancient wisdom, {text} So the magic reveals!"
        elif self.current_persona == "detective":
            text = f"Elementary! {text} The evidence is clear."
            
        return text
    
    def generate_speech(self, text, filename=None):
        """Generate speech with current persona styling"""
        if filename is None:
            filename = f"voice_output_{self.current_persona}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.wav"
        
        # Apply persona styling
        styled_text = self.apply_persona_style(text)
        
        # Add to conversation history
        self.conversation_history.append({
            "timestamp": datetime.now().isoformat(),
            "persona": self.current_persona,
            "original_text": text,
            "styled_text": styled_text,
            "filename": filename
        })
        
        # Generate speech
        try:
            tts = gTTS(text=styled_text, lang='en', slow=False)
            tts.save(filename)
            print(f"✅ Speech generated successfully: {filename}")
            print(f"🎭 Persona: {self.personas[self.current_persona]['name']}")
            print(f"💬 Text: {styled_text}")
            return filename
        except Exception as e:
            print(f"❌ Error generating speech: {e}")
            return None
    
    def greet(self):
        """Generate a greeting with the current persona"""
        persona = self.personas[self.current_persona]
        greeting = persona["greeting"]
        return self.generate_speech(greeting, f"greeting_{self.current_persona}.wav")
    
    def respond(self, user_input):
        """Generate a response based on user input and current persona"""
        persona = self.personas[self.current_persona]
        
        # Simple response logic based on persona
        if self.current_persona == "pirate":
            if "treasure" in user_input.lower():
                response = "Aye, treasure be what every pirate seeks! X marks the spot!"
            elif "ship" in user_input.lower():
                response = "Me ship be the finest vessel on the seven seas!"
            else:
                response = "Interesting tale ye tell, matey!"
                
        elif self.current_persona == "cowboy":
            if "horse" in user_input.lower():
                response = "That's a mighty fine horse ya got there, partner!"
            elif "town" in user_input.lower():
                response = "This here town ain't big enough for trouble!"
            else:
                response = "That's mighty interesting, partner!"
                
        elif self.current_persona == "robot":
            response = f"Input received: '{user_input}'. Processing complete. How may I assist further?"
            
        elif self.current_persona == "wizard":
            response = "The mystical energies reveal much about your query, young one."
            
        elif self.current_persona == "detective":
            response = "Fascinating observation. Let me deduce the implications."
        
        return self.generate_speech(response)
    
    def list_personas(self):
        """List all available personas"""
        print("\n🎭 Available Personas:")
        print("=" * 50)
        for key, persona in self.personas.items():
            status = "👑 ACTIVE" if key == self.current_persona else ""
            print(f"• {persona['name']} ({key}) {status}")
            print(f"  Personality: {persona['personality']}")
            print(f"  Style: {persona['voice_style']}")
            print()
    
    def save_conversation_log(self, filename="conversation_log.json"):
        """Save conversation history to file"""
        with open(filename, 'w') as f:
            json.dump(self.conversation_history, f, indent=2)
        print(f"💾 Conversation log saved to {filename}")

def main():
    """Main function to demonstrate the voice agent"""
    print("🎭 AI Voice Agent with Persona System")
    print("=" * 50)
    
    agent = VoiceAgent()
    
    # Demonstrate different personas
    personas_to_demo = ["pirate", "cowboy", "robot", "wizard", "detective"]
    
    for persona in personas_to_demo:
        print(f"\n🔄 Switching to {persona} persona...")
        agent.set_persona(persona)
        
        # Generate greeting
        print(f"🎤 Generating greeting...")
        agent.greet()
        
        # Generate a sample response
        sample_inputs = {
            "pirate": "Tell me about your treasure",
            "cowboy": "How's your horse doing?",
            "robot": "What is your primary function?",
            "wizard": "Show me some magic",
            "detective": "I need help solving a mystery"
        }
        
        print(f"🎤 Generating response to: '{sample_inputs[persona]}'")
        agent.respond(sample_inputs[persona])
        
        print("-" * 30)
    
    # Save conversation log
    agent.save_conversation_log()
    
    # List all personas
    agent.list_personas()
    
    print("\n✅ Voice Agent Demo Complete!")
    print("🎵 Check the generated .wav files for audio output")

if __name__ == "__main__":
    main()

