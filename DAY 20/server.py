
import asyncio
import websockets
import json
import os
import logging
from typing import Type
import assemblyai as aai
from assemblyai.streaming.v3 import (
    BeginEvent,
    StreamingClient,
    StreamingClientOptions,
    StreamingError,
    StreamingEvents,
    StreamingParameters,
    StreamingSessionParameters,
    TerminationEvent,
    TurnEvent,
)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import google.generativeai as genai

api_key = "a056f31f3b6547f2acb004ba65e4ab4d"

# Set your Google Generative AI API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# Set your Murf API key
MURF_API_KEY = "ap2_525f0d4e-4bba-4b05-9eed-49257eccb029"
MURF_WS_URL = f"wss://api.murf.ai/v1/speech/stream-input?api-key={MURF_API_KEY}&sample_rate=44100&channel_type=MONO&format=WAV"

class AudioTranscriber:
    def __init__(self, websocket):
        self.websocket = websocket
        self.client = None
        self.murf_ws = None
        self.murf_connected = False
        self.context_id = "static_context_day20"  # Static context ID to avoid limits
        
    def on_begin(self, client, event: BeginEvent):
        logger.info(f"Session started: {event.id}")
        
    def on_turn(self, client, event: TurnEvent):
        logger.info(f"Turn {event.turn_order}: '{event.transcript}' (end_of_turn: {event.end_of_turn}, confidence: {event.end_of_turn_confidence})")
        
        # Only send transcription to client at the end of each turn
        if event.end_of_turn:
            logger.info(f"🔚 End of turn detected! Sending final transcription: '{event.transcript}'")
            
            # Send turn completion notification to client
            asyncio.create_task(self.send_to_client({
                "type": "turn_complete",
                "turn_order": event.turn_order,
                "transcript": event.transcript,
                "turn_is_formatted": event.turn_is_formatted,
                "end_of_turn_confidence": event.end_of_turn_confidence,
                "word_count": len(event.words) if event.words else 0
            }))
            
            # If this turn is not formatted, request formatting
            if not event.turn_is_formatted:
                params = StreamingSessionParameters(
                    format_turns=True,
                )
                client.set_params(params)
            
            # Send final transcript to LLM and stream response
            if event.transcript:
                asyncio.create_task(self.get_llm_response(event.transcript))

        else:
            # Send partial transcription for real-time feedback (optional)
            asyncio.create_task(self.send_to_client({
                "type": "partial_transcript",
                "turn_order": event.turn_order,
                "transcript": event.transcript,
                "end_of_turn_confidence": event.end_of_turn_confidence
            }))

    async def connect_murf_websocket(self):
        """Connect to Murf WebSocket for text-to-speech conversion"""
        try:
            self.murf_ws = await websockets.connect(MURF_WS_URL)
            self.murf_connected = True
            logger.info("Connected to Murf WebSocket")
            
            # Send voice configuration
            voice_config = {
                "voice_config": {
                    "voiceId": "en-US-amara",
                    "style": "Conversational",
                    "rate": 0,
                    "pitch": 0,
                    "variation": 1
                }
            }
            await self.murf_ws.send(json.dumps(voice_config))
            logger.info("Sent voice configuration to Murf")
            
            # Start listening for audio responses
            asyncio.create_task(self.listen_murf_responses())
            
        except Exception as e:
            logger.error(f"Error connecting to Murf WebSocket: {e}")
            self.murf_connected = False

    async def listen_murf_responses(self):
        """Listen for audio responses from Murf WebSocket"""
        try:
            while self.murf_connected and self.murf_ws:
                response = await self.murf_ws.recv()
                data = json.loads(response)
                logger.info(f"Received Murf response: {data}")
                
                if "audio" in data:
                    # Print base64 encoded audio to console as requested
                    logger.info(f"📢 BASE64 AUDIO: {data['audio']}")
                    print(f"BASE64 AUDIO: {data['audio']}")
                    
                    # Optionally send to client
                    await self.send_to_client({
                        "type": "audio_chunk",
                        "audio": data["audio"],
                        "final": data.get("final", False)
                    })
                
                if data.get("final"):
                    logger.info("Murf audio generation completed")
                    break
                    
        except Exception as e:
            logger.error(f"Error listening to Murf responses: {e}")

    async def send_text_to_murf(self, text, is_final=False):
        """Send text to Murf for TTS conversion"""
        if not self.murf_connected or not self.murf_ws:
            await self.connect_murf_websocket()
        
        if self.murf_connected and self.murf_ws:
            try:
                text_message = {
                    "text": text,
                    "context_id": self.context_id,
                    "end": is_final
                }
                await self.murf_ws.send(json.dumps(text_message))
                logger.info(f"Sent text to Murf: {text[:50]}{'...' if len(text) > 50 else ''}")
                
            except Exception as e:
                logger.error(f"Error sending text to Murf: {e}")
                self.murf_connected = False

    async def get_llm_response(self, prompt):
        logger.info(f"Sending to LLM: {prompt}")
        try:
            model = genai.GenerativeModel("gemini-pro")
            response_stream = model.generate_content(prompt, stream=True)
            
            full_response = ""
            for chunk in response_stream:
                if chunk.text:
                    full_response += chunk.text
                    logger.info(f"LLM Stream: {chunk.text}")
                    
                    # Send LLM chunk to Murf for TTS conversion
                    await self.send_text_to_murf(chunk.text, is_final=False)
                    
                    # Optionally send partial LLM response to client
                    asyncio.create_task(self.send_to_client({
                        "type": "llm_partial_response",
                        "text": chunk.text
                    }))
            
            # Send final marker to Murf to complete TTS
            await self.send_text_to_murf("", is_final=True)
            
            logger.info(f"LLM Full Response: {full_response}")
            asyncio.create_task(self.send_to_client({
                "type": "llm_full_response",
                "text": full_response
            }))

        except Exception as e:
            logger.error(f"Error getting LLM response: {e}")
            asyncio.create_task(self.send_to_client({
                "type": "error",
                "message": f"LLM Error: {e}"
            }))
            
    def on_terminated(self, client, event: TerminationEvent):
        logger.info(f"Session terminated: {event.audio_duration_seconds} seconds of audio processed")
        
    def on_error(self, client, error: StreamingError):
        logger.error(f"Error occurred: {error}")
        
    async def send_to_client(self, message):
        try:
            await self.websocket.send(json.dumps(message))
        except Exception as e:
            logger.error(f"Error sending to client: {e}")
            
    async def start_transcription(self):
        try:
            self.client = StreamingClient(
                StreamingClientOptions(
                    api_key=api_key,
                    api_host="streaming.assemblyai.com",
                )
            )
            
            self.client.on(StreamingEvents.Begin, self.on_begin)
            self.client.on(StreamingEvents.Turn, self.on_turn)
            self.client.on(StreamingEvents.Termination, self.on_terminated)
            self.client.on(StreamingEvents.Error, self.on_error)
            
            self.client.connect(
                StreamingParameters(
                    sample_rate=16000,
                    format_turns=True,
                    end_of_turn_confidence_threshold=0.7,  # Adjust sensitivity
                    min_end_of_turn_silence_when_confident=160,  # 160ms minimum silence
                    max_turn_silence=2400,  # 2.4s maximum silence before forcing end of turn
                )
            )
            
            logger.info("AssemblyAI streaming client connected")
            return True
            
        except Exception as e:
            logger.error(f"Error starting transcription: {e}")
            return False
            
    async def send_audio(self, audio_data):
        if self.client and self.client.is_connected:
            try:
                self.client.send(audio_data)
            except Exception as e:
                logger.error(f"Error sending audio: {e}")
                
    def disconnect(self):
        if self.client:
            try:
                self.client.disconnect(terminate=True)
                logger.info("AssemblyAI client disconnected")
            except Exception as e:
                logger.error(f"Error disconnecting AssemblyAI: {e}")
        
        # Disconnect Murf WebSocket
        if self.murf_ws and self.murf_connected:
            try:
                asyncio.create_task(self.murf_ws.close())
                self.murf_connected = False
                logger.info("Murf WebSocket disconnected")
            except Exception as e:
                logger.error(f"Error disconnecting Murf WebSocket: {e}")

