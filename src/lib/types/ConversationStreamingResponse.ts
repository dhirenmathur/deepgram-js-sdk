/**
 * Real-time event data structure for streaming conversation analytics.
 */
export interface StreamingEvent {
  /** Type of the streaming event */
  event_type: 
    | "speaker_change"
    | "action_item" 
    | "question"
    | "interruption"
    | "sentiment_change"
    | "key_phrase"
    | "silence"
    | "metrics_update";
  
  /** Timestamp when the event occurred (seconds from start of conversation) */
  timestamp: number;
  
  /** Speaker ID associated with the event (optional) */
  speaker_id?: number;
  
  /** Event-specific data payload */
  data: StreamingEventData;
}

/**
 * Union type for all possible streaming event data payloads.
 */
export type StreamingEventData = 
  | SpeakerChangeData
  | ActionItemData
  | QuestionData
  | InterruptionData
  | SentimentChangeData
  | KeyPhraseData
  | SilenceData
  | MetricsUpdateData;

/** Speaker change event data */
export interface SpeakerChangeData {
  previous_speaker?: number;
  new_speaker: number;
  confidence: number;
}

/** Action item detection event data */
export interface ActionItemData {
  text: string;
  confidence: number;
  assigned_to?: number;
}

/** Question detection event data */
export interface QuestionData {
  text: string;
  question_type: "open" | "closed" | "rhetorical";
  confidence: number;
}

/** Interruption event data */
export interface InterruptionData {
  interrupting_speaker: number;
  interrupted_speaker: number;
  confidence: number;
}

/** Sentiment change event data */
export interface SentimentChangeData {
  previous_sentiment: string;
  new_sentiment: string;
  confidence: number;
  sentiment_score: number;
}

/** Key phrase detection event data */
export interface KeyPhraseData {
  phrase: string;
  relevance_score: number;
  frequency: number;
}

/** Silence period event data */
export interface SilenceData {
  duration: number;
  start_time: number;
  end_time: number;
}

/** Real-time metrics update event data */
export interface MetricsUpdateData {
  current_speaker?: number;
  speaking_time_by_speaker: Record<number, number>;
  total_duration: number;
  engagement_score: number;
  interruption_count: number;
}

/**
 * Complete streaming response structure for real-time conversation analytics.
 */
export interface ConversationStreamingResponse {
  /** Unique identifier for the conversation */
  conversation_id: string;
  
  /** The streaming event data */
  event: StreamingEvent;
}