#!/usr/bin/env python3
"""
WebSocket Client Test Script
This script demonstrates connecting to the WebSocket endpoint and sending messages
"""

import asyncio
import websockets
import json

async def test_websocket():
    uri = "ws://localhost:8000/ws"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to WebSocket server at", uri)
            
            # Test messages
            test_messages = [
                "Hello from Python client!",
                "Testing WebSocket echo functionality",
                "Day 15 - WebSocket implementation complete!",
                "Final test message"
            ]
            
            for message in test_messages:
                print(f"\nSending: {message}")
                await websocket.send(message)
                
                response = await websocket.recv()
                print(f"Received: {response}")
                
                # Small delay between messages
                await asyncio.sleep(1)
                
    except Exception as e:
        print(f"Error connecting to WebSocket: {e}")

if __name__ == "__main__":
    print("WebSocket Client Test")
    print("=" * 30)
    asyncio.run(test_websocket())

