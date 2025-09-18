import { AbstractRestClient } from './AbstractRestClient';
import {
  ConversationAnalyzeUrlRequest,
  ConversationAnalyzeFileRequest,
  ConversationAnalyzeResponse,
  ConversationCallbackResponse
} from '../lib/types/ConversationAnalytics/ConversationTypes';

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  /**
   * Analyze conversation (URL Source, synchronous or callback async)
   */
  async analyzeConversationUrl(
    request: ConversationAnalyzeUrlRequest
  ): Promise<ConversationAnalyzeResponse | ConversationCallbackResponse> {
    const params = { ...request };
    const isAsync = !!params.callback_url;
    const endpoint = '/v1/analyze/conversation';
    const resp = await this.post(endpoint, params);

    if (isAsync) {
      return resp.data as ConversationCallbackResponse;
    } else {
      return resp.data as ConversationAnalyzeResponse;
    }
  }

  /**
   * Analyze conversation (File Source, synchronous or callback async)
   */
  async analyzeConversationFile(
    fileBuffer: Buffer | ArrayBuffer,
    request: ConversationAnalyzeFileRequest
  ): Promise<ConversationAnalyzeResponse | ConversationCallbackResponse> {
    const params: any = { ...request };
    const isAsync = !!params.callback_url;
    const endpoint = '/v1/analyze/conversation';
    const resp = await this.postMultipart(endpoint, fileBuffer, params);

    if (isAsync) {
      return resp.data as ConversationCallbackResponse;
    } else {
      return resp.data as ConversationAnalyzeResponse;
    }
  }

  /**
   * Retrieve result by conversation_id
   */
  async getConversationAnalysis(conversationId: string): Promise<ConversationAnalyzeResponse> {
    const resp = await this.get(`/v1/analyze/conversation/${encodeURIComponent(conversationId)}`);
    return resp.data as ConversationAnalyzeResponse;
  }
}
