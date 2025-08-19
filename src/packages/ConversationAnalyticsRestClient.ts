import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationAnalyticsQueryParams,
  ConversationResponse,
  StreamingConversationResponse
} from "../lib/types/ConversationAnalyticsSchema";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "analyze";

  /**
   * Analyze a conversation for insights (URL or file upload).
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    params?: ConversationAnalyticsQueryParams,
    contentType: "application/json" | "audio/*" = "application/json"
  ): Promise<ConversationResponse> {
    const endpoint = "/v1/analyze/conversation";
    let body: any;
    let url = this.getRequestUrl(endpoint, {}, params);

    if (contentType === "application/json") {
      body = JSON.stringify(source);
    } else {
      body = source;
    }

    const resp = await this.post(url, body, contentType === "audio/*" ? { headers: { "Content-Type": "audio/*" } } : {});
    return resp.json();
  }

  /**
   * Analyze streaming conversation audio (real-time).
   * Accepts audio binary chunks as request, returns streaming results.
   */
  async streamConversationAnalysis(
    audioChunk: Buffer | Blob | ArrayBuffer,
    params?: ConversationAnalyticsQueryParams
  ): Promise<StreamingConversationResponse> {
    const endpoint = "/v1/analyze/conversation/stream";
    const url = this.getRequestUrl(endpoint, {}, params);

    const resp = await this.post(url, audioChunk, { headers: { "Content-Type": "audio/*" } });
    return resp.json();
  }

  /**
   * Get full analysis for a specific conversation.
   */
  async getConversationAnalysis(
    conversation_id: string
  ): Promise<ConversationResponse> {
    const endpoint = `/v1/analyze/conversation/${conversation_id}`;
    const url = this.getRequestUrl(endpoint);

    const resp = await this.get(url);
    return resp.json();
  }
}

export { ConversationAnalyticsRestClient as ConversationAnalyticsClient };
