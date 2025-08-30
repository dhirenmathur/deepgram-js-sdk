// src/packages/ConversationAnalyticsRestClient.ts

import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types";
import { DeepgramResponse } from "../lib/types/DeepgramResponse";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversation_analytics";

  /**
   * Analyze a conversation (URL or JSON body).
   */
  async analyzeConversationUrl(
    body: ConversationRequestUrl,
    params?: Record<string, any>
  ): Promise<DeepgramResponse<ConversationResponse>> {
    const endpoint = "v1/analyze/conversation";
    const requestUrl = this.getRequestUrl(endpoint, {}, params);
    const result = await this.post(requestUrl, JSON.stringify(body), {
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.json());
    return { result, error: null };
  }

  /**
   * Analyze a conversation (binary audio).
   */
  async analyzeConversationFile(
    file: ConversationRequestFile,
    params?: Record<string, any>
  ): Promise<DeepgramResponse<ConversationResponse>> {
    const endpoint = "v1/analyze/conversation";
    const requestUrl = this.getRequestUrl(endpoint, {}, params);
    const result = await this.post(requestUrl, file, {
      headers: { "Content-Type": "audio/*" },
    }).then((r) => r.json());
    return { result, error: null };
  }

  /**
   * Real-time streaming analysis (returns a stream or event emitter).
   * Note: Actual streaming implementation may require WebSocket or chunked POST.
   */
  async streamConversationAnalysis(
    audioChunk: ConversationRequestFile,
    params?: Record<string, any>
  ): Promise<DeepgramResponse<StreamingConversationResponse>> {
    const endpoint = "v1/analyze/conversation/stream";
    const requestUrl = this.getRequestUrl(endpoint, {}, params);
    const result = await this.post(requestUrl, audioChunk, {
      headers: { "Content-Type": "audio/*" },
    }).then((r) => r.json());
    return { result, error: null };
  }

  /**
   * Get analysis for a specific conversation.
   */
  async getConversationAnalysis(
    conversation_id: string
  ): Promise<DeepgramResponse<ConversationResponse>> {
    const endpoint = `v1/analyze/conversation/${conversation_id}`;
    const requestUrl = this.getRequestUrl(endpoint);
    const result = await this.get(requestUrl).then((r) => r.json());
    return { result, error: null };
  }
}
