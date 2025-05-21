// Types for Deepgram Real-time Conversation Analytics API

export interface ConversationRequestUrl {
  url: string;
}

export type ConversationRequestFile = Blob | ArrayBuffer | Buffer | Uint8Array;

export interface ConversationMetadata {
  request_id: string;
  conversation_id: string;
  created: string;
  duration: number;
  channels: number;
  num_speakers: number;
  language: string;
  models?: string[];
  model_info?: Record<string, { name: string; version: string }>;
}

export interface SpeakerAnalysis {
  speaker_id: number;
  speaker_label?: string;
  talk_time?: number;
  talk_percentage?: number;
  interruptions?: {
    initiated?: number;
    received?: number;
  };
  questions?: {
    asked?: number;
    answered?: number;
  };
  sentiment?: {
    average?: string;
    score?: number;
    progression?: Array<{
      time: number;
      sentiment: string;
      score: number;
    }>;
  };
  longest_monologue?: number;
  average_response_time?: number;
  key_phrases?: Array<{
    phrase: string;
    count: number;
    timestamps: number[];
  }>;
}

export interface ActionItem {
  text: string;
  assigned_to?: number[];
  assigned_by?: number;
  confidence?: number;
  timestamp?: number;
  due_date?: string;
}

export interface ConversationDynamics {
  turn_taking?: {
    total_turns?: number;
    average_turn_duration?: number;
    turn_distribution?: Record<string, number>;
  };
  engagement_score?: number;
  participation_balance?: number;
  silence_analysis?: {
    total_silence?: number;
    silence_percentage?: number;
    longest_silence?: number;
    average_silence_duration?: number;
  };
  overlap_time?: number;
  overlap_percentage?: number;
  pace?: {
    words_per_minute?: Record<string, number>;
    overall_words_per_minute?: number;
  };
}

export interface ConversationResults {
  speakers: SpeakerAnalysis[];
  dynamics: ConversationDynamics;
  action_items?: ActionItem[];
  summary?: {
    text?: string;
    key_moments?: Array<{
      timestamp: number;
      type: "decision" | "action_item" | "disagreement" | "question" | "important_topic";
      text: string;
      speakers: number[];
    }>;
  };
  transcription?: {
    full_transcript?: string;
    by_speaker?: Record<string, Array<{ text: string; start_time: number; end_time: number }>>;
  };
}

export interface ConversationResponse {
  metadata: ConversationMetadata;
  results: ConversationResults;
}

export interface StreamingEvent {
  event_type:
    | "speaker_change"
    | "action_item"
    | "question"
    | "interruption"
    | "sentiment_change"
    | "key_phrase"
    | "silence"
    | "metrics_update";
  timestamp: number;
  speaker_id?: number;
  data?: Record<string, any>;
}

export interface StreamingConversationResponse {
  conversation_id: string;
  event: StreamingEvent;
}
