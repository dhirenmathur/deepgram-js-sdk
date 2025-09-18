/**
 * Options for conversation analytics requests
 */
interface ConversationSchema extends Record<string, unknown> {
  /**
   * URL to send callback results to
   */
  callback?: string;

  /**
   * HTTP method for callback
   */
  callback_method?: "POST" | "PUT";

  /**
   * Enable speaker detection and diarization
   */
  detect_speakers?: boolean;

  /**
   * Minimum number of speakers to detect
   */
  min_speakers?: number;

  /**
   * Maximum number of speakers to detect
   */
  max_speakers?: number;

  /**
   * Enable interruption detection
   */
  detect_interruptions?: boolean;

  /**
   * Extract action items from the conversation
   */
  extract_action_items?: boolean;

  /**
   * Measure engagement metrics
   */
  measure_engagement?: boolean;

  /**
   * Enable sentiment analysis
   */
  detect_sentiment?: boolean;

  /**
   * Generate conversation summary
   */
  conversation_summary?: boolean;

  /**
   * Custom labels for speakers
   */
  speaker_labels?: string[];

  /**
   * Include transcription in the response
   */
  include_transcription?: boolean;

  /**
   * Speaker ID representing the customer
   */
  customer_speaker_id?: number;

  /**
   * Speaker ID representing the agent
   */
  agent_speaker_id?: number;

  /**
   * Enable question detection
   */
  detect_questions?: boolean;

  /**
   * Enable key phrase extraction
   */
  detect_key_phrases?: boolean;

  /**
   * Silence threshold in seconds
   */
  silence_threshold?: number;

  /**
   * Interval for real-time metrics updates (streaming only)
   */
  realtime_metrics_interval?: number;

  // Audio format options
  /**
   * Audio encoding format
   */
  encoding?: string;

  /**
   * Audio sample rate
   */
  sample_rate?: number;

  /**
   * Number of audio channels
   */
  channels?: number;

  /**
   * Language of the conversation
   */
  language?: string;
}

export type { ConversationSchema };