async def handle_client(websocket, path=None):
    logger.info("New client connected")
    transcriber = AudioTranscriber(websocket)
    
    try:
        # Start AssemblyAI transcription
        if not await transcriber.start_transcription():
            await websocket.send(json.dumps({"type": "error", "message": "Failed to start transcription"}))
            return
            
        await websocket.send(json.dumps({"type": "status", "message": "Connected and ready for audio"}))
        
        async for message in websocket:
            try:
                if isinstance(message, bytes):
                    # Audio data received
                    await transcriber.send_audio(message)
                else:
                    # Text message received
                    data = json.loads(message)
                    if data.get("type") == "start":
                        logger.info("Client requested to start recording")
                    elif data.get("type") == "stop":
                        logger.info("Client requested to stop recording")
                        
            except json.JSONDecodeError:
                logger.error("Invalid JSON received from client")
            except Exception as e:
                logger.error(f"Error processing message: {e}")
                
    except websockets.exceptions.ConnectionClosedOK:
        logger.info("Client disconnected normally")
    except websockets.exceptions.ConnectionClosedError as e:
        logger.error(f"Client disconnected with error: {e}")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
    finally:
        transcriber.disconnect()
        logger.info("Client connection closed")

async def main():
    logger.info("Starting WebSocket server on ws://localhost:8000")
    
    # Start the WebSocket server
    async with websockets.serve(handle_client, "0.0.0.0", 8000):
        logger.info("WebSocket server is running on ws://localhost:8000")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())


