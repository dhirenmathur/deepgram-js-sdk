/**
 * Enumeration of events related to live conversation analytics.
 *
 * - `Open`: Built-in socket event for when the connection is opened.
 * - `Close`: Built-in socket event for when the connection is closed.
 * - `Error`: Built-in socket event for when an error occurs.
 * - `SpeakerChange`: Event for when a speaker change is detected.
 * - `ActionItem`: Event for when an action item is identified.
 * - `Question`: Event for when a question is detected.
 * - `Interruption`: Event for when a speaker interruption occurs.
 * - `SentimentChange`: Event for when a significant sentiment change is detected.
 * - `KeyPhrase`: Event for when a key phrase is identified.
 * - `Silence`: Event for when a significant silence period is detected.
 * - `MetricsUpdate`: Event for real-time conversation metrics updates.
 */
export enum ConversationAnalyticsEvents {
  /**
   * Built-in socket events.
   */
  Open = "open",
  Close = "close",
  Error = "error",

  /**
   * Conversation analytics-specific events.
   */
  SpeakerChange = "SpeakerChange",
  ActionItem = "ActionItem", 
  Question = "Question",
  Interruption = "Interruption",
  SentimentChange = "SentimentChange",
  KeyPhrase = "KeyPhrase",
  Silence = "Silence",
  MetricsUpdate = "MetricsUpdate",
}