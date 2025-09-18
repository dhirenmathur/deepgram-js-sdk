/**
 * Schema for Conversation Analytics API requests.
 * Defines all available parameters for configuring conversation analysis.
 * 
 * @example
 * ```typescript
 * const options: ConversationAnalyticsSchema = {
 *   detect_speakers: true,
 *   min_speakers: 2,
 *   max_speakers: 4,
 *   detect_interruptions: true,
 *   extract_action_items: true,
 *   measure_engagement: true,
 *   detect_sentiment: true,
 *   conversation_summary: true,
 *   detect_questions: true,
 *   detect_key_phrases: true,
 *   include_transcription: true,
 *   sample_rate: 16000,
 *   encoding: "linear16",
 *   language: "en-US"
 * };
 * ```
 */
export interface ConversationAnalyticsSchema extends Record<string, unknown> {
  /** URL for callback notifications */
  callback?: string;

  /** HTTP method for callback (POST or PUT) */
  callback_method?: "POST" | "PUT";

  /** Automatically identify and separate different speakers */
  detect_speakers?: boolean;

  /** Minimum number of speakers expected in the conversation */
  min_speakers?: number;

  /** Maximum number of speakers expected in the conversation */
  max_speakers?: number;

  /** Identify when speakers interrupt each other */
  detect_interruptions?: boolean;

  /** Extract action items and tasks from conversation */
  extract_action_items?: boolean;

  /** Calculate engagement metrics for participants */
  measure_engagement?: boolean;

  /** Analyze sentiment of speakers throughout conversation */
  detect_sentiment?: boolean;

  /** Generate conversation summary */
  conversation_summary?: boolean;

  /** Custom labels for identified speakers */
  speaker_labels?: string[];

  /** Include full transcription in results */
  include_transcription?: boolean;

  /** Specify customer speaker ID for customer service scenarios */
  customer_speaker_id?: number;

  /** Specify agent speaker ID for customer service scenarios */
  agent_speaker_id?: number;

  /** Detect questions in conversation */
  detect_questions?: boolean;

  /** Extract key phrases and topics */
  detect_key_phrases?: boolean;

  /** Minimum silence duration threshold in milliseconds */
  silence_threshold?: number;

  /** Interval for real-time metrics updates in milliseconds */
  realtime_metrics_interval?: number;

  /** Audio encoding format */
  encoding?: "linear16" | "flac" | "mulaw" | "amr-nb" | "amr-wb" | "opus" | "speex" | "g729";

  /** Audio sample rate in Hz */
  sample_rate?: 8000 | 16000 | 24000 | 32000 | 44100 | 48000;

  /** Number of audio channels */
  channels?: number;

  /** Language code for analysis (e.g., "en-US", "es-ES") */
  language?: string;
}