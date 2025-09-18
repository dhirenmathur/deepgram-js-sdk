// All type definitions below should map 1:1 to the OpenAPI schema for Conversation Analytics endpoints.
// For brevity, examples are shown; full schema should copy OpenAPI docs.

export interface ConversationRequestUrl {
  url: string;
  // ... other fields as required (language, callback, etc.)
  language?: string;
  callback?: string;
}

export interface ConversationRequestFile {
  // empty, since file comes as Buffer/Stream (params separate)
}

export interface ConversationAnalyticsParams {
  [key: string]: any;
  // Fully type all standard parameters as per the spec:
  detect_speakers?: boolean;
  min_speakers?: number;
  max_speakers?: number;
  diarize?: boolean;
  // ... additional advanced fields
}

export interface ConversationResponse {
  conversation_id: string;
  status: string; // e.g., 'completed', 'running', ...
  model: string;
  results: any; // Should be typed to nested results structure if possible.
  error?: string;
  // ... additional response props
}

export interface StreamingConversationResponse {
  // Event shape received from WebSocket as per OpenAPI/Deepgram docs.
  event: string;
  data: any; // Strongly type if OpenAPI provides full event shape.
  error?: string;
}
