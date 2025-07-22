// Types for Conversation Analytics API requests

export interface ConversationRequestUrl {
  url: string; // URI to audio file
}

export type ConversationRequestFile = Blob | ArrayBuffer | Buffer; // Binary audio

export interface ConversationRequestStream {
  // For streaming, just binary audio chunks (handled as Blob/Buffer)
}

// Query parameters for /analyze/conversation endpoints
export interface ConversationAnalyticsQueryParams {
  callback?: string;
  callback_method?: 'POST' | 'PUT';
  detect_speakers?: boolean;
  min_speakers?: number;
  max_speakers?: number;
  detect_interruptions?: boolean;
  extract_action_items?: boolean;
  measure_engagement?: boolean;
  detect_sentiment?: boolean;
  conversation_summary?: boolean;
  speaker_labels?: string[];
  include_transcription?: boolean;
  customer_speaker_id?: number;
  agent_speaker_id?: number;
  detect_questions?: boolean;
  detect_key_phrases?: boolean;
  silence_threshold?: number;
  realtime_metrics_interval?: number;
  encoding?: string;
  sample_rate?: number;
  channels?: number;
  language?: string;
}
