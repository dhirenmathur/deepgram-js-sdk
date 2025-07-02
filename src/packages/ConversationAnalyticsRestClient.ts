// src/packages/ConversationAnalyticsRestClient.ts
import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationAnalyticsOptions,
  ConversationResponse,
  StreamingConversationResponse
} from "../lib/types";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversation-analytics";

  /**
   * Analyze a conversation (URL or file)
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    options?: ConversationAnalyticsOptions
  ): Promise<ConversationResponse> {
    let endpoint = "/v1/analyze/conversation";
    let headers: Record<string, string> = {};
    let body: any;
    if (typeof (source as ConversationRequestUrl).url === "string") {
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
   * Stream a conversation for real-time analytics
   */
  async streamConversationAnalysis(
    audioChunk: ArrayBuffer | Buffer | Blob,
    options?: ConversationAnalyticsOptions
  ): Promise<StreamingConversationResponse> {
    const endpoint = "/v1/analyze/conversation/stream";
    const url = this.getRequestUrl(endpoint, {}, options);
    const headers = { "Content-Type": "audio/*" };
    const resp = await this.post(url, audioChunk, { headers });
    return resp.json();
  }

  /**
   * Retrieve analysis for a specific conversation
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
