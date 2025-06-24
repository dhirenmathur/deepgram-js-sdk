// src/packages/ConversationAnalyticsRestClient.ts

import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationAnalysisParams,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types/ConversationAnalyticsSchema";
import type { DeepgramResponse } from "../lib/types/DeepgramResponse";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversation-analytics";

  /**
   * Analyze a conversation (URL or file).
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    params?: ConversationAnalysisParams
  ): Promise<DeepgramResponse<ConversationResponse>> {
    let endpoint = "/v1/analyze/conversation";
    let body: any;
    let headers: Record<string, string> = {};

    if ((source as ConversationRequestUrl).url) {
      body = JSON.stringify(source);
      headers["Content-Type"] = "application/json";
    } else {
      body = source;
      headers["Content-Type"] = "application/octet-stream";
    }

    const requestUrl = this.getRequestUrl(endpoint, {}, params || {});
    const result = await this.post(requestUrl, body, { headers }).then((r) =>
      r.json()
    );
    return { result, error: null };
  }

  /**
   * Stream real-time audio for analysis.
   */
  async streamConversationAnalysis(
    audioChunk: ConversationRequestFile,
    params?: ConversationAnalysisParams
  ): Promise<DeepgramResponse<StreamingConversationResponse>> {
    const endpoint = "/v1/analyze/conversation/stream";
    const headers = { "Content-Type": "application/octet-stream" };
    const requestUrl = this.getRequestUrl(endpoint, {}, params || {});
    const result = await this.post(requestUrl, audioChunk, { headers }).then((r) =>
      r.json()
    );
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
    const result = await this.get(requestUrl).then((r) => r.json());
    return { result, error: null };
  }
}
