#!/usr/bin/env python3
"""
Interactive Demo for AI Voice Agent with Persona System
Day 24: Agent Persona Implementation
"""

from advanced_voice_agent import VoiceAgent
import os

def clear_screen():
    os.system('clear' if os.name == 'posix' else 'cls')

def display_menu():
    print("\n🎭 AI Voice Agent - Interactive Demo")
    print("=" * 50)
    print("1. 🏴‍☠️ Switch to Pirate (Captain Blackbeard)")
    print("2. 🤠 Switch to Cowboy (Sheriff Jake)")
    print("3. 🤖 Switch to Robot (ARIA-7)")
    print("4. 🧙‍♂️ Switch to Wizard (Merlin the Wise)")
    print("5. 🕵️ Switch to Detective (Inspector Holmes)")
    print("6. 💬 Chat with current persona")
    print("7. 👋 Generate greeting")
    print("8. 📋 Show current persona info")
    print("9. 📜 Show conversation history")
    print("0. 🚪 Exit")
    print("=" * 50)

def main():
    agent = VoiceAgent()
    
    while True:
        display_menu()
        current_persona = agent.get_persona_info()
        print(f"Current Persona: {current_persona['name']} ({agent.current_persona})")
        
        choice = input("\nEnter your choice (0-9): ").strip()
        
        if choice == '0':
            print("\n👋 Goodbye! Thanks for using the AI Voice Agent!")
            break
        elif choice == '1':
            agent.set_persona('pirate')
            print("🏴‍☠️ Switched to Pirate persona!")
        elif choice == '2':
            agent.set_persona('cowboy')
            print("🤠 Switched to Cowboy persona!")
        elif choice == '3':
            agent.set_persona('robot')
            print("🤖 Switched to Robot persona!")
        elif choice == '4':
            agent.set_persona('wizard')
            print("🧙‍♂️ Switched to Wizard persona!")
        elif choice == '5':
            agent.set_persona('detective')
            print("🕵️ Switched to Detective persona!")
        elif choice == '6':
            user_input = input("💬 Enter your message: ")
            if user_input.strip():
                print("🎤 Generating response...")
                filename = agent.respond(user_input)
                if filename:
                    print(f"✅ Response saved to: {filename}")
        elif choice == '7':
            print("🎤 Generating greeting...")
            filename = agent.greet()
            if filename:
                print(f"✅ Greeting saved to: {filename}")
        elif choice == '8':
            persona = agent.get_persona_info()
            print(f"\n🎭 Current Persona: {persona['name']}")
            print(f"Personality: {persona['personality']}")
            print(f"Voice Style: {persona['voice_style']}")
            print(f"Greeting: {persona['greeting']}")
        elif choice == '9':
            if agent.conversation_history:
                print("\n📜 Conversation History:")
                print("-" * 30)
                for i, entry in enumerate(agent.conversation_history[-5:], 1):  # Show last 5
                    print(f"{i}. [{entry['persona']}] {entry['styled_text']}")
                    print(f"   File: {entry['filename']}")
                    print()
            else:
                print("📜 No conversation history yet.")
        else:
            print("❌ Invalid choice. Please try again.")
        
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()

