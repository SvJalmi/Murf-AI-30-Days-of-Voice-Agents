
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

# Set your AssemblyAI API key
api_key = "a056f31f3b6547f2acb004ba65e4ab4d"

class AudioTranscriber:
    def __init__(self, websocket):
        self.websocket = websocket
        self.client = None
        
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
        else:
            # Send partial transcription for real-time feedback (optional)
            asyncio.create_task(self.send_to_client({
                "type": "partial_transcript",
                "turn_order": event.turn_order,
                "transcript": event.transcript,
                "end_of_turn_confidence": event.end_of_turn_confidence
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
        if self.client:
            try:
                self.client.send_audio(audio_data)
            except Exception as e:
                logger.error(f"Error sending audio: {e}")
                
    def disconnect(self):
        if self.client:
            try:
                self.client.disconnect(terminate=True)
                logger.info("AssemblyAI client disconnected")
            except Exception as e:
                logger.error(f"Error disconnecting: {e}")

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


