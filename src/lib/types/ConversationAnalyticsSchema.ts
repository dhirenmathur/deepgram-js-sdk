// src/lib/types/ConversationAnalyticsSchema.ts

// Request bodies
export interface ConversationRequestUrl {
  url: string;
}
export type ConversationRequestFile = any; // For binary data, may be Buffer/Blob/Stream depending on usage

// Parameters (query)
export interface ConversationAnalyticsQueryParams {
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

// Response core objects (truncated, structure mirrors OpenAPI - complete as needed)
export interface ConversationMetadata {
  request_id: string;
  conversation_id: string;
  created: string;
  duration: number;
  channels: number;
  num_speakers: number;
  language: string;
  // ... more fields as per spec
}

export interface SpeakerAnalysis {
  speaker_id: number;
  speaker_label: string;
  talk_time: number;
  talk_percentage: number;
  interruptions?: {
    initiated: number;
    received: number;
  };
  questions?: {
    asked: number;
    answered: number;
  };
  sentiment?: {
    average: string;
    score: number;
    progression?: Array<{ time: number; sentiment: string; score: number }>;
  };
  longest_monologue?: number;
  average_response_time?: number;
  key_phrases?: Array<{ phrase: string; count: number; timestamps: number[] }>;
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
    total_turns: number;
    average_turn_duration: number;
    turn_distribution: { [speaker_id: string]: number };
  };
  engagement_score?: number;
  participation_balance?: number;
  silence_analysis?: {
    total_silence: number;
    silence_percentage: number;
    longest_silence: number;
    average_silence_duration: number;
  };
  overlap_time?: number;
  overlap_percentage?: number;
  pace?: {
    words_per_minute: { [speaker_id: string]: number };
    overall_words_per_minute: number;
  };
}

export interface ConversationResults {
  speakers: SpeakerAnalysis[];
  dynamics: ConversationDynamics;
  action_items?: ActionItem[];
  summary?: {
    text: string;
    key_moments?: Array<{ timestamp: number; type: string; text: string; speakers?: number[] }>;
  };
  transcription?: {
    full_transcript?: string;
    by_speaker?: { [speaker_id: string]: Array<{ text: string; start_time: number; end_time: number }> };
  };
}

// Main Response
export interface ConversationResponse {
  metadata: ConversationMetadata;
  results: ConversationResults;
}

// Streaming
export interface StreamingEvent {
  event_type: string;
  timestamp: number;
  speaker_id?: number;
  data?: any;
}

export interface StreamingConversationResponse {
  conversation_id: string;
  event: StreamingEvent;
}
