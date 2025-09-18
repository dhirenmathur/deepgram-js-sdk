/**
 * Enumeration of events related to real-time conversation analytics.
 *
 * - `Open`: Built-in socket event for when the connection is opened.
 * - `Close`: Built-in socket event for when the connection is closed.
 * - `Error`: Built-in socket event for when an error occurs.
 * - `SpeakerChange`: Event for when a speaker change is detected.
 * - `ActionItem`: Event for when an action item is identified.
 * - `Question`: Event for when a question is detected.
 * - `Interruption`: Event for when an interruption occurs.
 * - `SentimentChange`: Event for when sentiment changes are detected.
 * - `KeyPhrase`: Event for when key phrases are identified.
 * - `Silence`: Event for when silence periods are detected.
 * - `MetricsUpdate`: Event for periodic metrics updates.
 * - `Unhandled`: Catch-all event for any other message event.
 */
export enum ConversationEvents {
  /**
   * Built-in socket events.
   */
  Open = "open",
  Close = "close",
  Error = "error",

  /**
   * Conversation-specific events.
   */
  SpeakerChange = "speaker_change",
  ActionItem = "action_item",
  Question = "question",
  Interruption = "interruption",
  SentimentChange = "sentiment_change",
  KeyPhrase = "key_phrase",
  Silence = "silence",
  MetricsUpdate = "metrics_update",

  /**
   * Catch-all for any other message event.
   */
  Unhandled = "unhandled",
}