/**
 * Schema for conversation analysis configuration options.
 * Maps to the OpenAPI specification for the Conversation Analytics API.
 */
interface ConversationAnalyzeSchema extends Record<string, unknown> {
  // Callback configuration
  callback?: string;
  callback_method?: "POST" | "PUT";

  // Speaker analysis options
  detect_speakers?: boolean;
  min_speakers?: number;
  max_speakers?: number;
  speaker_labels?: string[];
  customer_speaker_id?: number;
  agent_speaker_id?: number;

  // Analysis features
  detect_interruptions?: boolean;
  extract_action_items?: boolean;
  measure_engagement?: boolean;
  detect_sentiment?: boolean;
  conversation_summary?: boolean;
  detect_questions?: boolean;
  detect_key_phrases?: boolean;

  // Audio configuration  
  include_transcription?: boolean;
  encoding?: string;
  sample_rate?: number;
  channels?: number;
  language?: string;

  // Real-time analysis options
  silence_threshold?: number;
  realtime_metrics_interval?: number;
}

export type { ConversationAnalyzeSchema };