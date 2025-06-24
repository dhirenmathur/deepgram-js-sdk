// Deepgram Conversation Analytics REST Client
import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace = "conversation-analytics";

  /**
   * Analyze a conversation (recorded or ongoing)
   * @param data - ConversationRequestUrl or ConversationRequestFile
   * @param options - Optional query parameters
   */
  async analyzeConversation(
    data: ConversationRequestUrl | ConversationRequestFile,
    options: Record<string, any> = {}
  ): Promise<ConversationResponse> {
    const endpoint = "/v1/analyze/conversation";
    let body: any;
    let headers: Record<string, string> = {};

    if (typeof data === "object" && "url" in data) {
      // JSON body
      body = JSON.stringify(data);
      headers["Content-Type"] = "application/json";
    } else {
      // Binary audio
      body = data;
      headers["Content-Type"] = "application/octet-stream";
    }

    const url = this.getRequestUrl(endpoint, {}, options);
    const response = await this.post(url, body, { headers });
    return response.json();
  }

  /**
   * Stream real-time conversation analysis
   * @param audioChunk - Audio chunk (binary)
   * @param options - Optional query parameters
   */
  async streamConversationAnalysis(
    audioChunk: ConversationRequestFile,
    options: Record<string, any> = {}
  ): Promise<StreamingConversationResponse> {
    const endpoint = "/v1/analyze/conversation/stream";
    const url = this.getRequestUrl(endpoint, {}, options);
    const headers = { "Content-Type": "application/octet-stream" };
    const response = await this.post(url, audioChunk, { headers });
    return response.json();
  }

  /**
   * Retrieve analysis for a specific conversation
   * @param conversation_id - Conversation UUID
   * @param options - Optional query parameters
   */
  async getConversationAnalysis(
    conversation_id: string,
    options: Record<string, any> = {}
  ): Promise<ConversationResponse> {
    const endpoint = `/v1/analyze/conversation/${conversation_id}`;
    const url = this.getRequestUrl(endpoint, {}, options);
    const response = await this.get(url);
    return response.json();
  }
}
