/**
 * Options for conversation analysis requests
 * @see https://developers.deepgram.com/docs/conversation-analytics
 */
interface ConversationAnalyticsSchema extends Record<string, unknown> {
  // Callback options
  callback?: string;
  callback_method?: "POST" | "PUT";
  
  // Speaker detection
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
  include_transcription?: boolean;
  detect_questions?: boolean;
  detect_key_phrases?: boolean;
  
  // Audio processing
  encoding?: "linear16" | "flac" | "mulaw" | "amr-nb" | "amr-wb" | "opus" | "speex" | "g729";
  sample_rate?: 8000 | 16000 | 24000 | 32000 | 44100 | 48000;
  channels?: number;
  language?: string;
  
  // Thresholds and intervals
  silence_threshold?: number;
  realtime_metrics_interval?: number;
}

/**
 * Options for conversation streaming analysis
 * Extends base schema with streaming-specific options
 */
interface ConversationStreamingSchema extends ConversationAnalyticsSchema {
  // Inherits all base options
}

export type { ConversationAnalyticsSchema, ConversationStreamingSchema };