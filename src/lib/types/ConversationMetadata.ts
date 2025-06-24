export interface ConversationMetadata {
  request_id: string;
  conversation_id: string;
  created: string; // ISO date-time
  duration: number;
  channels: number;
  num_speakers: number;
  language: string;
}
