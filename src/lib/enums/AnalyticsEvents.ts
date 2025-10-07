/**
 * Enumeration of events related to conversation analytics WebSocket connections.
 *
 * - `Open`: Built-in socket event for when the connection is opened.
 * - `Close`: Built-in socket event for when the connection is closed.
 * - `Error`: Built-in socket event for when an error occurs.
 * - `SpeakerChange`: Event for when a speaker transition is detected.
 * - `ActionItem`: Event for when an action item is identified.
 * - `Question`: Event for when a question is detected.
 * - `Interruption`: Event for when a speaker interruption occurs.
 * - `SentimentChange`: Event for when a sentiment shift is detected.
 * - `KeyPhrase`: Event for when a key phrase is identified.
 * - `Silence`: Event for when a silence period is detected.
 * - `MetricsUpdate`: Event for periodic metrics updates.
 * - `Unhandled`: Catch-all event for any other message event.
 */
enum AnalyticsEvents {
  /**
   * Built-in socket events.
   */
  Open = "Open",
  Close = "Close",
  Error = "Error",

  /**
   * Analytics-specific events.
   */
  SpeakerChange = "SpeakerChange",
  ActionItem = "ActionItem",
  Question = "Question",
  Interruption = "Interruption",
  SentimentChange = "SentimentChange",
  KeyPhrase = "KeyPhrase",
  Silence = "Silence",
  MetricsUpdate = "MetricsUpdate",

  /**
   * Catch all for any other message event
   */
  Unhandled = "Unhandled",
}

export { AnalyticsEvents };