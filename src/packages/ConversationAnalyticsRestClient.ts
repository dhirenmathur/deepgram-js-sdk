import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationAnalyticsSchema,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types";

/**
 * REST client for Deepgram Real-time Conversation Analytics API
 */
export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversationanalytics";

  /**
   * Analyze an ongoing or recorded conversation (URL or file)
   * @param source ConversationRequestUrl or File (binary)
   * @param options Query parameters for analysis
   */
  async analyzeConversation(
    source: ConversationRequestUrl | Blob | Buffer | ArrayBuffer | Uint8Array,
    options?: ConversationAnalyticsSchema,
    endpoint = "/v1/analyze/conversation"
  ): Promise<ConversationResponse> {
    let body: any;
    let headers: Record<string, string> = {};
    if (typeof source === "object" && "url" in source) {
      body = JSON.stringify(source);
      headers["Content-Type"] = "application/json";
    } else {
      body = source as Blob | Buffer | ArrayBuffer | Uint8Array;
      headers["Content-Type"] = "audio/*";
    }
    const requestUrl = this.getRequestUrl(endpoint, {}, options);
    const result = await this.post(requestUrl, body, { headers }).then((r) => r.json());
    return result;
  }

  /**
   * Analyze a conversation in real-time streaming mode
   * @param audioChunk Audio chunk (binary)
   * @param options Query parameters for streaming analysis
   */
  async streamConversationAnalysis(
    audioChunk: Blob | Buffer | ArrayBuffer | Uint8Array,
    options?: ConversationAnalyticsSchema,
    endpoint = "/v1/analyze/conversation/stream"
  ): Promise<StreamingConversationResponse> {
    const requestUrl = this.getRequestUrl(endpoint, {}, options);
    const headers = { "Content-Type": "audio/*" };
    const result = await this.post(requestUrl, audioChunk, { headers }).then((r) => r.json());
    return result;
  }

  /**
   * Retrieve analysis for a specific conversation
   * @param conversation_id Conversation UUID
   */
  async getConversationAnalysis(
    conversation_id: string,
    endpoint = "/v1/analyze/conversation/:conversation_id"
  ): Promise<ConversationResponse> {
    const requestUrl = this.getRequestUrl(endpoint, { conversation_id });
    const result = await this.get(requestUrl).then((r) => r.json());
    return result;
  }
}
