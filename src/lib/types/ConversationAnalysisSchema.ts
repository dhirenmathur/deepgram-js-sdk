/**
 * Configuration schema for conversation analysis requests.
 * Extends the base Record<string, unknown> to allow for additional custom parameters.
 */
export interface ConversationAnalysisSchema extends Record<string, unknown> {
  /**
   * Enable speaker detection and diarization.
   * When enabled, the system will identify different speakers in the conversation.
   */
  detect_speakers?: boolean;

  /**
   * Minimum number of speakers to detect (used with detect_speakers: true).
   * Must be less than or equal to max_speakers if both are specified.
   */
  min_speakers?: number;

  /**
   * Maximum number of speakers to detect (used with detect_speakers: true).
   * Must be greater than or equal to min_speakers if both are specified.
   */
  max_speakers?: number;

  /**
   * Enable detection of interruptions between speakers.
   * Identifies when one speaker interrupts another during conversation.
   */
  detect_interruptions?: boolean;

  /**
   * Enable extraction of action items from the conversation.
   * Identifies tasks, follow-ups, and actionable items discussed.
   */
  extract_action_items?: boolean;

  /**
   * Enable measurement of engagement metrics throughout the conversation.
   * Analyzes participation levels, response patterns, and engagement indicators.
   */
  measure_engagement?: boolean;

  /**
   * Enable sentiment analysis for the conversation.
   * Analyzes emotional tone and sentiment progression throughout the discussion.
   */
  detect_sentiment?: boolean;

  /**
   * Generate a summary of the conversation.
   * Provides key points, outcomes, and important discussion items.
   */
  conversation_summary?: boolean;

  /**
   * Custom labels for speakers if known in advance.
   * Array of strings to label detected speakers (e.g., ["Alice", "Bob", "Charlie"]).
   */
  speaker_labels?: string[];

  /**
   * Include transcription text along with analytics.
   * When disabled, only analytics metrics are returned without transcript text.
   */
  include_transcription?: boolean;

  /**
   * Enable detection of questions in the conversation.
   * Identifies when speakers ask questions and analyzes question patterns.
   */
  detect_questions?: boolean;

  /**
   * Enable detection and extraction of key phrases.
   * Identifies important terms, topics, and recurring themes in the conversation.
   */
  detect_key_phrases?: boolean;

  /**
   * Silence threshold in seconds for detecting meaningful pauses.
   * Pauses longer than this threshold are considered significant silences.
   */
  silence_threshold?: number;

  /**
   * Interval in seconds for real-time metrics updates (streaming only).
   * Controls how frequently metrics are pushed during live analysis.
   */
  realtime_metrics_interval?: number;

  /**
   * Language code for the conversation (e.g., "en", "es", "fr").
   * Used to optimize analysis algorithms for the specific language.
   */
  language?: string;

  /**
   * Callback URL for asynchronous processing results.
   * When provided, analysis results will be sent to this URL upon completion.
   */
  callback?: string;

  /**
   * HTTP method to use for callback delivery.
   * Either "POST" or "PUT" for delivering results to the callback URL.
   */
  callback_method?: "POST" | "PUT";

  // Audio encoding options for streaming analysis
  /**
   * Audio encoding format for streaming analysis.
   * Supported formats include linear16, flac, mulaw, opus, etc.
   */
  encoding?: "linear16" | "flac" | "mulaw" | "amr-nb" | "amr-wb" | "opus" | "speex" | "g729";

  /**
   * Audio sample rate in Hz for streaming analysis.
   * Common values: 8000, 16000, 24000, 32000, 44100, 48000.
   */
  sample_rate?: 8000 | 16000 | 24000 | 32000 | 44100 | 48000;

  /**
   * Number of audio channels for streaming analysis.
   * Typically 1 (mono) or 2 (stereo).
   */
  channels?: number;
}