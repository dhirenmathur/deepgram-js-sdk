/**
 * Individual streaming event for real-time conversation analysis
 */
interface StreamingEvent {
  /** Type of the streaming event */
  event_type: 'speaker_change' | 'action_item' | 'question' | 'interruption' | 'sentiment_change' | 'key_phrase' | 'silence' | 'metrics_update';
  
  /** Timestamp when the event occurred (in seconds) */
  timestamp: number;
  
  /** Speaker ID associated with the event (if applicable) */
  speaker_id?: number;
  
  /** Event-specific data */
  data: any;
}

/**
 * Complete streaming response for real-time conversation analysis
 */
interface StreamingConversationResponse {
  /** Unique identifier for the conversation */
  conversation_id: string;
  
  /** The streaming event data */
  event: StreamingEvent;
}

/**
 * Real-time metrics update event data
 */
interface MetricsUpdateEvent {
  /** Current speaker statistics */
  speakers: Array<{
    speaker_id: number;
    current_talk_time: number;
    current_sentiment: "positive" | "negative" | "neutral";
    engagement_score: number;
  }>;
  
  /** Overall conversation metrics */
  conversation: {
    elapsed_time: number;
    speaker_changes: number;
    current_pace: "fast" | "medium" | "slow";
  };
}

export type { StreamingEvent, StreamingConversationResponse, MetricsUpdateEvent };