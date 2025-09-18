/**
 * Options for conversation analytics requests
 */
export interface ConversationAnalyticsSchema extends Record<string, unknown> {
  // Speaker Detection & Analysis
  detect_speakers?: boolean;
  min_speakers?: number;
  max_speakers?: number;
  speaker_labels?: string[];
  customer_speaker_id?: number;
  agent_speaker_id?: number;
  
  // Analysis Features  
  detect_interruptions?: boolean;
  extract_action_items?: boolean;
  measure_engagement?: boolean;
  detect_sentiment?: boolean;
  conversation_summary?: boolean;
  detect_questions?: boolean;
  detect_key_phrases?: boolean;
  
  // Audio Configuration
  encoding?: string;
  sample_rate?: number;
  channels?: number;
  language?: string;
  
  // Streaming Configuration
  silence_threshold?: number;
  realtime_metrics_interval?: number;
  
  // Callback Configuration
  callback?: string;
  callback_method?: "POST" | "PUT";
  
  // Transcription
  include_transcription?: boolean;

  /**
   * @see https://developers.deepgram.com/docs/extra-metadata
   */
  extra?: string[] | string;
}