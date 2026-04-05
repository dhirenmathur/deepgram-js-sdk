// src/packages/ConversationAnalyticsRestClient.ts

import { AbstractRestClient } from "./AbstractRestClient";
import {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationAnalyticsQueryParams,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace = "conversationAnalytics";

  /**
   * Analyze a conversation from a URL or file.
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    query?: ConversationAnalyticsQueryParams,
    endpoint = ":version/analyze/conversation"
  ): Promise<ConversationResponse> {
    let body: any;
    let headers: Record<string, string> = {};

    if (typeof source === "object" && "url" in source) {
      body = JSON.stringify(source);
      headers["Content-Type"] = "application/json";
    } else {
      body = source;
      headers["Content-Type"] = "audio/*";
    }

    const requestUrl = this.getRequestUrl(endpoint, {}, query || {});
    const resp = await this.post(requestUrl, body, { headers });
    return resp.json();
  }

  /**
   * Analyze a conversation in streaming mode.
   */
  async streamConversationAnalysis(
    audioChunk: ConversationRequestFile,
    query?: ConversationAnalyticsQueryParams,
    endpoint = ":version/analyze/conversation/stream"
  ): Promise<StreamingConversationResponse> {
    const requestUrl = this.getRequestUrl(endpoint, {}, query || {});
    const resp = await this.post(requestUrl, audioChunk, {
      headers: { "Content-Type": "audio/*" },
    });
    return resp.json();
  }

  /**
   * Retrieve analysis for a specific conversation.
   */
  async getConversationAnalysis(
    conversation_id: string,
    endpoint = ":version/analyze/conversation/"
  ): Promise<ConversationResponse> {
    const requestUrl = this.getRequestUrl(
      `${endpoint}${conversation_id}`,
      {},
      {}
    );
    const resp = await this.get(requestUrl);
    return resp.json();
  }
}
