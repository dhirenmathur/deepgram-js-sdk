import { Readable } from "stream";

/**
 * Options for conversation analysis requests
 */
interface ConversationAnalysisSchema extends Record<string, unknown> {
  /**
   * @see https://developers.deepgram.com/docs/callback
   */
  callback?: string;

  /**
   * HTTP method to use for callback requests
   * @see https://developers.deepgram.com/docs/callback#results
   */
  callback_method?: "POST" | "PUT";

  /**
   * Enable speaker detection (diarization)
   */
  detect_speakers?: boolean;

  /**
   * Minimum number of speakers expected
   */
  min_speakers?: number;

  /**
   * Maximum number of speakers expected
   */
  max_speakers?: number;

  /**
   * Enable interruption detection
   */
  detect_interruptions?: boolean;

  /**
   * Extract action items from conversation
   */
  extract_action_items?: boolean;

  /**
   * Measure engagement levels
   */
  measure_engagement?: boolean;

  /**
   * Detect sentiment changes
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
   * Include full transcription in results
   */
  include_transcription?: boolean;

  /**
   * Speaker ID for customer role
   */
  customer_speaker_id?: number;

  /**
   * Speaker ID for agent role
   */
  agent_speaker_id?: number;

  /**
   * Detect questions in conversation
   */
  detect_questions?: boolean;

  /**
   * Extract key phrases
   */
  detect_key_phrases?: boolean;

  /**
   * Silence threshold in seconds
   */
  silence_threshold?: number;

  /**
   * Interval for real-time metrics updates (seconds)
   */
  realtime_metrics_interval?: number;

  /**
   * Language for analysis
   */
  language?: string;
}

/**
 * Options for streaming conversation analysis
 */
interface ConversationStreamSchema extends ConversationAnalysisSchema {
  /**
   * Audio encoding format
   */
  encoding?: "linear16" | "flac" | "mulaw" | "amr-nb" | "amr-wb" | "opus" | "speex" | "g729";

  /**
   * Audio sample rate
   */
  sample_rate?: 8000 | 16000 | 24000 | 32000 | 44100 | 48000;

  /**
   * Number of audio channels
   */
  channels?: number;
}

/**
 * Source types for conversation analysis
 */
interface ConversationUrlSource {
  url: string;
}

type ConversationFileSource = Buffer | Readable | File | Blob;

export type {
  ConversationAnalysisSchema,
  ConversationStreamSchema,
  ConversationUrlSource,
  ConversationFileSource,
};