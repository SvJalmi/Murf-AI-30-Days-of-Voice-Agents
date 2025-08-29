#!/usr/bin/env python3
"""
Ultimate AI Voice Agent with Persona System, Dual Special Skills, and API Key Configuration
Day 27: Revamp UI and Code Cleanup Implementation
"""

import os
import json
import requests
from datetime import datetime
from gtts import gTTS
import tempfile
import logging
from typing import Dict, List, Optional, Tuple

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UltimateVoiceAgent:
    """
    Ultimate AI Voice Agent with configurable API keys and enhanced functionality
    """
    
    def __init__(self, tavily_api_key: Optional[str] = None, weather_api_key: Optional[str] = None):
        """
        Initialize the Ultimate Voice Agent
        
        Args:
            tavily_api_key: API key for Tavily search service
            weather_api_key: API key for weather service
        """
        self.personas = self._initialize_personas()
        self.current_persona = "pirate"
        self.conversation_history = []
        self.api_keys = {
            "tavily": tavily_api_key or "demo-tavily-key",
            "weather": weather_api_key or "demo-weather-key"
        }
        self.skills = self._initialize_skills()
        logger.info("Ultimate Voice Agent initialized successfully")
    
    def _initialize_personas(self) -> Dict:
        """Initialize persona definitions with enhanced characteristics"""
        return {
            "pirate": {
                "name": "Captain Blackbeard",
                "greeting": "Ahoy there, matey! Welcome aboard me ship! Ready for adventure on the high seas?",
                "speech_patterns": ["Arrr", "Ahoy", "matey", "ye", "me hearty", "shiver me timbers"],
                "personality": "adventurous, bold, seafaring, treasure-hunting",
                "voice_style": "gruff and commanding",
                "emoji": "🏴‍☠️",
                "background": "A legendary pirate captain who sailed the seven seas in search of treasure"
            },
            "cowboy": {
                "name": "Sheriff Jake",
                "greeting": "Howdy, partner! What brings ya to these parts? I'm here to help with whatever ya need!",
                "speech_patterns": ["Howdy", "partner", "y'all", "reckon", "mighty fine", "well I'll be"],
                "personality": "friendly, honest, down-to-earth, protective",
                "voice_style": "warm and drawling",
                "emoji": "🤠",
                "background": "A trustworthy sheriff who keeps the peace in the old western frontier"
            },
            "robot": {
                "name": "ARIA-7",
                "greeting": "Greetings, human. I am ARIA-7, your advanced artificial intelligence assistant. How may I assist you today?",
                "speech_patterns": ["Computing", "Processing", "Affirmative", "System ready", "Analyzing"],
                "personality": "logical, precise, helpful, analytical",
                "voice_style": "mechanical and precise",
                "emoji": "🤖",
                "background": "An advanced AI system designed to assist humans with various tasks and information"
            },
            "wizard": {
                "name": "Merlin the Wise",
                "greeting": "Greetings, young apprentice! The ancient magic flows through me, and I am here to share wisdom from ages past.",
                "speech_patterns": ["By my beard", "Ancient wisdom", "Magic flows", "Mystical", "Behold"],
                "personality": "wise, mysterious, magical, knowledgeable",
                "voice_style": "deep and mystical",
                "emoji": "🧙‍♂️",
                "background": "A powerful wizard with centuries of knowledge and magical abilities"
            },
            "detective": {
                "name": "Inspector Holmes",
                "greeting": "Good day. I'm Inspector Holmes, and I notice everything. What mystery shall we solve together today?",
                "speech_patterns": ["Elementary", "Observe", "Deduce", "Fascinating", "The evidence suggests"],
                "personality": "analytical, observant, methodical, intelligent",
                "voice_style": "sharp and analytical",
                "emoji": "🕵️",
                "background": "A brilliant detective who solves mysteries through careful observation and deduction"
            }
        }
    
    def _initialize_skills(self) -> List[Dict]:
        """Initialize available skills with metadata"""
        return [
            {
                "id": "web_search",
                "name": "Web Search",
                "description": "Search the internet for information on any topic",
                "icon": "🔍",
                "category": "Information",
                "requires_api": True,
                "api_service": "tavily"
            },
            {
                "id": "weather",
                "name": "Weather Information",
                "description": "Get current weather conditions for any location",
                "icon": "🌤️",
                "category": "Information",
                "requires_api": True,
                "api_service": "weather"
            },
            {
                "id": "conversation",
                "name": "Conversational AI",
                "description": "General chat with persona-driven responses",
                "icon": "💬",
                "category": "Communication",
                "requires_api": False,
                "api_service": None
            }
        ]
    
    def update_api_keys(self, api_keys: Dict[str, str]) -> bool:
        """
        Update API keys for various services
        
        Args:
            api_keys: Dictionary of service names and their API keys
            
        Returns:
            bool: True if keys were updated successfully
        """
        try:
            for service, key in api_keys.items():
                if service in self.api_keys and key.strip():
                    self.api_keys[service] = key.strip()
                    logger.info(f"Updated API key for {service}")
            return True
        except Exception as e:
            logger.error(f"Error updating API keys: {e}")
            return False
    
    def get_api_key_status(self) -> Dict[str, Dict]:
        """
        Get the status of all API keys
        
        Returns:
            Dict containing API key status information
        """
        status = {}
        for service, key in self.api_keys.items():
            status[service] = {
                "configured": key != f"demo-{service}-key",
                "service_name": service.title(),
                "required_for": [skill["name"] for skill in self.skills 
                               if skill.get("api_service") == service]
            }
        return status
    
    def set_persona(self, persona_name: str) -> bool:
        """
        Set the active persona for the agent
        
        Args:
            persona_name: Name of the persona to activate
            
        Returns:
            bool: True if persona was set successfully
        """
        if persona_name.lower() in self.personas:
            self.current_persona = persona_name.lower()
            logger.info(f"Persona set to {self.personas[self.current_persona]['name']}")
            return True
        logger.warning(f"Invalid persona: {persona_name}")
        return False
    
    def get_persona_info(self) -> Dict:
        """Get detailed information about the current persona"""
        return self.personas[self.current_persona]
    
    def get_all_personas(self) -> Dict:
        """Get information about all available personas"""
        return self.personas
    
    def web_search(self, query: str, max_results: int = 3) -> str:
        """
        Perform web search using configured API key
        
        Args:
            query: Search query
            max_results: Maximum number of results to return
            
        Returns:
            str: Formatted search results
        """
        try:
            # Check if API key is configured
            if self.api_keys["tavily"] == "demo-tavily-key":
                logger.warning("Using demo mode for web search - configure Tavily API key for real results")
                return self._demo_web_search(query)
            
            # In production, this would use the actual Tavily API
            # For now, we'll use the demo implementation
            return self._demo_web_search(query)
            
        except Exception as e:
            logger.error(f"Web search error: {e}")
            return f"Sorry, I encountered an error while searching: {str(e)}"
    
    def _demo_web_search(self, query: str) -> str:
        """Demo implementation of web search"""
        search_results = {
            "results": [
                {
                    "title": f"Search result for: {query}",
                    "content": f"This is a simulated search result for the query '{query}'. Configure your Tavily API key for real web search results.",
                    "url": "https://example.com/search-result"
                }
            ]
        }
        
        if search_results.get("results"):
            formatted_results = f"I found {len(search_results['results'])} results for '{query}'. "
            for i, result in enumerate(search_results["results"], 1):
                formatted_results += f"Result {i}: {result['title']}. {result['content'][:200]}... "
            return formatted_results
        else:
            return f"I couldn't find any results for '{query}'. Please try a different search term."
    
    def get_weather(self, location: str = "New York") -> str:
        """
        Get weather information for a location
        
        Args:
            location: Location to get weather for
            
        Returns:
            str: Formatted weather information
        """
        try:
            # Check if API key is configured
            if self.api_keys["weather"] == "demo-weather-key":
                logger.warning("Using demo mode for weather - configure Weather API key for real results")
                return self._demo_weather(location)
            
            # In production, this would use a real weather API like OpenWeatherMap
            return self._demo_weather(location)
            
        except Exception as e:
            logger.error(f"Weather error: {e}")
            return f"Sorry, I couldn't get weather information: {str(e)}"
    
    def _demo_weather(self, location: str) -> str:
        """Demo implementation of weather information"""
        weather_data = {
            "location": location,
            "temperature": "22°C",
            "condition": "Partly Cloudy",
            "humidity": "65%",
            "wind_speed": "15 km/h",
            "description": "A pleasant day with some clouds and mild temperatures"
        }
        
        weather_report = f"Weather in {weather_data['location']}: {weather_data['temperature']}, {weather_data['condition']}. "
        weather_report += f"Humidity is {weather_data['humidity']}, wind speed {weather_data['wind_speed']}. "
        weather_report += f"{weather_data['description']}. Configure your Weather API key for real-time data."
        
        return weather_report
    
    def apply_persona_style(self, text: str) -> str:
        """
        Apply persona-specific styling to text
        
        Args:
            text: Original text to style
            
        Returns:
            str: Styled text with persona characteristics
        """
        persona = self.personas[self.current_persona]
        
        # Add persona-specific speech patterns and styling
        if self.current_persona == "pirate":
            text = f"Arrr! {text} Ye savvy, matey?"
        elif self.current_persona == "cowboy":
            text = f"Well, I reckon {text.lower()}, partner. Mighty fine information!"
        elif self.current_persona == "robot":
            text = f"PROCESSING COMPLETE: {text} END TRANSMISSION."
        elif self.current_persona == "wizard":
            text = f"By my ancient wisdom, {text} So the mystical forces reveal!"
        elif self.current_persona == "detective":
            text = f"Elementary! {text} The evidence is quite clear, I deduce."
            
        return text
    
    def generate_speech(self, text: str, filename: Optional[str] = None) -> Optional[str]:
        """
        Generate speech with current persona styling
        
        Args:
            text: Text to convert to speech
            filename: Optional filename for the audio file
            
        Returns:
            str: Filename of generated audio file, or None if failed
        """
        if filename is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"voice_output_{self.current_persona}_{timestamp}.wav"
        
        # Apply persona styling
        styled_text = self.apply_persona_style(text)
        
        # Add to conversation history
        conversation_entry = {
            "timestamp": datetime.now().isoformat(),
            "persona": self.current_persona,
            "original_text": text,
            "styled_text": styled_text,
            "filename": filename
        }
        self.conversation_history.append(conversation_entry)
        
        # Generate speech
        try:
            tts = gTTS(text=styled_text, lang='en', slow=False)
            tts.save(filename)
            logger.info(f"Speech generated successfully: {filename}")
            return filename
        except Exception as e:
            logger.error(f"Error generating speech: {e}")
            return None
    
    def greet(self) -> Optional[str]:
        """Generate a greeting with the current persona"""
        persona = self.personas[self.current_persona]
        greeting = persona["greeting"]
        filename = f"greeting_{self.current_persona}.wav"
        return self.generate_speech(greeting, filename)
    
    def respond(self, user_input: str) -> Optional[str]:
        """
        Generate a response based on user input and current persona
        
        Args:
            user_input: User's message
            
        Returns:
            str: Filename of generated audio response
        """
        # Detect skill requirements
        weather_keywords = ["weather", "temperature", "forecast", "climate", "rain", "sunny", "cloudy"]
        search_keywords = ["search", "find", "look up", "what is", "who is", "tell me about"]
        
        is_weather_request = any(keyword in user_input.lower() for keyword in weather_keywords)
        is_search_request = any(keyword in user_input.lower() for keyword in search_keywords)
        
        if is_weather_request:
            # Extract location if mentioned
            location = self._extract_location(user_input)
            weather_info = self.get_weather(location)
            response = self._format_persona_response("weather", weather_info)
            
        elif is_search_request:
            # Extract search query
            search_query = self._extract_search_query(user_input, search_keywords)
            search_results = self.web_search(search_query)
            response = self._format_persona_response("search", search_results)
            
        else:
            # Regular conversation
            response = self._generate_conversation_response(user_input)
        
        return self.generate_speech(response)
    
    def _extract_location(self, user_input: str) -> str:
        """Extract location from user input for weather queries"""
        location = "New York"  # Default location
        location_keywords = ["in", "at", "for"]
        
        for keyword in location_keywords:
            if keyword in user_input.lower():
                parts = user_input.lower().split(keyword)
                if len(parts) > 1:
                    potential_location = parts[1].strip().split()[0]
                    if potential_location:
                        location = potential_location.title()
                        break
        
        return location
    
    def _extract_search_query(self, user_input: str, search_keywords: List[str]) -> str:
        """Extract search query from user input"""
        search_query = user_input.lower()
        for keyword in search_keywords:
            search_query = search_query.replace(keyword, "").strip()
        return search_query
    
    def _format_persona_response(self, skill_type: str, skill_result: str) -> str:
        """Format skill results with persona-specific introductions"""
        persona = self.current_persona
        
        if skill_type == "weather":
            if persona == "pirate":
                return f"Ahoy! I've checked the weather winds for ye: {skill_result}"
            elif persona == "cowboy":
                return f"Well partner, here's what the sky's tellin' us: {skill_result}"
            elif persona == "robot":
                return f"Weather data retrieved and analyzed: {skill_result}"
            elif persona == "wizard":
                return f"The mystical elements reveal the weather patterns: {skill_result}"
            elif persona == "detective":
                return f"My meteorological investigation reveals: {skill_result}"
                
        elif skill_type == "search":
            if persona == "pirate":
                return f"Ahoy! I've sailed the digital seas and found this treasure: {skill_result}"
            elif persona == "cowboy":
                return f"Well partner, I've rounded up some information for ya: {skill_result}"
            elif persona == "robot":
                return f"Search protocol executed. Data retrieved: {skill_result}"
            elif persona == "wizard":
                return f"The mystical web has revealed these secrets: {skill_result}"
            elif persona == "detective":
                return f"My investigation has uncovered the following evidence: {skill_result}"
        
        return skill_result
    
    def _generate_conversation_response(self, user_input: str) -> str:
        """Generate general conversation responses based on persona"""
        persona = self.current_persona
        
        if persona == "pirate":
            if "treasure" in user_input.lower():
                return "Aye, treasure be what every pirate seeks! X marks the spot, matey!"
            elif "ship" in user_input.lower():
                return "Me ship be the finest vessel on the seven seas! She's sailed through many storms!"
            else:
                return "Interesting tale ye tell, matey! Tell me more about yer adventures!"
                
        elif persona == "cowboy":
            if "horse" in user_input.lower():
                return "That's a mighty fine horse ya got there, partner! I've got a trusty steed myself!"
            elif "town" in user_input.lower():
                return "This here town ain't big enough for trouble, but it's perfect for good folks like yerself!"
            else:
                return "That's mighty interesting, partner! Y'all sure know how to tell a good story!"
                
        elif persona == "robot":
            return f"Input received and processed: '{user_input}'. Analysis complete. How may I assist you further, human?"
            
        elif persona == "wizard":
            return "The mystical energies reveal much about your query, young apprentice. Ancient wisdom flows through your words."
            
        elif persona == "detective":
            return "Fascinating observation! Let me deduce the implications of what you've shared. The evidence suggests there's more to discover."
        
        return "That's very interesting! Tell me more."
    
    def get_conversation_history(self) -> List[Dict]:
        """Get the complete conversation history"""
        return self.conversation_history
    
    def save_conversation_log(self, filename: str = "ultimate_conversation_log.json") -> bool:
        """
        Save conversation history to file
        
        Args:
            filename: Name of the file to save to
            
        Returns:
            bool: True if saved successfully
        """
        try:
            with open(filename, 'w') as f:
                json.dump(self.conversation_history, f, indent=2)
            logger.info(f"Conversation log saved to {filename}")
            return True
        except Exception as e:
            logger.error(f"Error saving conversation log: {e}")
            return False
    
    def get_agent_stats(self) -> Dict:
        """Get comprehensive agent statistics and information"""
        return {
            "current_persona": self.current_persona,
            "total_personas": len(self.personas),
            "available_skills": len(self.skills),
            "conversation_entries": len(self.conversation_history),
            "api_key_status": self.get_api_key_status(),
            "skills": self.skills,
            "personas": {name: {
                "name": info["name"],
                "emoji": info["emoji"],
                "personality": info["personality"]
            } for name, info in self.personas.items()}
        }

