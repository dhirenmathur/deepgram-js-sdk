import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types/ConversationAnalyticsSchema";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversation_analytics";

  /**
   * Analyze a conversation from a URL or file.
   * @param source - URL or file
   * @param options - Query parameters as key-value pairs
   * @returns ConversationResponse
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    options?: Record<string, any>
  ): Promise<ConversationResponse> {
    let endpoint = "/v1/analyze/conversation";
    let body: any;
    let headers: Record<string, string> = {};

    if ((source as ConversationRequestUrl).url) {
      body = JSON.stringify(source);
      headers["Content-Type"] = "application/json";
    } else {
      body = source;
      headers["Content-Type"] = "audio/*";
    }

    const url = this.getRequestUrl(endpoint, {}, options);
    const resp = await this.post(url, body, { headers });
    return resp.json();
  }

  /**
   * Analyze a conversation in streaming mode.
   * @param audioChunk - Binary audio chunk
   * @param options - Query parameters
   * @returns StreamingConversationResponse
   */
  async streamConversationAnalysis(
    audioChunk: ConversationRequestFile,
    options?: Record<string, any>
  ): Promise<StreamingConversationResponse> {
    const endpoint = "/v1/analyze/conversation/stream";
    const url = this.getRequestUrl(endpoint, {}, options);
    const headers = { "Content-Type": "audio/*" };
    const resp = await this.post(url, audioChunk, { headers });
    return resp.json();
  }

  /**
   * Retrieve analysis for a specific conversation.
   * @param conversationId - UUID
   * @returns ConversationResponse
   */
  async getConversationAnalysis(conversationId: string): Promise<ConversationResponse> {
    const endpoint = `/v1/analyze/conversation/${conversationId}`;
    const url = this.getRequestUrl(endpoint);
    const resp = await this.get(url);
    return resp.json();
  }
}
