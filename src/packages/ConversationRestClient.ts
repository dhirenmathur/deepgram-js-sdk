import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationAnalyticsOptions,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types/ConversationAnalyticsSchema";
import type { DeepgramResponse } from "../lib/types/DeepgramResponse";

/**
 * Client for Deepgram Conversation Analytics API
 */
export class ConversationRestClient extends AbstractRestClient {
  public namespace: string = "conversation";

  /**
   * Analyze a conversation (URL or file)
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    options?: ConversationAnalyticsOptions,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    let body: any;
    let headers: Record<string, string> = {};

    if ((source as ConversationRequestUrl).url) {
      body = JSON.stringify(source);
      headers["Content-Type"] = "application/json";
    } else {
      body = source;
      headers["Content-Type"] = "audio/*";
    }

    const requestUrl = this.getRequestUrl(endpoint, {}, { ...options });
    const result: ConversationResponse = await this.post(requestUrl, body, { headers }).then((r) => r.json());
    return { result, error: null };
  }

  /**
   * Analyze a conversation in streaming mode
   */
  async streamConversationAnalysis(
    audioChunk: ConversationRequestFile,
    options?: ConversationAnalyticsOptions,
    endpoint = ":version/analyze/conversation/stream"
  ): Promise<DeepgramResponse<StreamingConversationResponse>> {
    const headers = { "Content-Type": "audio/*" };
    const requestUrl = this.getRequestUrl(endpoint, {}, { ...options });
    const result: StreamingConversationResponse = await this.post(requestUrl, audioChunk, { headers }).then((r) => r.json());
    return { result, error: null };
  }

  /**
   * Retrieve analysis for a specific conversation
   */
  async getConversationAnalysis(
    conversation_id: string,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    const requestUrl = this.getRequestUrl(`${endpoint}/${conversation_id}`);
    const result: ConversationResponse = await this.get(requestUrl).then((r) => r.json());
    return { result, error: null };
  }
}

export { ConversationRestClient as ConversationClient };
