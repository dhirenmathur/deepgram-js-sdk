export interface SyncConversationResponse {
  metadata: ConversationMetadata;
  results: ConversationResults;
}

interface ConversationMetadata {
  request_id: string;
  conversation_id: string;
  created: string;
  duration: number;
  channels: number;
  num_speakers: number;
  language: string;
  models?: string[];
  model_info?: {
    [key: string]: {
      name: string;
      version: string;
    };
  };
}

interface SpeakerAnalysis {
  speaker_id: number;
  speaker_label?: string;
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

interface ActionItem {
  text: string;
  assigned_to?: number[];
  assigned_by?: number;
  confidence: number;
  timestamp: number;
  due_date?: string;
}

interface ConversationDynamics {
  turn_taking?: {
    total_turns: number;
    average_turn_duration: number;
    turn_distribution: {
      [key: string]: number;
    };
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
    words_per_minute: {
      [key: string]: number;
    };
    overall_words_per_minute: number;
  };
}

interface ConversationResults {
  speakers: SpeakerAnalysis[];
  dynamics: ConversationDynamics;
  action_items?: ActionItem[];
  summary?: {
    text: string;
    key_moments?: Array<{
      timestamp: number;
      type: 'decision' | 'action_item' | 'disagreement' | 'question' | 'important_topic';
      text: string;
      speakers: number[];
    }>;
  };
  transcription?: {
    full_transcript?: string;
    by_speaker?: {
      [key: string]: Array<{
        text: string;
        start_time: number;
        end_time: number;
      }>;
    };
  };
}