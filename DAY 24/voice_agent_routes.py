from flask import Blueprint, request, jsonify, send_from_directory
from advanced_voice_agent import VoiceAgent
import os

voice_agent_bp = Blueprint("voice_agent_bp", __name__)

# Initialize the VoiceAgent (this will be a singleton for the app)
agent = VoiceAgent()

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
        # Assuming audio files are saved in a publicly accessible directory
        # For this example, we'll serve them from the root of the static folder
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

# Route to serve audio files
@voice_agent_bp.route("/<path:filename>")
def serve_audio(filename):
    # Ensure the files are served from the current working directory where they are saved
    return send_from_directory(os.getcwd(), filename)


