import { AbstractRestClient } from './AbstractRestClient';
import type {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationAnalyticsQueryParams,
  ConversationResponse,
  StreamingConversationResponse,
} from '../lib/types';

export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = 'conversation-analytics';

  /**
   * Analyze a conversation (recorded or ongoing) via URL or file.
   */
  async analyzeConversation(
    source: ConversationRequestUrl | ConversationRequestFile,
    params?: ConversationAnalyticsQueryParams,
    contentType: 'application/json' | 'audio/*' = 'application/json'
  ): Promise<ConversationResponse> {
    const endpoint = '/v1/analyze/conversation';
    let body: any;
    let headers: Record<string, string> = {};

    if (contentType === 'application/json') {
      body = JSON.stringify(source);
      headers['Content-Type'] = 'application/json';
    } else {
      body = source as ConversationRequestFile;
      headers['Content-Type'] = 'audio/wav'; // or detect from file
    }

    const url = this.getRequestUrl(endpoint, {}, params || {});
    const response = await this.post(url, body, { headers });
    return response.json();
  }

  /**
   * Stream audio for real-time conversation analysis.
   */
  async streamConversationAnalysis(
    audioStream: ConversationRequestFile,
    params?: ConversationAnalyticsQueryParams
  ): Promise<StreamingConversationResponse> {
    const endpoint = '/v1/analyze/conversation/stream';
    const url = this.getRequestUrl(endpoint, {}, params || {});
    const headers = { 'Content-Type': 'audio/wav' }; // or detect from stream

    const response = await this.post(url, audioStream, { headers });
    return response.json();
  }

  /**
   * Retrieve analysis for a specific conversation.
   */
  async getConversationAnalysis(
    conversation_id: string
  ): Promise<ConversationResponse> {
    const endpoint = `/v1/analyze/conversation/${conversation_id}`;
    const url = this.getRequestUrl(endpoint);
    const response = await this.get(url);
    return response.json();
  }
}
