/**
 * Options for conversation analytics
 */
interface ConversationSchema extends Record<string, unknown> {
  /**
   * @see https://developers.deepgram.com/docs/callback
   */
  callback?: string;

  /**
   * @see https://developers.deepgram.com/docs/callback#results
   */
  callback_method?: "put" | "post";

  /**
   * Automatically identify and separate different speakers in the conversation
   */
  detect_speakers?: boolean;

  /**
   * Minimum number of speakers expected in the conversation
   */
  min_speakers?: number;

  /**
   * Maximum number of speakers expected in the conversation
   */
  max_speakers?: number;

  /**
   * Identify when speakers interrupt each other
   */
  detect_interruptions?: boolean;

  /**
   * Identify and extract action items, tasks, or follow-ups mentioned in the conversation
   */
  extract_action_items?: boolean;

  /**
   * Calculate engagement metrics such as participation balance, response times, and interaction levels
   */
  measure_engagement?: boolean;

  /**
   * Analyze the sentiment of each speaker's contributions
   */
  detect_sentiment?: boolean;

  /**
   * Generate a summary of the conversation content
   */
  conversation_summary?: boolean;

  /**
   * Custom labels for identified speakers
   */
  speaker_labels?: string[];

  /**
   * Include full transcription along with the analysis
   */
  include_transcription?: boolean;

  /**
   * Specify which speaker ID corresponds to the customer (useful for call center analytics)
   */
  customer_speaker_id?: number;

  /**
   * Specify which speaker ID corresponds to the agent (useful for call center analytics)
   */
  agent_speaker_id?: number;

  /**
   * Identify questions asked by each participant
   */
  detect_questions?: boolean;

  /**
   * Extract important or recurring phrases from the conversation
   */
  detect_key_phrases?: boolean;

  /**
   * Minimum duration in seconds to consider as silence
   */
  silence_threshold?: number;

  /**
   * Interval in seconds for receiving metrics updates in streaming mode
   */
  realtime_metrics_interval?: number;

  /**
   * The [BCP-47 language tag](https://tools.ietf.org/html/bcp47) that hints at the primary spoken language
   */
  language?: string;

  /**
   * @see https://developers.deepgram.com/docs/extra-metadata
   */
  extra?: string[] | string;
}

export type { ConversationSchema };