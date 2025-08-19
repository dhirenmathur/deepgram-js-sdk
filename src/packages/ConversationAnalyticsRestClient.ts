import {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationResponse,
  StreamingConversationResponse,
  ConversationErrorResponse,
} from "../lib/types/ConversationAnalyticsSchema";
import { AbstractRestClient } from "./AbstractRestClient";
import { DeepgramResponse } from "../lib/types/DeepgramResponse";

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversation_analytics";
  
  async analyzeConversationUrl(
    request: ConversationRequestUrl,
    params?: Record<string, any>,
    endpoint: string = "/v1/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      const reqUrl = this.getRequestUrl(endpoint, {}, params || {});
      const result: ConversationResponse = await this.post(reqUrl, JSON.stringify(request), {
        headers: { "Content-Type": "application/json" },
      }).then((r) => r.json());
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  async analyzeConversationFile(
    file: ConversationRequestFile,
    params?: Record<string, any>,
    endpoint: string = "/v1/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      const reqUrl = this.getRequestUrl(endpoint, {}, params || {});
      const result: ConversationResponse = await this.post(reqUrl, file, {
        headers: { "Content-Type": "application/octet-stream" },
      }).then((r) => r.json());
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  async getConversationAnalysis(
    conversation_id: string,
    endpointRoot = "/v1/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      const reqUrl = `${endpointRoot}/${conversation_id}`;
      const result: ConversationResponse = await this.get(reqUrl).then((r) => r.json());
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }

  // Note: Actual streaming integration may use fetch/stream approach. This is a stub.
  async streamConversationAnalysis(
    audioChunk: ConversationRequestFile,
    params?: Record<string, any>,
    endpoint: string = "/v1/analyze/conversation/stream"
  ): Promise<DeepgramResponse<StreamingConversationResponse>> {
    try {
      const reqUrl = this.getRequestUrl(endpoint, {}, params || {});
      const result: StreamingConversationResponse = await this.post(reqUrl, audioChunk, {
        headers: { "Content-Type": "application/octet-stream" },
      }).then((r) => r.json());
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }
}
