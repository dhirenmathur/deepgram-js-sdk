import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationAnalyticsParams,
  ConversationResponse,
  StreamingConversationResponse
} from "../lib/types/ConversationAnalyticsSchema";
import { DeepgramResponse } from "../lib/types/DeepgramResponse";

/**
 * Client for Deepgram Real-time Conversation Analytics API
 * Implements DMA-22 endpoints
 */
export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace = "conversation-analytics";

  /**
   * Analyze an ongoing or recorded conversation (URL or file)
   * POST /v1/analyze/conversation
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    params?: ConversationAnalyticsParams
  ): Promise<DeepgramResponse<ConversationResponse>> {
    let body: any;
    let contentType: string;
    if (typeof source === "object" && "url" in source) {
      body = JSON.stringify(source);
      contentType = "application/json";
    } else {
      body = source;
      contentType = "audio/*";
    }
    const endpoint = "/v1/analyze/conversation";
    const url = this.getRequestUrl(endpoint, {}, params || {});
    const result = await this.post(url, body, { headers: { "Content-Type": contentType } }).then(r => r.json());
    return { result, error: null };
  }

  /**
   * Analyze a conversation in real-time streaming mode
   * POST /v1/analyze/conversation/stream
   */
  async streamConversationAnalysis(
    audioChunk: ConversationRequestFile,
    params?: ConversationAnalyticsParams
  ): Promise<DeepgramResponse<StreamingConversationResponse>> {
    const endpoint = "/v1/analyze/conversation/stream";
    const url = this.getRequestUrl(endpoint, {}, params || {});
    const result = await this.post(url, audioChunk, { headers: { "Content-Type": "audio/*" } }).then(r => r.json());
    return { result, error: null };
  }

  /**
   * Retrieve analysis for a specific conversation
   * GET /v1/analyze/conversation/{conversation_id}
   */
  async getConversationAnalysis(
    conversationId: string
  ): Promise<DeepgramResponse<ConversationResponse>> {
    const endpoint = `/v1/analyze/conversation/${conversationId}`;
    const url = this.getRequestUrl(endpoint);
    const result = await this.get(url).then(r => r.json());
    return { result, error: null };
  }
}
