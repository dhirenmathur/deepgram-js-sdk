// ConversationAnalytics.ts

// Request Types
export interface ConversationRequestUrl {
  url: string; // format: uri
}

export type ConversationRequestFile = ArrayBuffer | Blob | Buffer | Uint8Array; // binary

// Metadata
export interface ConversationMetadata {
  request_id: string;
  conversation_id: string;
  created: string; // date-time
  duration: number;
  channels: number;
  num_speakers: number;
  language: string;
  models?: string[];
  model_info?: Record<string, ModelInfo>;
}

export interface ModelInfo {
  name: string;
  version: string;
}

// Speaker Analysis
export interface SpeakerAnalysis {
  speaker_id: number;
  speaker_label?: string;
  talk_time: number;
  talk_percentage: number;
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

// Action Item
export interface ActionItem {
  text: string;
  assigned_to: number[];
  assigned_by: number;
  confidence: number;
  timestamp: number;
  due_date?: string; // date
}

// Conversation Dynamics
export interface ConversationDynamics {
  turn_taking?: {
    total_turns: number;
    average_turn_duration: number;
    turn_distribution: Record<string, number>;
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
    words_per_minute: Record<string, number>;
    overall_words_per_minute: number;
  };
}

// Conversation Results
export interface ConversationResults {
  speakers: SpeakerAnalysis[];
  dynamics: ConversationDynamics;
  action_items?: ActionItem[];
  summary?: {
    text: string;
    key_moments?: Array<{
      timestamp: number;
      type: string;
      text: string;
      speakers: number[];
    }>;
  };
  transcription?: {
    full_transcript: string;
    by_speaker: Record<string, Array<{
      text: string;
      start_time: number;
      end_time: number;
    }>>;
  };
}

// Full API Response
export interface ConversationResponse {
  metadata: ConversationMetadata;
  results: ConversationResults;
}

// Streaming Event
export interface StreamingEvent {
  event_type: string;
  timestamp: number;
  speaker_id?: number;
  data?: Record<string, any>;
}

export interface StreamingConversationResponse {
  conversation_id: string;
  event: StreamingEvent;
}
