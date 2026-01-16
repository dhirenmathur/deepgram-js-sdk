export interface ConversationMetadata {
  request_id: string;
  conversation_id: string;
  created: string;
  duration: number;
  channels: number;
  num_speakers: number;
  language: string;
  models: string[];
  model_info: Record<string, { name: string; version: string }>;
}

export interface ConversationDynamics {
  total_talk_time: number;
  silence_percentage: number;
  interruption_rate: number;
  average_response_time: number;
  conversation_pace: "slow" | "moderate" | "fast";
  energy_level: "low" | "medium" | "high";
  turn_taking_balance: number; // 0-1 scale where 0.5 is perfect balance
}

export interface ActionItem {
  id: string;
  text: string;
  speaker_id: number;
  confidence: number;
  timestamp: number;
  category: "task" | "follow_up" | "decision" | "deadline" | "general";
  priority: "low" | "medium" | "high";
}

export interface ConversationSummary {
  overview: string;
  key_points: string[];
  decisions_made: string[];
  next_steps: string[];
  sentiment_overview: string;
  word_count: number;
}

export interface ConversationTranscription {
  transcript: string;
  utterances: TranscriptionUtterance[];
}

export interface TranscriptionUtterance {
  id: string;
  speaker_id: number;
  text: string;
  start_time: number;
  end_time: number;
  confidence: number;
  words: TranscriptionWord[];
}

export interface TranscriptionWord {
  word: string;
  start_time: number;
  end_time: number;
  confidence: number;
  speaker_id: number;
}

export interface SpeakerAnalysis {
  speaker_id: number;
  speaker_label?: string;
  talk_time: number;
  talk_percentage: number;
  interruptions: {
    initiated: number;
    received: number;
  };
  questions: {
    asked: number;
    answered: number;
  };
  sentiment: {
    average: string;
    score: number;
    progression: Array<{
      time: number;
      sentiment: string;
      score: number;
    }>;
  };
  longest_monologue: number;
  average_response_time: number;
  key_phrases: Array<{
    phrase: string;
    count: number;
    timestamps: number[];
  }>;
  engagement_score: number; // 0-100 scale
  speech_rate: number; // words per minute
  silence_periods: Array<{
    start_time: number;
    end_time: number;
    duration: number;
  }>;
}

export interface ConversationAnalyticsResponse {
  metadata: ConversationMetadata;
  results: {
    speakers: SpeakerAnalysis[];
    dynamics: ConversationDynamics;
    action_items?: ActionItem[];
    summary?: ConversationSummary;
    transcription?: ConversationTranscription;
  };
}

// Live streaming event types
export interface SpeakerChangeEvent {
  type: "speaker_change";
  speaker_id: number;
  timestamp: number;
  previous_speaker_id?: number;
}

export interface ActionItemEvent {
  type: "action_item";
  action_item: ActionItem;
  timestamp: number;
}

export interface InterruptionEvent {
  type: "interruption";
  interrupting_speaker_id: number;
  interrupted_speaker_id: number;
  timestamp: number;
  duration: number;
}

export interface SentimentChangeEvent {
  type: "sentiment_change";
  speaker_id: number;
  sentiment: string;
  score: number;
  timestamp: number;
  previous_sentiment?: string;
}

export interface KeyPhraseEvent {
  type: "key_phrase";
  phrase: string;
  speaker_id: number;
  confidence: number;
  timestamp: number;
}

export interface SilenceEvent {
  type: "silence";
  duration: number;
  start_time: number;
  end_time: number;
}

export interface QuestionEvent {
  type: "question";
  question: string;
  speaker_id: number;
  timestamp: number;
  confidence: number;
}

export interface MetricsUpdateEvent {
  type: "metrics_update";
  timestamp: number;
  speakers: Pick<SpeakerAnalysis, 'speaker_id' | 'talk_time' | 'talk_percentage' | 'engagement_score'>[];
  dynamics: Pick<ConversationDynamics, 'interruption_rate' | 'conversation_pace' | 'energy_level'>;
}

export type AnalyticsLiveEvent = 
  | SpeakerChangeEvent 
  | ActionItemEvent 
  | InterruptionEvent 
  | SentimentChangeEvent 
  | KeyPhraseEvent 
  | SilenceEvent 
  | QuestionEvent 
  | MetricsUpdateEvent;