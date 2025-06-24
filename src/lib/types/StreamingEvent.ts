export interface StreamingEvent {
  event_type: string;
  timestamp: number;
  speaker_id?: number;
  data?: any;
}
