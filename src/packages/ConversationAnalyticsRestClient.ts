import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types/ConversationAnalyticsSchema";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace = "conversation-analytics";

  /**
   * Analyze a conversation (URL or file)
   * POST /v1/analyze/conversation
   */
  async analyzeConversationUrl(
    source: ConversationRequestUrl,
    params?: Record<string, any>,
    endpoint = ":version/analyze/conversation"
  ): Promise<ConversationResponse> {
    const body = JSON.stringify(source);
    const requestUrl = this.getRequestUrl(endpoint, {}, params);
    return this.post(requestUrl, body).then((res) => res.json());
  }

  async analyzeConversationFile(
    file: ConversationRequestFile,
    params?: Record<string, any>,
    endpoint = ":version/analyze/conversation"
  ): Promise<ConversationResponse> {
    const requestUrl = this.getRequestUrl(endpoint, {}, params);
    return this.post(requestUrl, file, {
      headers: { "Content-Type": "audio/*" },
    }).then((res) => res.json());
  }

  /**
   * Stream conversation analysis
   * POST /v1/analyze/conversation/stream
   */
  async streamConversationAnalysis(
    audioChunk: Buffer | ArrayBuffer | Blob,
    params?: Record<string, any>,
    endpoint = ":version/analyze/conversation/stream"
  ): Promise<StreamingConversationResponse> {
    const requestUrl = this.getRequestUrl(endpoint, {}, params);
    return this.post(requestUrl, audioChunk, {
      headers: { "Content-Type": "audio/*" },
    }).then((res) => res.json());
  }

  /**
   * Retrieve analysis for a conversation
   * GET /v1/analyze/conversation/{conversation_id}
   */
  async getConversationAnalysis(
    conversation_id: string,
    endpoint = ":version/analyze/conversation/"
  ): Promise<ConversationResponse> {
    const requestUrl = this.getRequestUrl(
      endpoint + conversation_id,
      {},
      {}
    );
    return this.get(requestUrl).then((res) => res.json());
  }
}
