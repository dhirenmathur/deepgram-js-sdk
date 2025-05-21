/*
 * ConversationAnalyticsSchema.ts
 * Schema for Deepgram Real-time Conversation Analytics API request parameters
 */

export interface ConversationRequestUrl {
  url: string;
}

export interface ConversationRequestFile {
  file: Blob | Buffer | ArrayBuffer | Uint8Array;
}

export interface ConversationAnalyticsSchema {
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
  encoding?:
    | 'linear16'
    | 'flac'
    | 'mulaw'
    | 'amr-nb'
    | 'amr-wb'
    | 'opus'
    | 'speex'
    | 'g729';
  sample_rate?: 8000 | 16000 | 24000 | 32000 | 44100 | 48000;
  channels?: number;
  language?:
    | 'en'
    | 'en-US'
    | 'en-AU'
    | 'en-GB'
    | 'en-NZ'
    | 'en-IN'
    | 'fr'
    | 'fr-CA'
    | 'de'
    | 'es'
    | 'es-419'
    | 'ja'
    | 'ko'
    | 'zh'
    | 'zh-CN'
    | 'zh-TW'
    | 'pt'
    | 'pt-BR'
    | 'it'
    | 'nl'
    | 'ru';
}
