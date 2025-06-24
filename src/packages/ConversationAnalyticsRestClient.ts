// src/packages/ConversationAnalyticsRestClient.ts

import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationAnalyzeParams,
  ConversationResponse,
  StreamingConversationResponse,
  ConversationStreamParams,
} from "../lib/types";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversation_analytics";

  /**
   * Analyze an ongoing or recorded conversation (URL or file).
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    params?: ConversationAnalyzeParams
  ): Promise<ConversationResponse> {
    const endpoint = ":version/analyze/conversation";
    let body: any;
    let headers: Record<string, string> = {};

    if ("url" in source) {
      body = JSON.stringify(source);
      headers["Content-Type"] = "application/json";
    } else {
      body = source;
      headers["Content-Type"] = "audio/wav"; // or detect from file type
    }

    const url = this.getRequestUrl(endpoint, {}, params);
    const response = await this.post(url, body, { headers });
    return response.json();
  }

  /**
   * Analyze a conversation in real-time streaming mode.
   */
  async streamConversationAnalysis(
    audioChunk: ArrayBuffer | Blob,
    params?: ConversationStreamParams
  ): Promise<StreamingConversationResponse> {
    const endpoint = ":version/analyze/conversation/stream";
    const url = this.getRequestUrl(endpoint, {}, params);
    const headers = { "Content-Type": "audio/wav" }; // or detect dynamically
    const response = await this.post(url, audioChunk, { headers });
    return response.json();
  }

  /**
   * Retrieve analysis for a specific conversation.
   */
  async getConversationAnalysis(
    conversation_id: string
  ): Promise<ConversationResponse> {
    const endpoint = `:version/analyze/conversation/${conversation_id}`;
    const url = this.getRequestUrl(endpoint);
    const response = await this.get(url);
    return response.json();
  }
}

export default ConversationAnalyticsRestClient;
