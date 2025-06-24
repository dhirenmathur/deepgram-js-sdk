// src/packages/ConversationAnalyticsRestClient.ts

import { AbstractRestClient } from "./AbstractRestClient";
import {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types/ConversationAnalyticsSchema";
import { DeepgramResponse } from "../lib/types/DeepgramResponse";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace = "conversation_analytics";

  /**
   * Analyze an ongoing or recorded conversation (JSON or audio file).
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    options?: Record<string, any>
  ): Promise<DeepgramResponse<ConversationResponse>> {
    let endpoint = "/v1/analyze/conversation";
    let body: any;
    let headers: Record<string, string> = {};

    if (typeof source === "object" && "url" in source) {
      body = JSON.stringify(source);
      headers["Content-Type"] = "application/json";
    } else {
      body = source;
      headers["Content-Type"] = "audio/*";
    }

    const requestUrl = this.getRequestUrl(endpoint, {}, options || {});
    const result: ConversationResponse = await this.post(requestUrl, body, { headers }).then((r) => r.json());
    return { result, error: null };
  }

  /**
   * Analyze a conversation in real-time streaming mode.
   */
  async streamConversationAnalysis(
    audioChunk: ArrayBuffer | Buffer | Blob,
    options?: Record<string, any>
  ): Promise<DeepgramResponse<StreamingConversationResponse>> {
    const endpoint = "/v1/analyze/conversation/stream";
    const headers = { "Content-Type": "audio/*" };
    const requestUrl = this.getRequestUrl(endpoint, {}, options || {});
    const result: StreamingConversationResponse = await this.post(requestUrl, audioChunk, { headers }).then((r) => r.json());
    return { result, error: null };
  }

  /**
   * Retrieve analysis for a specific conversation.
   */
  async getConversationAnalysis(
    conversation_id: string
  ): Promise<DeepgramResponse<ConversationResponse>> {
    const endpoint = `/v1/analyze/conversation/${conversation_id}`;
    const requestUrl = this.getRequestUrl(endpoint);
    const result: ConversationResponse = await this.get(requestUrl).then((r) => r.json());
    return { result, error: null };
  }
}
