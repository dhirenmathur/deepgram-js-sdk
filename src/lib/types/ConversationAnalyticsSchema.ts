/**
 * Schemas for Deepgram Conversation Analytics API requests.
 */

export interface ConversationRequestUrl {
  url: string;
}

export type ConversationRequestFile = ArrayBuffer | Buffer | Blob; // for binary audio

export interface ConversationAnalyticsOptions {
  callback?: string;
  callback_method?: "POST" | "PUT";
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
