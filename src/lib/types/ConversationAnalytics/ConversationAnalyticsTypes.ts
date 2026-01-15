/**
 * Types for Deepgram Conversation Analytics API.
 * Types are simplified for demonstration; in a production SDK, they should match the OpenAPI spec
 */

export interface ConversationRequestUrl {
  url: string;
  diarize?: boolean;
  language?: string;
  callback?: string;
  [key: string]: unknown;
}

export interface ConversationRequestFile {
  diarize?: boolean;
  language?: string;
  callback?: string;
  [key: string]: unknown;
}

export interface ConversationCallbackRequest {
  url?: string;
  diarize?: boolean;
  language?: string;
  callback: string;
  [key: string]: unknown;
}

// For POST/GET response
export interface ConversationResponse {
  request_id: string;
  conversation_id: string;
  status: string;
  analysis: {
    // Example:
    summary: string;
    participants: Array<{name: string; metrics: unknown;}>;
    topics: string[];
    // ... more as per spec
  };
}

// For /stream endpoint (simplified; real structure may be event-stream style)
export interface LiveConversationRequest {
  diarize?: boolean;
  language?: string;
  [key: string]: unknown;
}

export interface StreamingConversationResponse {
  type: string;
  data: any; // Use stricter typing per OpenAPI if available
}
