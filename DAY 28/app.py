from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os
import sys
import logging
from gtts import gTTS
import requests
import json
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='src/static')
CORS(app)

class UltimateVoiceAgent:
    def __init__(self):
        self.personas = {
            "pirate": {
                "name": "Captain Blackbeard",
                "emoji": "🏴‍☠️",
                "personality": "adventurous, bold, seafaring, treasure-hunting",
                "greeting": "Ahoy there, matey! Captain Blackbeard at yer service!",
                "style": "Arrr! {message} Ye savvy?"
            },
            "cowboy": {
                "name": "Sheriff Jake",
                "emoji": "🤠",
                "personality": "brave, honest, frontier spirit, justice-seeking",
                "greeting": "Howdy partner! Sheriff Jake here, ready to help!",
                "style": "Well partner, {message} Y'all take care now!"
            },
            "robot": {
                "name": "ARIA-7",
                "emoji": "🤖",
                "personality": "logical, efficient, analytical, helpful",
                "greeting": "System initialized. ARIA-7 online and ready for assistance.",
                "style": "Processing... {message} System status: operational."
            },
            "wizard": {
                "name": "Merlin the Wise",
                "emoji": "🧙‍♂️",
                "personality": "wise, mystical, ancient knowledge, magical",
                "greeting": "Greetings, seeker of knowledge! Merlin the Wise welcomes you.",
                "style": "By the ancient arts, {message} May wisdom guide your path!"
            },
            "detective": {
                "name": "Inspector Holmes",
                "emoji": "🕵️",
                "personality": "analytical, observant, deductive, methodical",
                "greeting": "Good day! Inspector Holmes at your service, ready to solve any mystery.",
                "style": "Elementary! {message} The evidence is quite clear!"
            }
        }
        
        self.current_persona = "pirate"
        self.conversation_history = []
        self.api_keys = {}
        
        logger.info("Ultimate Voice Agent initialized successfully")

    def set_persona(self, persona_name):
        if persona_name in self.personas:
            self.current_persona = persona_name
            return True
        return False

    def get_persona_info(self):
        return self.personas.get(self.current_persona, {})

    def generate_speech(self, text):
        try:
            filename = f"voice_output_{self.current_persona}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.wav"
            filepath = os.path.join("src", filename)
            
            tts = gTTS(text=text, lang='en', slow=False)
            tts.save(filepath)
            
            return filename
        except Exception as e:
            logger.error(f"Error generating speech: {e}")
            return None

    def greet(self):
        persona_info = self.get_persona_info()
        greeting = persona_info.get("greeting", "Hello!")
        return self.generate_speech(greeting)

    def respond(self, user_message):
        persona_info = self.get_persona_info()
        style = persona_info.get("style", "{message}")
        response = style.format(message=f"You said: {user_message}. That's interesting!")
        
        self.conversation_history.append({
            "user": user_message,
            "agent": response,
            "persona": self.current_persona,
            "timestamp": datetime.now().isoformat()
        })
        
        return self.generate_speech(response)

    def web_search(self, query):
        # Simulated search for demo
        return f"I found 1 results for '{query}': This is a simulated search result for the query '{query}'. Configure your Tavily API key for real web search results."

    def get_weather(self, location):
        # Simulated weather for demo
        return f"Weather in {location}: Partly cloudy, 22°C. This is simulated weather data. Configure your Weather API key for real weather information."

    def update_api_keys(self, api_keys):
        self.api_keys.update(api_keys)
        return True

    def get_api_key_status(self):
        return {
            "tavily": {
                "service_name": "Tavily",
                "configured": "tavily" in self.api_keys and bool(self.api_keys["tavily"])
            },
            "weather": {
                "service_name": "Weather",
                "configured": "weather" in self.api_keys and bool(self.api_keys["weather"])
            }
        }

    def get_agent_stats(self):
        return {
            "total_personas": len(self.personas),
            "available_skills": 3,
            "conversation_entries": len(self.conversation_history),
            "current_persona": self.current_persona,
            "api_key_status": self.get_api_key_status(),
            "personas": self.personas
        }

# Initialize the agent
agent = UltimateVoiceAgent()

# Routes
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/api/set_persona', methods=['POST'])
def set_persona():
    data = request.get_json()
    persona_name = data.get("persona")
    if persona_name and agent.set_persona(persona_name):
        persona_info = agent.get_persona_info()
        return jsonify({
            "message": f"Persona set to {persona_info['name']} {persona_info['emoji']}",
            "persona": persona_name,
            "persona_info": persona_info
        }), 200
    return jsonify({"error": "Invalid persona"}), 400

