document.addEventListener("DOMContentLoaded", () => {
    const personaSelect = document.getElementById("persona-select");
    const setPersonaBtn = document.getElementById("set-persona-btn");
    const greetBtn = document.getElementById("greet-btn");
    const userInput = document.getElementById("user-input");
    const sendMessageBtn = document.getElementById("send-message-btn");
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const outputMessages = document.getElementById("output-messages");
    const audioPlayer = document.getElementById("audio-player");

    // Function to display messages in the output area
    function displayMessage(message, type = "info") {
        const p = document.createElement("p");
        p.textContent = message;
        p.className = type; // Add class for styling (e.g., 'info', 'error')
        outputMessages.appendChild(p);
        outputMessages.scrollTop = outputMessages.scrollHeight; // Scroll to bottom
    }

    // Function to play audio
    function playAudio(audioUrl) {
        audioPlayer.src = audioUrl;
        audioPlayer.play();
    }

    // Set Persona
    setPersonaBtn.addEventListener("click", async () => {
        const selectedPersona = personaSelect.value;
        displayMessage(`Setting persona to: ${selectedPersona}...`);
        try {
            const response = await fetch("/api/set_persona", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ persona: selectedPersona }),
            });
            const data = await response.json();
            if (response.ok) {
                displayMessage(data.message, "success");
            } else {
                displayMessage(`Error: ${data.error}`, "error");
            }
        } catch (error) {
            displayMessage(`Network error: ${error.message}`, "error");
        }
    });

    // Generate Greeting
    greetBtn.addEventListener("click", async () => {
        displayMessage("Generating greeting...");
        try {
            const response = await fetch("/api/greet");
            const data = await response.json();
            if (response.ok) {
                displayMessage(data.message, "success");
                playAudio(data.audio_url);
            } else {
                displayMessage(`Error: ${data.error}`, "error");
            }
        } catch (error) {
            displayMessage(`Network error: ${error.message}`, "error");
        }
    });

    // Web Search
    searchBtn.addEventListener("click", async () => {
        const query = searchInput.value.trim();
        if (!query) {
            displayMessage("Please enter a search query.", "warning");
            return;
        }
        displayMessage(`🔍 Searching for: ${query}`);
        searchInput.value = ""; // Clear input

        try {
            const response = await fetch("/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: query }),
            });
            const data = await response.json();
            if (response.ok) {
                displayMessage(`Search Results: ${data.results}`, "success");
                playAudio(data.audio_url);
            } else {
                displayMessage(`Error: ${data.error}`, "error");
            }
        } catch (error) {
            displayMessage(`Network error: ${error.message}`, "error");
        }
    });

    // Send Message (Respond)
    sendMessageBtn.addEventListener("click", async () => {
        const message = userInput.value.trim();
        if (!message) {
            displayMessage("Please enter a message.", "warning");
            return;
        }
        displayMessage(`You: ${message}`);
        userInput.value = ""; // Clear input

        try {
            const response = await fetch("/api/respond", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message }),
            });
            const data = await response.json();
            if (response.ok) {
                displayMessage(data.message, "success");
                playAudio(data.audio_url);
            } else {
                displayMessage(`Error: ${data.error}`, "error");
            }
        } catch (error) {
            displayMessage(`Network error: ${error.message}`, "error");
        }
    });

    // Allow sending message with Enter key
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessageBtn.click();
        }
    });

    // Allow searching with Enter key
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });
});


