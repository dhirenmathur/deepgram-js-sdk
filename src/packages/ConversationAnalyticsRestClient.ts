// Deepgram Conversation Analytics REST Client
import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversation-analytics";

  /**
   * Analyze a conversation from a URL or file (sync/async)
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    options?: Record<string, any>,
    endpoint: string = "/v1/analyze/conversation"
  ): Promise<ConversationResponse> {
    let body;
    let headers: Record<string, string> = {};
    if (typeof source === "object" && "url" in source) {
      body = JSON.stringify(source);
      headers["Content-Type"] = "application/json";
    } else {
      body = source;
      headers["Content-Type"] = "audio/*";
    }
    const requestUrl = this.getRequestUrl(endpoint, {}, options || {});
    const result = await this.post(requestUrl, body, { headers }).then((res) => res.json());
    return result;
  }

  /**
   * Stream a conversation for real-time analysis
   */
  async streamConversationAnalysis(
    audioChunk: ConversationRequestFile,
    options?: Record<string, any>,
    endpoint: string = "/v1/analyze/conversation/stream"
  ): Promise<StreamingConversationResponse> {
    const headers = { "Content-Type": "audio/*" };
    const requestUrl = this.getRequestUrl(endpoint, {}, options || {});
    const result = await this.post(requestUrl, audioChunk, { headers }).then((res) => res.json());
    return result;
  }

  /**
   * Retrieve analysis for a specific conversation
   */
  async getConversationAnalysis(
    conversation_id: string,
    endpoint: string = "/v1/analyze/conversation/"
  ): Promise<ConversationResponse> {
    const requestUrl = `${endpoint}${conversation_id}`;
    const result = await this.get(requestUrl).then((res) => res.json());
    return result;
  }
}
