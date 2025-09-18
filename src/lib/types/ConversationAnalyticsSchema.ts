/**
 * Options for conversation analysis
 */
export interface ConversationAnalysisSchema extends Record<string, unknown> {
  /**
   * Callback URL for async analysis results
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
   * Detect interruptions between speakers
   */
  detect_interruptions?: boolean;

  /**
   * Extract action items from conversation
   */
  extract_action_items?: boolean;

  /**
   * Measure participant engagement levels
   */
  measure_engagement?: boolean;

  /**
   * Perform sentiment analysis
   */
  detect_sentiment?: boolean;

  /**
   * Generate conversation summary
   */
  conversation_summary?: boolean;

  /**
   * Custom speaker labels
   */
  speaker_labels?: string[];

  /**
   * Include transcription in results
   */
  include_transcription?: boolean;

  /**
   * ID of customer speaker (for agent/customer scenarios)
   */
  customer_speaker_id?: number;

  /**
   * ID of agent speaker (for agent/customer scenarios)
   */
  agent_speaker_id?: number;

  /**
   * Detect questions in conversation
   */
  detect_questions?: boolean;

  /**
   * Extract key phrases
   */
  detect_key_phrases?: boolean;

  /**
   * Silence threshold in milliseconds
   */
  silence_threshold?: number;

  /**
   * Interval for real-time metrics updates (live only)
   */
  realtime_metrics_interval?: number;

  /**
   * Language code for analysis
   */
  language?: string;

  /**
   * Audio encoding format (live only)
   */
  encoding?: string;

  /**
   * Sample rate in Hz (live only)
   */
  sample_rate?: number;

  /**
   * Number of audio channels (live only)
   */
  channels?: number;
}