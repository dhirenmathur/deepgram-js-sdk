import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationAnalysisParams,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types/ConversationAnalyticsSchema";

/**
 * Client for Deepgram Real-time Conversation Analytics API
 */
export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversation-analytics";

  /**
   * Analyze a conversation (URL or file)
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    params?: ConversationAnalysisParams
  ): Promise<ConversationResponse> {
    let endpoint = "/v1/analyze/conversation";
    let body: any;
    let headers: Record<string, string> = {};
    if (typeof source === "object" && "url" in source) {
      body = JSON.stringify(source);
      headers["Content-Type"] = "application/json";
    } else {
      body = source as ConversationRequestFile;
      headers["Content-Type"] = "application/octet-stream";
    }
    const url = this.getRequestUrl(endpoint, {}, params || {});
    const resp = await this.post(url, body, { headers });
    return resp.json();
  }

  /**
   * Analyze a conversation in real-time streaming mode
   */
  async streamConversationAnalysis(
    audioChunk: ConversationRequestFile,
    params?: ConversationAnalysisParams
  ): Promise<StreamingConversationResponse> {
    const endpoint = "/v1/analyze/conversation/stream";
    const url = this.getRequestUrl(endpoint, {}, params || {});
    const headers = { "Content-Type": "application/octet-stream" };
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
