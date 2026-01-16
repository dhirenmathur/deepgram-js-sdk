// ConversationAnalyticsRestClient for Deepgram Real-time Conversation Analytics API
import { AbstractRestClient } from "./AbstractRestClient";
import {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types/ConversationAnalyticsSchema";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversation-analytics";

  /**
   * Analyze an ongoing or recorded conversation (sync or async)
   * @param data - JSON body (ConversationRequestUrl) or binary audio (ConversationRequestFile)
   * @param options - Query parameters for analysis
   */
  async analyzeConversation(
    data: ConversationRequestUrl | ConversationRequestFile,
    options?: Record<string, any>
  ): Promise<ConversationResponse> {
    const isUrl = typeof data === "object" && "url" in data;
    const endpoint = "/v1/analyze/conversation";
    const headers = isUrl
      ? { "Content-Type": "application/json" }
      : { "Content-Type": "audio/*" };
    const body = isUrl ? JSON.stringify(data) : data;
    const url = this.getRequestUrl(endpoint, {}, options);
    const result = await this.post(url, body, { headers }).then((res) => res.json());
    return result;
  }

  /**
   * Analyze a conversation in real-time streaming mode
   * @param audioChunk - Audio chunk (binary)
   * @param options - Query parameters for streaming analysis
   */
  async streamConversationAnalysis(
    audioChunk: ConversationRequestFile,
    options?: Record<string, any>
  ): Promise<StreamingConversationResponse> {
    const endpoint = "/v1/analyze/conversation/stream";
    const headers = { "Content-Type": "audio/*" };
    const url = this.getRequestUrl(endpoint, {}, options);
    const result = await this.post(url, audioChunk, { headers }).then((res) => res.json());
    return result;
  }

  /**
   * Retrieve analysis for a specific conversation
   * @param conversation_id - Unique identifier of the conversation
   * @param options - Query parameters
   */
  async getConversationAnalysis(
    conversation_id: string,
    options?: Record<string, any>
  ): Promise<ConversationResponse> {
    const endpoint = `/v1/analyze/conversation/${conversation_id}`;
    const url = this.getRequestUrl(endpoint, {}, options);
    const result = await this.get(url).then((res) => res.json());
    return result;
  }
}
