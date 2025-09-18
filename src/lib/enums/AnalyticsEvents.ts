/**
 * Enumeration of events related to real-time conversation analytics.
 *
 * - `Open`: Built-in socket event for when the connection is opened.
 * - `Close`: Built-in socket event for when the connection is closed.
 * - `Error`: Built-in socket event for when an error occurs.
 * - `SpeakerChange`: Event for when the active speaker changes.
 * - `ActionItem`: Event for when an action item is detected.
 * - `Question`: Event for when a question is detected.
 * - `Interruption`: Event for when a speaker interruption occurs.
 * - `SentimentChange`: Event for when sentiment analysis detects a change.
 * - `KeyPhrase`: Event for when a key phrase is identified.
 * - `Silence`: Event for when a significant silence period is detected.
 * - `MetricsUpdate`: Event for periodic metrics updates.
 * - `Unhandled`: Catch-all event for any other message event.
 */
export enum AnalyticsEvents {
  /**
   * Built in socket events.
   */
  Open = "open",
  Close = "close",
  Error = "error",

  /**
   * Real-time analytics events
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