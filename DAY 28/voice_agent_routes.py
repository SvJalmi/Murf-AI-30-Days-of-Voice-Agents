from flask import Blueprint, request, jsonify, send_from_directory
from ultimate_voice_agent import UltimateVoiceAgent
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

voice_agent_bp = Blueprint("voice_agent_bp", __name__)

# Initialize the Ultimate VoiceAgent (this will be a singleton for the app)
agent = UltimateVoiceAgent()

@voice_agent_bp.route("/set_persona", methods=["POST"])
def set_persona():
    """Set the active persona for the agent"""
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

@voice_agent_bp.route("/greet", methods=["GET"])
def greet():
    """Generate a greeting with the current persona"""
    audio_filename = agent.greet()
    if audio_filename:
        persona_info = agent.get_persona_info()
        return jsonify({
            "message": f"{persona_info['name']} says hello!",
            "audio_url": f"/{audio_filename}",
            "persona": agent.current_persona
        }), 200
    return jsonify({"error": "Failed to generate greeting"}), 500

@voice_agent_bp.route("/respond", methods=["POST"])
def respond():
    """Generate a response based on user input and current persona"""
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

@voice_agent_bp.route("/search", methods=["POST"])
def web_search():
    """Perform web search with persona-styled response"""
    data = request.get_json()
    search_query = data.get("query")
    if search_query:
        # Perform search and generate voice response
        search_results = agent.web_search(search_query)
        response = agent._format_persona_response("search", search_results)
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

@voice_agent_bp.route("/weather", methods=["POST"])
def get_weather():
    """Get weather information with persona-styled response"""
    data = request.get_json()
    location = data.get("location", "New York")
    if location:
        # Get weather information and generate voice response
        weather_info = agent.get_weather(location)
        response = agent._format_persona_response("weather", weather_info)
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

@voice_agent_bp.route("/api_keys", methods=["POST"])
def update_api_keys():
    """Update API keys for various services"""
    data = request.get_json()
    api_keys = data.get("api_keys", {})
    
    if agent.update_api_keys(api_keys):
        status = agent.get_api_key_status()
        return jsonify({
            "message": "API keys updated successfully",
            "status": status
        }), 200
    return jsonify({"error": "Failed to update API keys"}), 500

@voice_agent_bp.route("/api_keys", methods=["GET"])
def get_api_key_status():
    """Get the status of all API keys"""
    status = agent.get_api_key_status()
    return jsonify({
        "message": "API key status retrieved",
        "status": status
    }), 200

@voice_agent_bp.route("/persona_info", methods=["GET"])
def get_persona_info():
    """Get information about the current persona"""
    persona_info = agent.get_persona_info()
    all_personas = agent.get_all_personas()
    return jsonify({
        "current_persona": agent.current_persona,
        "persona_info": persona_info,
        "all_personas": {name: {
            "name": info["name"],
            "emoji": info["emoji"],
            "personality": info["personality"]
        } for name, info in all_personas.items()}
    }), 200

@voice_agent_bp.route("/skills", methods=["GET"])
def get_skills():
    """Get information about all available skills"""
    skills = agent.skills
    api_status = agent.get_api_key_status()
    
    # Add API status to skills that require it
    for skill in skills:
        if skill.get("requires_api") and skill.get("api_service"):
            service = skill["api_service"]
            skill["api_configured"] = api_status.get(service, {}).get("configured", False)
    
    return jsonify({
        "skills": skills,
        "api_status": api_status
    }), 200

@voice_agent_bp.route("/stats", methods=["GET"])
def get_agent_stats():
    """Get comprehensive agent statistics and information"""
    stats = agent.get_agent_stats()
    return jsonify({
        "message": "Agent statistics retrieved",
        "stats": stats
    }), 200

@voice_agent_bp.route("/conversation_history", methods=["GET"])
def get_conversation_history():
    """Get the conversation history"""
    history = agent.get_conversation_history()
    return jsonify({
        "message": "Conversation history retrieved",
        "history": history,
        "total_entries": len(history)
    }), 200

@voice_agent_bp.route("/conversation_history", methods=["DELETE"])
def clear_conversation_history():
    """Clear the conversation history"""
    agent.conversation_history = []
    return jsonify({
        "message": "Conversation history cleared"
    }), 200

# Route to serve audio files
@voice_agent_bp.route("/<path:filename>")
def serve_audio(filename):
    """Serve generated audio files"""
    try:
        # Ensure the files are served from the current working directory where they are saved
        return send_from_directory(os.getcwd(), filename)
    except Exception as e:
        logger.error(f"Error serving audio file {filename}: {e}")
        return jsonify({"error": "Audio file not found"}), 404

