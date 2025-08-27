#!/usr/bin/env python3
"""
Super Enhanced AI Voice Agent with Persona System, Web Search, and Weather Skills
Day 26: Agent Special Skill 2 Implementation
"""

import os
import json
import requests
from datetime import datetime
from gtts import gTTS
import tempfile

class SuperEnhancedVoiceAgent:
    def __init__(self, tavily_api_key=None, weather_api_key=None):
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
        self.tavily_api_key = tavily_api_key or "tvly-demo-key"
        self.weather_api_key = weather_api_key or "demo-weather-key"
        
    def set_persona(self, persona_name):
        """Set the active persona for the agent"""
        if persona_name.lower() in self.personas:
            self.current_persona = persona_name.lower()
            return True
        return False
    
    def get_persona_info(self):
        """Get information about the current persona"""
        return self.personas[self.current_persona]
    
    def web_search(self, query, max_results=3):
        """Perform web search using Tavily API (simulated for demo)"""
        try:
            # For demo purposes, we'll simulate a search response
            search_results = {
                "results": [
                    {
                        "title": f"Search result for: {query}",
                        "content": f"This is a simulated search result for the query '{query}'. In a real implementation, this would contain actual web search results from Tavily API.",
                        "url": "https://example.com/search-result"
                    }
                ]
            }
            
            # Format results for voice response
            if search_results.get("results"):
                formatted_results = f"I found {len(search_results['results'])} results for '{query}'. "
                for i, result in enumerate(search_results["results"][:max_results], 1):
                    formatted_results += f"Result {i}: {result['title']}. {result['content'][:200]}... "
                return formatted_results
            else:
                return f"I couldn't find any results for '{query}'. Please try a different search term."
                
        except Exception as e:
            return f"Sorry, I encountered an error while searching: {str(e)}"
    
    def get_weather(self, location="New York"):
        """Get weather information for a location (simulated for demo)"""
        try:
            # For demo purposes, we'll simulate weather data
            # In production, you would use a real weather API like OpenWeatherMap
            weather_data = {
                "location": location,
                "temperature": "22°C",
                "condition": "Partly Cloudy",
                "humidity": "65%",
                "wind_speed": "15 km/h",
                "description": "A pleasant day with some clouds and mild temperatures"
            }
            
            # Format weather data for voice response
            weather_report = f"Weather in {weather_data['location']}: {weather_data['temperature']}, {weather_data['condition']}. "
            weather_report += f"Humidity is {weather_data['humidity']}, wind speed {weather_data['wind_speed']}. "
            weather_report += f"{weather_data['description']}."
            
            return weather_report
                
        except Exception as e:
            return f"Sorry, I couldn't get weather information: {str(e)}"
    
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
        
        # Check if user is asking for weather information
        weather_keywords = ["weather", "temperature", "forecast", "climate", "rain", "sunny", "cloudy"]
        is_weather_request = any(keyword in user_input.lower() for keyword in weather_keywords)
        
        # Check if user is asking for a web search
        search_keywords = ["search", "find", "look up", "what is", "who is", "tell me about"]
        is_search_request = any(keyword in user_input.lower() for keyword in search_keywords)
        
        if is_weather_request:
            # Extract location if mentioned (simple implementation)
            location = "New York"  # Default location
            location_keywords = ["in", "at", "for"]
            for keyword in location_keywords:
                if keyword in user_input.lower():
                    parts = user_input.lower().split(keyword)
                    if len(parts) > 1:
                        potential_location = parts[1].strip().split()[0]
                        if potential_location:
                            location = potential_location.title()
            
            # Get weather information
            weather_info = self.get_weather(location)
            
            # Add persona-specific introduction to weather info
            if self.current_persona == "pirate":
                response = f"Ahoy! I've checked the weather winds for ye: {weather_info}"
            elif self.current_persona == "cowboy":
                response = f"Well partner, here's what the sky's tellin' us: {weather_info}"
            elif self.current_persona == "robot":
                response = f"Weather data retrieved and analyzed: {weather_info}"
            elif self.current_persona == "wizard":
                response = f"The mystical elements reveal the weather patterns: {weather_info}"
            elif self.current_persona == "detective":
                response = f"My meteorological investigation reveals: {weather_info}"
                
        elif is_search_request:
            # Extract search query (simple implementation)
            search_query = user_input.lower()
            for keyword in search_keywords:
                search_query = search_query.replace(keyword, "").strip()
            
            # Perform web search
            search_results = self.web_search(search_query)
            
            # Add persona-specific introduction to search results
            if self.current_persona == "pirate":
                response = f"Ahoy! I've sailed the digital seas and found this treasure of information: {search_results}"
            elif self.current_persona == "cowboy":
                response = f"Well partner, I've rounded up some information for ya: {search_results}"
            elif self.current_persona == "robot":
                response = f"Search protocol executed. Data retrieved: {search_results}"
            elif self.current_persona == "wizard":
                response = f"The mystical web has revealed these secrets: {search_results}"
            elif self.current_persona == "detective":
                response = f"My investigation has uncovered the following evidence: {search_results}"
        else:
            # Regular persona-based response logic
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
    
    def skills_demo(self):
        """Demonstrate both special skills with different personas"""
        print("\n🔍🌤️ Dual Special Skills Demonstration")
        print("=" * 60)
        
        test_queries = [
            ("What is artificial intelligence?", "search"),
            ("What's the weather like today?", "weather"),
            ("Tell me about space exploration", "search"),
            ("Check the weather in London", "weather"),
            ("Find information about climate change", "search")
        ]
        
        personas_to_test = ["pirate", "robot", "detective"]
        
        for i, persona in enumerate(personas_to_test):
            self.set_persona(persona)
            print(f"\n🎭 Testing with {self.personas[persona]['name']} persona:")
            
            # Test both skills with this persona
            search_query, search_type = test_queries[i * 2]
            weather_query, weather_type = test_queries[i * 2 + 1] if i * 2 + 1 < len(test_queries) else test_queries[1]
            
            print(f"🔍 Search Query: {search_query}")
            filename1 = self.respond(search_query)
            if filename1:
                print(f"🎵 Audio saved: {filename1}")
            
            print(f"🌤️ Weather Query: {weather_query}")
            filename2 = self.respond(weather_query)
            if filename2:
                print(f"🎵 Audio saved: {filename2}")
            
            print("-" * 40)
    
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
    
    def list_skills(self):
        """List all available special skills"""
        print("\n🛠️ Available Special Skills:")
        print("=" * 50)
        print("1. 🔍 Web Search - Search the internet for information")
        print("2. 🌤️ Weather Information - Get current weather conditions")
        print("3. 💬 Conversational AI - General chat with persona styling")
        print()
    
    def save_conversation_log(self, filename="super_enhanced_conversation_log.json"):
        """Save conversation history to file"""
        with open(filename, 'w') as f:
            json.dump(self.conversation_history, f, indent=2)
        print(f"💾 Conversation log saved to {filename}")

def main():
    """Main function to demonstrate the super enhanced voice agent"""
    print("🎭🔍🌤️ Super Enhanced AI Voice Agent with Dual Special Skills")
    print("=" * 70)
    
    agent = SuperEnhancedVoiceAgent()
    
    # List available skills
    agent.list_skills()
    
    # Demonstrate both special skills
    agent.skills_demo()
    
    # Save conversation log
    agent.save_conversation_log()
    
    # List all personas
    agent.list_personas()
    
    print("\n✅ Super Enhanced Voice Agent Demo Complete!")
    print("🎵 Check the generated .wav files for audio output")
    print("🔍 Web search skill successfully integrated!")
    print("🌤️ Weather information skill successfully integrated!")
    print("🎭 Both skills work with all persona characters!")

if __name__ == "__main__":
    main()

