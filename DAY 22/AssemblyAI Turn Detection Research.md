# AssemblyAI Turn Detection Research

## Key Findings from Documentation

### Turn Object Structure
- `turn_order`: Integer that increments with each new turn
- `turn_is_formatted`: Boolean indicating if text is formatted (when format_turns=true)
- `end_of_turn`: Boolean indicating if this is the end of the current turn
- `transcript`: String containing only finalized words
- `end_of_turn_confidence`: Float (0-1) representing confidence that turn has finished
- `words`: List of Word objects with individual metadata

### Turn Detection Behavior
1. Universal-Streaming provides immutable transcriptions (no overwriting)
2. When end of turn is detected, `end_of_turn` becomes `true`
3. If formatting is enabled, you get both unformatted and formatted versions
4. Each word has `word_is_final` field to indicate completion confidence

### Implementation Requirements for Day 18
1. Use the existing TurnEvent handler in AssemblyAI Python SDK
2. Send WebSocket message to client when `end_of_turn` is true
3. Display transcription only at the end of each turn
4. Update UI to show turn-based transcription clearly

### Key Parameters
- `format_turns`: Enable to get formatted text with punctuation
- `end_of_turn_confidence_threshold`: Adjust sensitivity (default 0.7)
- `min_end_of_turn_silence_when_confident`: Minimum silence duration (default 160ms)
- `max_turn_silence`: Maximum silence before forcing end of turn (default 2400ms)

