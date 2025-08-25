
from gtts import gTTS
import os

def speak(text, persona="", filename="output.mp3"):
    if persona:
        text = f"{persona}: {text}"
    tts = gTTS(text=text, lang=\'en\')
    tts.save(filename)
    print(f"Generated speech saved to {filename}")

if __name__ == "__main__":
    # Example usage with a pirate persona
    speak("Ahoy, matey! Welcome aboard.", persona="A pirate says")
    speak("I am a robot, here to assist you.", persona="A robot says")
    speak("Howdy partner, what can I do for ya?", persona="A cowboy says")


