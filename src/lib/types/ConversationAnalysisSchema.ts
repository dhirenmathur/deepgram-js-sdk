/**
 * Options for conversation analysis API requests
 */
interface ConversationAnalysisSchema extends Record<string, unknown> {
  /**
   * Callback URL to receive analysis results for async requests
   * @see https://developers.deepgram.com/docs/callback
   */
  callback?: string;

  /**
   * HTTP method for callback requests (POST or PUT)
   * @see https://developers.deepgram.com/docs/callback#results
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
   * Detect speaker interruptions
   */
  detect_interruptions?: boolean;

  /**
   * Extract action items from the conversation
   */
  extract_action_items?: boolean;

  /**
   * Measure speaker engagement metrics
   */
  measure_engagement?: boolean;

  /**
   * Detect sentiment changes throughout the conversation
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
   * Include transcription in the analysis results
   */
  include_transcription?: boolean;

  /**
   * Speaker ID for customer in customer service scenarios
   */
  customer_speaker_id?: number;

  /**
   * Speaker ID for agent in customer service scenarios
   */
  agent_speaker_id?: number;

  /**
   * Detect questions in the conversation
   */
  detect_questions?: boolean;

  /**
   * Extract key phrases from the conversation
   */
  detect_key_phrases?: boolean;

  /**
   * Silence threshold in milliseconds
   */
  silence_threshold?: number;

  /**
   * Interval for real-time metrics updates in milliseconds
   */
  realtime_metrics_interval?: number;

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
   * Language code for the conversation
   */
  language?: string;

  /**
   * Extra metadata to include in the response
   * @see https://developers.deepgram.com/docs/extra-metadata
   */
  extra?: string[] | string;
}

export type { ConversationAnalysisSchema };