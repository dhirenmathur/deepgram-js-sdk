// Deepgram Real-time Conversation Analytics API Client
import { AbstractRestClient } from "./AbstractRestClient";
import {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types/ConversationAnalyticsSchema";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "analyze/conversation";

  /**
   * Analyze an ongoing or recorded conversation (sync or async)
   * @param data - ConversationRequestUrl or audio file (binary)
   * @param params - Query parameters for analysis
   * @returns ConversationResponse
   */
  async analyzeConversation(
    data: ConversationRequestUrl | ConversationRequestFile,
    params?: Record<string, any>
  ): Promise<ConversationResponse> {
    let body: any;
    let headers: Record<string, string> = {};
    let contentType = "application/json";
    if (typeof data === "object" && "url" in data) {
      body = JSON.stringify(data);
      contentType = "application/json";
    } else {
      body = data;
      contentType = "audio/*";
    }
    const url = this.getRequestUrl("/v1/analyze/conversation", params);
    const response = await this.post(url, body, { headers: { "Content-Type": contentType } });
    return response.json();
  }

  /**
   * Analyze a conversation in real-time streaming mode
   * @param audioChunk - Binary audio chunk
   * @param params - Query parameters for streaming analysis
   * @returns StreamingConversationResponse
   */
  async streamConversationAnalysis(
    audioChunk: ConversationRequestFile,
    params?: Record<string, any>
  ): Promise<StreamingConversationResponse> {
    const url = this.getRequestUrl("/v1/analyze/conversation/stream", params);
    const response = await this.post(url, audioChunk, { headers: { "Content-Type": "audio/*" } });
    return response.json();
  }

  /**
   * Retrieve analysis for a specific conversation
   * @param conversation_id - Conversation UUID
   * @returns ConversationResponse
   */
  async getConversationAnalysis(
    conversation_id: string
  ): Promise<ConversationResponse> {
    const url = this.getRequestUrl(`/v1/analyze/conversation/${conversation_id}`);
    const response = await this.get(url);
    return response.json();
  }
}
