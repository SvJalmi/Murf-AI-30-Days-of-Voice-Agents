from flask import Blueprint, request, jsonify, send_from_directory
from super_enhanced_voice_agent import SuperEnhancedVoiceAgent
import os

voice_agent_bp = Blueprint("voice_agent_bp", __name__)

# Initialize the Super Enhanced VoiceAgent (this will be a singleton for the app)
agent = SuperEnhancedVoiceAgent()

@voice_agent_bp.route("/set_persona", methods=["POST"])
def set_persona():
    data = request.get_json()
    persona_name = data.get("persona")
    if persona_name and agent.set_persona(persona_name):
        return jsonify({"message": f"Persona set to {persona_name}"}), 200
    return jsonify({"error": "Invalid persona"}), 400

@voice_agent_bp.route("/greet", methods=["GET"])
def greet():
    audio_filename = agent.greet()
    if audio_filename:
        return jsonify({"message": "Greeting generated", "audio_url": f"/{audio_filename}"}), 200
    return jsonify({"error": "Failed to generate greeting"}), 500

@voice_agent_bp.route("/respond", methods=["POST"])
def respond():
    data = request.get_json()
    user_message = data.get("message")
    if user_message:
        audio_filename = agent.respond(user_message)
        if audio_filename:
            return jsonify({"message": "Response generated", "audio_url": f"/{audio_filename}"}), 200
        return jsonify({"error": "Failed to generate response"}), 500
    return jsonify({"error": "No message provided"}), 400

@voice_agent_bp.route("/search", methods=["POST"])
def web_search():
    data = request.get_json()
    search_query = data.get("query")
    if search_query:
        # Perform search and generate voice response
        search_results = agent.web_search(search_query)
        audio_filename = agent.generate_speech(search_results)
        if audio_filename:
            return jsonify({
                "message": "Search completed", 
                "results": search_results,
                "audio_url": f"/{audio_filename}"
            }), 200
        return jsonify({"error": "Failed to generate search response"}), 500
    return jsonify({"error": "No search query provided"}), 400

@voice_agent_bp.route("/weather", methods=["POST"])
def get_weather():
    data = request.get_json()
    location = data.get("location", "New York")
    if location:
        # Get weather information and generate voice response
        weather_info = agent.get_weather(location)
        
        # Add persona-specific introduction to weather info
        if agent.current_persona == "pirate":
            response = f"Ahoy! I've checked the weather winds for ye: {weather_info}"
        elif agent.current_persona == "cowboy":
            response = f"Well partner, here's what the sky's tellin' us: {weather_info}"
        elif agent.current_persona == "robot":
            response = f"Weather data retrieved and analyzed: {weather_info}"
        elif agent.current_persona == "wizard":
            response = f"The mystical elements reveal the weather patterns: {weather_info}"
        elif agent.current_persona == "detective":
            response = f"My meteorological investigation reveals: {weather_info}"
        else:
            response = weather_info
            
        audio_filename = agent.generate_speech(response)
        if audio_filename:
            return jsonify({
                "message": "Weather information retrieved", 
                "weather": weather_info,
                "audio_url": f"/{audio_filename}"
            }), 200
        return jsonify({"error": "Failed to generate weather response"}), 500
    return jsonify({"error": "No location provided"}), 400

@voice_agent_bp.route("/persona_info", methods=["GET"])
def get_persona_info():
    persona_info = agent.get_persona_info()
    return jsonify({
        "current_persona": agent.current_persona,
        "persona_info": persona_info
    }), 200

@voice_agent_bp.route("/skills", methods=["GET"])
def get_skills():
    skills = [
        {"name": "Web Search", "description": "Search the internet for information", "icon": "🔍"},
        {"name": "Weather Information", "description": "Get current weather conditions", "icon": "🌤️"},
        {"name": "Conversational AI", "description": "General chat with persona styling", "icon": "💬"}
    ]
    return jsonify({"skills": skills}), 200

# Route to serve audio files
@voice_agent_bp.route("/<path:filename>")
def serve_audio(filename):
    # Ensure the files are served from the current working directory where they are saved
    return send_from_directory(os.getcwd(), filename)


