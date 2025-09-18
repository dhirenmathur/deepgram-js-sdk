export interface ConversationStreamingEvent {
  type: string;
  conversation_id: string;
  timestamp: number;
}

export interface SpeakerChangeEvent extends ConversationStreamingEvent {
  type: "SpeakerChange";
  previous_speaker: number;
  current_speaker: number;
  confidence: number;
}

export interface ActionItemEvent extends ConversationStreamingEvent {
  type: "ActionItem";
  action_item: {
    id: string;
    text: string;
    speaker_id: number;
    confidence: number;
    category?: string;
    priority?: "high" | "medium" | "low";
  };
}

export interface InterruptionEvent extends ConversationStreamingEvent {
  type: "Interruption";
  interrupting_speaker: number;
  interrupted_speaker: number;
  duration: number;
  overlap_percentage: number;
}

export interface SentimentChangeEvent extends ConversationStreamingEvent {
  type: "SentimentChange";
  speaker_id: number;
  previous_sentiment: "positive" | "negative" | "neutral";
  current_sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  emotion?: string;
}

export interface QuestionEvent extends ConversationStreamingEvent {
  type: "Question";
  speaker_id: number;
  question_text: string;
  question_type: string;
  confidence: number;
}

export interface KeyPhraseEvent extends ConversationStreamingEvent {
  type: "KeyPhrase";
  phrase: string;
  speaker_id: number;
  relevance_score: number;
  frequency: number;
}

export interface EngagementUpdateEvent extends ConversationStreamingEvent {
  type: "EngagementUpdate";
  speaker_id: number;
  engagement_level: number;
  change_from_baseline: number;
}

export interface MetricsUpdateEvent extends ConversationStreamingEvent {
  type: "MetricsUpdate";
  metrics: {
    total_speakers: number;
    active_speaker: number;
    talk_time_distribution: { [speaker_id: string]: number };
    interruption_count: number;
    questions_asked: number;
    action_items_identified: number;
    overall_engagement: number;
    conversation_balance: number;
  };
}

export interface ConversationCompleteEvent extends ConversationStreamingEvent {
  type: "ConversationComplete";
  final_summary: {
    total_duration: number;
    speaker_count: number;
    action_items_count: number;
    key_insights: string[];
  };
}