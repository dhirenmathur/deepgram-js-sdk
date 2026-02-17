// VS OpenAPI 'ConversationResponse', includes metadata and analytics results
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
  interruptions?: { initiated: number; received: number };
  questions?: { asked: number; answered: number };
  sentiment?: {
    average: string;
    score: number;
    progression: Array<{ time: number; sentiment: string; score: number }>;
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

export interface ConversationResults {
  speakers: SpeakerAnalysis[];
  dynamics: any; // further detail per OpenAPI
  action_items?: ActionItem[];
  summary?: {
    text: string;
    key_moments?: Array<{
      timestamp: number;
      type: string;
      text: string;
      speakers?: number[];
    }>;
  };
  transcription?: {
    full_transcript: string;
    by_speaker?: Record<string, Array<{ text: string; start_time?: number; end_time?: number }>>;
  };
}

export interface ConversationResponse {
  metadata: ConversationMetadata;
  results: ConversationResults;
}
