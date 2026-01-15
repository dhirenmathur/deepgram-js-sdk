import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationAnalyticsOptions,
} from "../lib/types/ConversationAnalyticsSchema";
import type {
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types/ConversationAnalyticsResponse";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversation-analytics";

  /**
   * Analyze a conversation from a URL or file.
   * @param source - URL or file
   * @param options - Analytics options
   * @returns ConversationResponse
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    options?: ConversationAnalyticsOptions
  ): Promise<ConversationResponse> {
    let endpoint = "/v1/analyze/conversation";
    let body: any;
    let headers: any = {};

    if ("url" in source) {
      body = JSON.stringify(source);
      headers["Content-Type"] = "application/json";
    } else {
      body = source;
      headers["Content-Type"] = "audio/*";
    }

    const url = this.getRequestUrl(endpoint, {}, options || {});
    const result = await this.post(url, body, { headers }).then((r) => r.json());
    return result;
  }

  /**
   * Stream audio for real-time conversation analysis.
   * @param audioChunk - Binary audio chunk
   * @param options - Analytics options
   * @returns StreamingConversationResponse
   */
  async streamConversationAnalysis(
    audioChunk: ConversationRequestFile,
    options?: ConversationAnalyticsOptions
  ): Promise<StreamingConversationResponse> {
    const endpoint = "/v1/analyze/conversation/stream";
    const headers = { "Content-Type": "audio/*" };
    const url = this.getRequestUrl(endpoint, {}, options || {});
    const result = await this.post(url, audioChunk, { headers }).then((r) => r.json());
    return result;
  }

  /**
   * Retrieve analysis for a specific conversation.
   * @param conversationId - Conversation UUID
   * @returns ConversationResponse
   */
  async getConversationAnalysis(
    conversationId: string
  ): Promise<ConversationResponse> {
    const endpoint = `/v1/analyze/conversation/${conversationId}`;
    const url = this.getRequestUrl(endpoint);
    const result = await this.get(url).then((r) => r.json());
    return result;
  }
}
