/**
 * Enumeration of events related to live conversation analysis.
 * 
 * Includes both WebSocket lifecycle events and conversation-specific analysis events.
 */
export enum ConversationEvents {
  // Built-in socket events
  Open = "open",
  Close = "close", 
  Error = "error",

  // Conversation analysis events
  SpeakerChange = "speaker_change",
  ActionItem = "action_item",
  Question = "question", 
  Interruption = "interruption",
  SentimentChange = "sentiment_change",
  KeyPhrase = "key_phrase",
  Silence = "silence",
  MetricsUpdate = "metrics_update",

  // Catch-all for unhandled events
  Unhandled = "unhandled",
}