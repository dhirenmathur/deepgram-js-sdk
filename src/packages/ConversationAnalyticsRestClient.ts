// ConversationAnalyticsRestClient for Deepgram Real-time Conversation Analytics API
import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationResponse,
  StreamingConversationResponse
} from "../lib/types/ConversationAnalyticsSchema";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversation-analytics";

  /**
   * Analyze an ongoing or recorded conversation (sync or async)
   * @param body - ConversationRequestUrl or ConversationRequestFile
   * @param options - Query parameters for analysis
   * @returns ConversationResponse
   */
  async analyzeConversation(
    body: ConversationRequestUrl | ConversationRequestFile,
    options?: Record<string, any>
  ): Promise<ConversationResponse> {
    const endpoint = "/v1/analyze/conversation";
    const isJson = typeof body === "object" && !(body instanceof ArrayBuffer || body instanceof Buffer || body instanceof Blob);
    const url = this.getRequestUrl(endpoint, {}, options);
    const headers = isJson ? { "Content-Type": "application/json" } : { "Content-Type": "audio/*" };
    const payload = isJson ? JSON.stringify(body) : (body as ArrayBuffer | Buffer | Blob);
    const response = await this.post(url, payload, { headers });
    return response.json();
  }

  /**
   * Analyze a conversation in real-time streaming mode
   * @param audioChunk - Audio chunk (binary)
   * @param options - Query parameters for streaming analysis
   * @returns StreamingConversationResponse
   */
  async streamConversationAnalysis(
    audioChunk: ArrayBuffer | Buffer | Blob,
    options?: Record<string, any>
  ): Promise<StreamingConversationResponse> {
    const endpoint = "/v1/analyze/conversation/stream";
    const url = this.getRequestUrl(endpoint, {}, options);
    const headers = { "Content-Type": "audio/*" };
    const response = await this.post(url, audioChunk, { headers });
    return response.json();
  }

  /**
   * Retrieve analysis for a specific conversation
   * @param conversation_id - UUID of the conversation
   * @returns ConversationResponse
   */
  async getConversationAnalysis(
    conversation_id: string
  ): Promise<ConversationResponse> {
    const endpoint = `/v1/analyze/conversation/${conversation_id}`;
    const url = this.getRequestUrl(endpoint);
    const response = await this.get(url);
    return response.json();
  }
}

export { ConversationAnalyticsRestClient as ConversationAnalyticsClient };
