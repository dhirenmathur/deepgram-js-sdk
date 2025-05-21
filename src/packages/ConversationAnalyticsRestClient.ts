// Deepgram Conversation Analytics REST Client
import { AbstractRestClient } from "./AbstractRestClient";
import type {
  AnalyzeConversationUrlRequest,
  AnalyzeConversationFileRequest,
  ConversationResponse,
  StreamingConversationResponse,
} from "../lib/types";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace = "conversation-analytics";

  /**
   * Analyze an ongoing or recorded conversation (URL or file)
   * @param data - Either a URL request or File request
   * @param options - Optional query parameters (overrides fields in data)
   */
  async analyzeConversation(
    data: AnalyzeConversationUrlRequest | AnalyzeConversationFileRequest,
    options?: Partial<AnalyzeConversationUrlRequest | AnalyzeConversationFileRequest>
  ): Promise<ConversationResponse> {
    let endpoint = "/v1/analyze/conversation";
    let headers: Record<string, string> = {};
    let body: any;
    let isFile = false;

    if ("url" in data) {
      body = JSON.stringify({ url: data.url });
      headers["Content-Type"] = "application/json";
    } else if ("file" in data) {
      body = (data as AnalyzeConversationFileRequest).file;
      headers["Content-Type"] = "audio/*";
      isFile = true;
    } else {
      throw new Error("Invalid request: must provide url or file");
    }

    // Collect query params
    const params = { ...data, ...options };
    delete params["url"];
    delete params["file"];
    const requestUrl = this.getRequestUrl(endpoint, {}, params);
    const result = await this.post(requestUrl, body, { headers });
    return result.json();
  }

  /**
   * Analyze a conversation in real-time streaming mode
   * @param audioChunk - The audio chunk (binary)
   * @param options - Query parameters
   */
  async streamConversationAnalysis(
    audioChunk: ArrayBuffer | Buffer | Blob | Uint8Array,
    options?: Partial<AnalyzeConversationFileRequest>
  ): Promise<StreamingConversationResponse> {
    const endpoint = "/v1/analyze/conversation/stream";
    const headers = { "Content-Type": "audio/*" };
    const requestUrl = this.getRequestUrl(endpoint, {}, options);
    const result = await this.post(requestUrl, audioChunk, { headers });
    return result.json();
  }

  /**
   * Retrieve analysis for a specific conversation
   * @param conversation_id - The conversation UUID
   */
  async getConversationAnalysis(
    conversation_id: string
  ): Promise<ConversationResponse> {
    const endpoint = `/v1/analyze/conversation/${conversation_id}`;
    const requestUrl = this.getRequestUrl(endpoint);
    const result = await this.get(requestUrl);
    return result.json();
  }
}
