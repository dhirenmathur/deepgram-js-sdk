/**
 * Base interface for all streaming analytics events
 */
export interface StreamingConversationResponse {
  event?: AnalyticsEvent;
  conversation_id: string;
  timestamp: number; // seconds from start
}

/**
 * Analytics event wrapper
 */
export interface AnalyticsEvent {
  event_type: AnalyticsEventType;
  event_id: string;
  timestamp: number;
  data: AnalyticsEventData;
}

/**
 * Types of analytics events that can be received
 */
export type AnalyticsEventType =
  | 'speaker_change'
  | 'action_item'
  | 'question'
  | 'interruption'
  | 'sentiment_change'
  | 'key_phrase'
  | 'silence'
  | 'metrics_update';

/**
 * Union type for all possible event data types
 */
export type AnalyticsEventData =
  | SpeakerChangeEventData
  | ActionItemEventData
  | QuestionEventData
  | InterruptionEventData
  | SentimentChangeEventData
  | KeyPhraseEventData
  | SilenceEventData
  | MetricsUpdateEventData;

/**
 * Speaker change event data
 */
export interface SpeakerChangeEventData {
  previous_speaker_id?: number;
  current_speaker_id: number;
  confidence: number;
  duration_previous_speaker?: number; // seconds
}

/**
 * Action item detection event data
 */
export interface ActionItemEventData {
  item_id: string;
  text: string;
  speaker_id: number;
  confidence: number;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

/**
 * Question detection event data
 */
export interface QuestionEventData {
  question_id: string;
  text: string;
  speaker_id: number;
  confidence: number;
  question_type?: 'open' | 'closed' | 'leading' | 'rhetorical';
}

/**
 * Interruption detection event data
 */
export interface InterruptionEventData {
  interrupter_id: number;
  interrupted_id: number;
  severity: 'mild' | 'moderate' | 'severe';
  duration: number; // seconds
  context_before: string;
  context_after: string;
}

/**
 * Sentiment change event data
 */
export interface SentimentChangeEventData {
  speaker_id: number;
  from_sentiment: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    polarity: number;
  };
  to_sentiment: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    polarity: number;
  };
  trigger_phrase?: string;
  significance: 'minor' | 'moderate' | 'major';
}

/**
 * Key phrase detection event data
 */
export interface KeyPhraseEventData {
  phrase: string;
  speaker_id: number;
  importance_score: number;
  frequency: number;
  context: string;
  category?: string;
}

/**
 * Silence detection event data
 */
export interface SilenceEventData {
  duration: number; // seconds
  context: 'natural_pause' | 'awkward_silence' | 'thinking_pause' | 'technical_issue';
  speakers_before_silence: number[];
  confidence: number;
}

/**
 * Metrics update event data
 */
export interface MetricsUpdateEventData {
  interval_start: number; // seconds from conversation start
  interval_end: number; // seconds from conversation start
  speakers: StreamingSpeakerMetrics[];
  conversation_metrics: StreamingConversationMetrics;
}

/**
 * Real-time speaker metrics
 */
export interface StreamingSpeakerMetrics {
  speaker_id: number;
  speaking_time_interval: number; // seconds in this interval
  speaking_time_total: number; // total seconds since start
  word_count_interval: number;
  word_count_total: number;
  current_sentiment: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  interruptions_made_interval: number;
  interruptions_made_total: number;
  engagement_score: number; // 0-1
}

/**
 * Real-time conversation-level metrics
 */
export interface StreamingConversationMetrics {
  total_speaking_time: number; // seconds
  total_silence_time: number; // seconds
  turn_count: number;
  interruption_count: number;
  average_sentiment: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  engagement_level: 'low' | 'medium' | 'high';
  conversation_balance: number; // 0-1, how balanced the participation is
}

/**
 * Configuration options for live analytics sessions
 */
export interface AnalyticsLiveConfigOptions {
  /**
   * Enable/disable specific analytics features during the session
   */
  features?: {
    detect_speakers?: boolean;
    detect_interruptions?: boolean;
    extract_action_items?: boolean;
    measure_engagement?: boolean;
    detect_sentiment?: boolean;
    detect_questions?: boolean;
    detect_key_phrases?: boolean;
  };
  
  /**
   * Update the metrics reporting interval
   */
  realtime_metrics_interval?: number; // seconds
  
  /**
   * Update silence detection threshold
   */
  silence_threshold?: number; // seconds
  
  /**
   * Update speaker configuration
   */
  speaker_config?: {
    min_speakers?: number;
    max_speakers?: number;
    speaker_labels?: string[];
  };
}