@app.route('/api/greet', methods=['GET'])
def greet():
    audio_filename = agent.greet()
    if audio_filename:
        persona_info = agent.get_persona_info()
        return jsonify({
            "message": f"{persona_info['name']} says hello!",
            "audio_url": f"/{audio_filename}",
            "persona": agent.current_persona
        }), 200
    return jsonify({"error": "Failed to generate greeting"}), 500

@app.route('/api/respond', methods=['POST'])
def respond():
    data = request.get_json()
    user_message = data.get("message")
    if user_message:
        audio_filename = agent.respond(user_message)
        if audio_filename:
            return jsonify({
                "message": "Response generated",
                "audio_url": f"/{audio_filename}",
                "user_input": user_message
            }), 200
        return jsonify({"error": "Failed to generate response"}), 500
    return jsonify({"error": "No message provided"}), 400

@app.route('/api/search', methods=['POST'])
def web_search():
    data = request.get_json()
    search_query = data.get("query")
    if search_query:
        search_results = agent.web_search(search_query)
        persona_info = agent.get_persona_info()
        style = persona_info.get("style", "{message}")
        response = style.format(message=search_results)
        audio_filename = agent.generate_speech(response)
        if audio_filename:
            return jsonify({
                "message": "Search completed", 
                "results": search_results,
                "audio_url": f"/{audio_filename}",
                "query": search_query
            }), 200
        return jsonify({"error": "Failed to generate search response"}), 500
    return jsonify({"error": "No search query provided"}), 400

@app.route('/api/weather', methods=['POST'])
def get_weather():
    data = request.get_json()
    location = data.get("location", "New York")
    if location:
        weather_info = agent.get_weather(location)
        persona_info = agent.get_persona_info()
        style = persona_info.get("style", "{message}")
        response = style.format(message=weather_info)
        audio_filename = agent.generate_speech(response)
        if audio_filename:
            return jsonify({
                "message": "Weather information retrieved", 
                "weather": weather_info,
                "audio_url": f"/{audio_filename}",
                "location": location
            }), 200
        return jsonify({"error": "Failed to generate weather response"}), 500
    return jsonify({"error": "No location provided"}), 400

@app.route('/api/api_keys', methods=['POST'])
def update_api_keys():
    data = request.get_json()
    api_keys = data.get("api_keys", {})
    
    if agent.update_api_keys(api_keys):
        status = agent.get_api_key_status()
        return jsonify({
            "message": "API keys updated successfully",
            "status": status
        }), 200
    return jsonify({"error": "Failed to update API keys"}), 500

@app.route('/api/api_keys', methods=['GET'])
def get_api_key_status():
    status = agent.get_api_key_status()
    return jsonify({
        "message": "API key status retrieved",
        "status": status
    }), 200

@app.route('/api/persona_info', methods=['GET'])
def get_persona_info():
    persona_info = agent.get_persona_info()
    all_personas = agent.personas
    return jsonify({
        "current_persona": agent.current_persona,
        "persona_info": persona_info,
        "all_personas": {name: {
            "name": info["name"],
            "emoji": info["emoji"],
            "personality": info["personality"]
        } for name, info in all_personas.items()}
    }), 200

@app.route('/api/skills', methods=['GET'])
def get_skills():
    skills = [
        {"name": "Web Search", "description": "Search the internet for information", "icon": "🔍"},
        {"name": "Weather Information", "description": "Get current weather conditions", "icon": "🌤️"},
        {"name": "Conversational AI", "description": "General chat with persona styling", "icon": "💬"}
    ]
    api_status = agent.get_api_key_status()
    
    for skill in skills:
        if skill["name"] == "Web Search":
            skill["api_configured"] = api_status.get("tavily", {}).get("configured", False)
        elif skill["name"] == "Weather Information":
            skill["api_configured"] = api_status.get("weather", {}).get("configured", False)
        else:
            skill["api_configured"] = True
    
    return jsonify({
        "skills": skills,
        "api_status": api_status
    }), 200

@app.route('/api/stats', methods=['GET'])
def get_agent_stats():
    stats = agent.get_agent_stats()
    return jsonify({
        "message": "Agent statistics retrieved",
        "stats": stats
    }), 200

@app.route('/api/conversation_history', methods=['GET'])
def get_conversation_history():
    history = agent.conversation_history
    return jsonify({
        "message": "Conversation history retrieved",
        "history": history,
        "total_entries": len(history)
    }), 200

@app.route('/api/conversation_history', methods=['DELETE'])
def clear_conversation_history():
    agent.conversation_history = []
    return jsonify({
        "message": "Conversation history cleared"
    }), 200

if __name__ == '__main__':
    # Ensure the directory for audio files exists
    if not os.path.exists('src'):
        os.makedirs('src')
    app.run(host='0.0.0.0', port=5000, debug=True)

