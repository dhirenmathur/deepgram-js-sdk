export interface ConversationResponse {
  metadata: ConversationMetadata;
  results: ConversationResults;
}

export interface ConversationMetadata {
  request_id: string;
  conversation_id: string;
  created: string;
  duration: number;
  channels: number;
  models: string[];
  model_info: {
    name: string;
    version: string;
    arch: string;
  };
}

export interface ConversationResults {
  speakers: SpeakerAnalysis[];
  dynamics: ConversationDynamics;
  action_items?: ActionItem[];
  summary?: ConversationSummary;
  transcription?: ConversationTranscription;
  sentiment?: ConversationSentiment;
  questions?: Question[];
  key_phrases?: KeyPhrase[];
}

export interface SpeakerAnalysis {
  speaker_id: number;
  speaker_name?: string;
  talk_time: number;
  talk_time_percentage: number;
  interruptions: number;
  questions_asked: number;
  sentiment_analysis: {
    overall_sentiment: "positive" | "negative" | "neutral";
    sentiment_score: number;
    emotion_detection?: {
      primary_emotion: string;
      confidence: number;
    };
  };
  speaking_pace: {
    words_per_minute: number;
    pace_variation: number;
  };
  engagement_level: number;
}

export interface ConversationDynamics {
  total_talk_time: number;
  turn_taking_analysis: {
    total_turns: number;
    average_turn_duration: number;
    interruption_rate: number;
    overlap_percentage: number;
  };
  engagement_score: number;
  conversation_balance: number;
  silence_analysis: {
    total_silence_time: number;
    longest_silence: number;
    silence_count: number;
  };
}

export interface ActionItem {
  id: string;
  text: string;
  confidence: number;
  timestamp: number;
  speaker_id: number;
  category?: string;
  priority?: "high" | "medium" | "low";
  due_date?: string;
}

export interface ConversationSummary {
  short_summary: string;
  key_points: string[];
  topics_discussed: string[];
  outcomes: string[];
  next_steps: string[];
}

export interface ConversationTranscription {
  segments: TranscriptionSegment[];
  word_count: number;
  confidence: number;
}

export interface TranscriptionSegment {
  text: string;
  start: number;
  end: number;
  speaker_id: number;
  confidence: number;
  words: TranscriptionWord[];
}

export interface TranscriptionWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word: string;
}

export interface ConversationSentiment {
  overall_sentiment: "positive" | "negative" | "neutral";
  sentiment_segments: SentimentSegment[];
  emotion_timeline: EmotionPoint[];
}

export interface SentimentSegment {
  start: number;
  end: number;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  speaker_id: number;
}

export interface EmotionPoint {
  timestamp: number;
  speaker_id: number;
  emotion: string;
  intensity: number;
}

export interface Question {
  id: string;
  text: string;
  timestamp: number;
  speaker_id: number;
  question_type: string;
  confidence: number;
}

export interface KeyPhrase {
  phrase: string;
  frequency: number;
  relevance_score: number;
  timestamps: number[];
  speakers: number[];
}