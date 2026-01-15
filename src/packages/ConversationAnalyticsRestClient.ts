import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types/ConversationAnalyticsSchema";
import type { DeepgramResponse } from "../lib/types/DeepgramResponse";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversationAnalytics";

  /**
   * Analyze a conversation (URL or file).
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    options?: Record<string, any>
  ): Promise<DeepgramResponse<ConversationResponse>> {
    let endpoint = "v1/analyze/conversation";
    let body: any;
    let headers: Record<string, string> = {};

    if (typeof source === "object" && "url" in source) {
      body = JSON.stringify(source);
      headers["Content-Type"] = "application/json";
    } else {
      body = source;
      headers["Content-Type"] = "application/octet-stream";
    }

    const requestUrl = this.getRequestUrl(endpoint, {}, options || {});
    const result: ConversationResponse = await this.post(requestUrl, body, { headers }).then(r => r.json());
    return { result, error: null };
  }

  /**
   * Stream a conversation for real-time analysis.
   */
  async streamConversationAnalysis(
    audioChunk: ArrayBuffer | Blob | Buffer | Uint8Array,
    options?: Record<string, any>
  ): Promise<DeepgramResponse<StreamingConversationResponse>> {
    const endpoint = "v1/analyze/conversation/stream";
    const requestUrl = this.getRequestUrl(endpoint, {}, options || {});
    const headers = { "Content-Type": "application/octet-stream" };
    const result: StreamingConversationResponse = await this.post(requestUrl, audioChunk, { headers }).then(r => r.json());
    return { result, error: null };
  }

  /**
   * Retrieve analysis for a specific conversation.
   */
  async getConversationAnalysis(
    conversationId: string
  ): Promise<DeepgramResponse<ConversationResponse>> {
    const endpoint = `v1/analyze/conversation/${conversationId}`;
    const requestUrl = this.getRequestUrl(endpoint);
    const result: ConversationResponse = await this.get(requestUrl).then(r => r.json());
    return { result, error: null };
  }
}
