export interface StreamingConversationResponse {
  conversation_id: string;
  event: StreamingEvent;
}

interface StreamingEvent {
  event_type: 'speaker_change' | 'action_item' | 'question' | 'interruption' | 'sentiment_change' | 'key_phrase' | 'silence' | 'metrics_update';
  timestamp: number;
  speaker_id?: number;
  data?: Record<string, any>;
}