import { StreamingEvent } from "./StreamingEvent";

export interface StreamingConversationResponse {
  conversation_id: string;
  event: StreamingEvent;
}