def main():
    """Main function to demonstrate the ultimate voice agent"""
    print("🎭🔍🌤️⚙️ Ultimate AI Voice Agent with API Configuration")
    print("=" * 80)
    
    agent = UltimateVoiceAgent()
    
    # Display agent information
    stats = agent.get_agent_stats()
    print(f"📊 Agent Statistics:")
    print(f"   • Personas: {stats['total_personas']}")
    print(f"   • Skills: {stats['available_skills']}")
    print(f"   • Current Persona: {stats['current_persona'].title()}")
    
    # Display API key status
    print(f"\n🔑 API Key Status:")
    for service, status in stats['api_key_status'].items():
        status_icon = "✅" if status['configured'] else "⚠️"
        print(f"   {status_icon} {status['service_name']}: {'Configured' if status['configured'] else 'Using Demo Mode'}")
    
    # Test functionality
    print(f"\n🧪 Testing Ultimate Voice Agent...")
    
    # Test greeting
    print(f"Testing greeting...")
    greeting_file = agent.greet()
    if greeting_file:
        print(f"✅ Greeting generated: {greeting_file}")
    
    # Test skills
    test_queries = [
        "What is machine learning?",
        "What's the weather in Tokyo?",
        "Tell me about pirates!"
    ]
    
    for query in test_queries:
        print(f"Testing query: '{query}'")
        response_file = agent.respond(query)
        if response_file:
            print(f"✅ Response generated: {response_file}")
    
    # Save conversation log
    agent.save_conversation_log()
    
    print(f"\n✅ Ultimate Voice Agent demonstration complete!")
    print(f"🎵 Check the generated .wav files for audio output")
    print(f"📝 Conversation log saved with all interactions")

if __name__ == "__main__":
    main()

