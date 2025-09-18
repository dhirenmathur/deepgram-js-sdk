/**
 * Enumeration of events related to conversation analytics streaming.
 *
 * - `Open`: Built-in socket event for when the connection is opened.
 * - `Close`: Built-in socket event for when the connection is closed.
 * - `Error`: Built-in socket event for when an error occurs.
 * - `SpeakerChange`: Event for when speaker changes are detected.
 * - `ActionItem`: Event for when action items are identified.
 * - `Question`: Event for when questions are detected.
 * - `Interruption`: Event for when interruptions occur.
 * - `SentimentChange`: Event for when sentiment changes.
 * - `KeyPhrase`: Event for when key phrases are extracted.
 * - `Silence`: Event for when silence periods are detected.
 * - `MetricsUpdate`: Event for periodic metrics updates.
 * - `Unhandled`: Catch-all event for any other message event.
 */
export enum ConversationAnalyticsEvents {
  /**
   * Built in socket events.
   */
  Open = "open",
  Close = "close",
  Error = "error",

  /**
   * Conversation analytics specific events
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
   * Catch all for any other message event
   */
  Unhandled = "unhandled",
}