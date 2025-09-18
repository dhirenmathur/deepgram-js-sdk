/**
 * Options schema for conversation analytics requests
 */
export interface ConversationAnalyticsSchema extends Record<string, unknown> {
  // Speaker Detection
  /**
   * Enable speaker detection and analysis
   * @default false
   */
  detect_speakers?: boolean;

  /**
   * Minimum number of speakers to detect (1-10)
   * @default 2
   */
  min_speakers?: number;

  /**
   * Maximum number of speakers to detect (1-20)
   * @default 6
   */
  max_speakers?: number;

  /**
   * Custom labels for detected speakers
   */
  speaker_labels?: string[];

  /**
   * ID of the customer speaker (0-based index)
   */
  customer_speaker_id?: number;

  /**
   * ID of the agent speaker (0-based index)
   */
  agent_speaker_id?: number;

  // Analysis Features
  /**
   * Detect interruptions in the conversation
   * @default false
   */
  detect_interruptions?: boolean;

  /**
   * Extract action items from the conversation
   * @default false
   */
  extract_action_items?: boolean;

  /**
   * Measure engagement levels throughout the conversation
   * @default false
   */
  measure_engagement?: boolean;

  /**
   * Detect sentiment changes in the conversation
   * @default false
   */
  detect_sentiment?: boolean;

  /**
   * Generate a summary of the conversation
   * @default false
   */
  conversation_summary?: boolean;

  /**
   * Detect questions in the conversation
   * @default false
   */
  detect_questions?: boolean;

  /**
   * Extract key phrases from the conversation
   * @default false
   */
  detect_key_phrases?: boolean;

  // Transcription Options
  /**
   * Include transcription in the analysis results
   * @default true
   */
  include_transcription?: boolean;

  /**
   * Language code for transcription (e.g., 'en-US', 'es', 'fr')
   * @default 'en-US'
   */
  language?: string;

  // Silence Analysis
  /**
   * Threshold for silence detection in seconds (0.1-5.0)
   * @default 1.0
   */
  silence_threshold?: number;

  // Streaming Options
  /**
   * Interval for real-time metrics updates in seconds (1.0-60.0)
   * @default 5.0
   */
  realtime_metrics_interval?: number;

  // Audio Options (primarily for streaming)
  /**
   * Audio encoding format
   */
  encoding?: 'linear16' | 'flac' | 'mulaw' | 'amr-nb' | 'amr-wb' | 'opus' | 'speex' | 'g729';

  /**
   * Audio sample rate in Hz
   */
  sample_rate?: 8000 | 16000 | 24000 | 32000 | 44100 | 48000;

  /**
   * Number of audio channels (1-8)
   * @default 1
   */
  channels?: number;

  // Callback Options
  /**
   * Callback URL for asynchronous processing results
   */
  callback?: string;

  /**
   * HTTP method for callback requests
   * @default 'POST'
   */
  callback_method?: 'POST' | 'PUT';
}