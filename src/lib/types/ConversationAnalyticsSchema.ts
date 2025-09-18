/**
 * Options for conversation analytics analysis
 */
interface ConversationAnalyticsSchema extends Record<string, unknown> {
  /**
   * @see https://developers.deepgram.com/docs/callback
   */
  callback?: string;

  /**
   * @see https://developers.deepgram.com/docs/callback#results
   */
  callback_method?: "put" | "post";

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
  include_transcription?: boolean;
  detect_questions?: boolean;
  detect_key_phrases?: boolean;

  // Audio processing options
  silence_threshold?: number;
  encoding?: string;
  sample_rate?: number;
  channels?: number;
  language?: string;

  // Streaming-specific options
  realtime_metrics_interval?: number;

  /**
   * @see https://developers.deepgram.com/docs/extra-metadata
   */
  extra?: string[] | string;
}

/**
 * Options for conversation analytics streaming
 */
interface ConversationAnalyticsStreamOptions extends ConversationAnalyticsSchema {
  // Additional streaming-specific options can be added here
}

/**
 * Configuration options for live conversation analytics adjustments
 */
interface ConversationAnalyticsLiveConfigOptions {
  detect_speakers?: boolean;
  detect_interruptions?: boolean;
  extract_action_items?: boolean;
  measure_engagement?: boolean;
  detect_sentiment?: boolean;
  detect_questions?: boolean;
  detect_key_phrases?: boolean;
  silence_threshold?: number;
  realtime_metrics_interval?: number;
}

export type {
  ConversationAnalyticsSchema,
  ConversationAnalyticsStreamOptions,
  ConversationAnalyticsLiveConfigOptions
};