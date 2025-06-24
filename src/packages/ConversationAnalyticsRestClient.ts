import { AbstractRestClient } from "./AbstractRestClient";
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationAnalysisOptions,
} from "../lib/types/ConversationAnalyticsSchema";
import type {
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types/ConversationAnalyticsResponse";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace = "conversation-analytics";

  /**
   * Analyze a conversation (URL or file).
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    options?: ConversationAnalysisOptions
  ): Promise<ConversationResponse> {
    let endpoint = "/v1/analyze/conversation";
    let body: any;
    let headers: Record<string, string> = {};

    if (typeof source === "object" && "url" in source) {
      body = JSON.stringify(source);
      headers["Content-Type"] = "application/json";
    } else {
      body = source;
      headers["Content-Type"] = "audio/*";
    }

    const url = this.getRequestUrl(endpoint, {}, options ?? {});
    const resp = await this.post(url, body, { headers });
    return resp.json();
  }

  /**
   * Analyze a conversation in real-time streaming mode.
   */
  async streamConversationAnalysis(
    audioChunk: ArrayBuffer | Buffer | Blob,
    options?: ConversationAnalysisOptions
  ): Promise<StreamingConversationResponse> {
    const endpoint = "/v1/analyze/conversation/stream";
    const url = this.getRequestUrl(endpoint, {}, options ?? {});
    const resp = await this.post(url, audioChunk, {
      headers: { "Content-Type": "audio/*" },
    });
    return resp.json();
  }

  /**
   * Retrieve analysis for a specific conversation.
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
