/**
 * Enumeration of events related to conversation analytics WebSocket connections.
 */
export enum ConversationAnalyticsEvents {
  // Connection events
  Open = "Open",
  Close = "Close", 
  Error = "Error",
  
  // Analytics events
  Metadata = "Metadata",
  SpeakerChange = "SpeakerChange",
  ActionItem = "ActionItem", 
  Interruption = "Interruption",
  SentimentChange = "SentimentChange",
  Question = "Question",
  KeyPhrase = "KeyPhrase",
  EngagementUpdate = "EngagementUpdate",
  MetricsUpdate = "MetricsUpdate",
  ConversationComplete = "ConversationComplete",
  
  // Generic events
  Unhandled = "Unhandled",
}