import { AbstractRestClient } from './AbstractRestClient';
import {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationResponse,
  ConversationCallbackRequest,
} from '../lib/types/ConversationAnalytics/ConversationAnalyticsTypes';

/**
 * Provides access to Deepgram's Conversation Analytics REST endpoints.
 */
export class ConversationAnalyticsRestClient extends AbstractRestClient {
  /**
   * Analyze a conversation via URL.
   * POST /v1/analyze/conversation
   */
  async analyzeConversationUrl(params: ConversationRequestUrl): Promise<ConversationResponse> {
    return this.postJson('/v1/analyze/conversation', params);
  }

  /**
   * Analyze a conversation via File (Buffer or Readable or Blob).
   * POST /v1/analyze/conversation
   */
  async analyzeConversationFile(params: ConversationRequestFile, file: Buffer | Blob | File): Promise<ConversationResponse> {
    const formData = new FormData();
    Object.entries(params).forEach(([k, v]) => { if (v != null) formData.append(k, v.toString()); });
    formData.append('file', file);
    return this.postMultipart('/v1/analyze/conversation', formData);
  }

  /**
   * Asynchronous analyze via callback (webhook).
   * POST /v1/analyze/conversation
   */
  async analyzeConversationCallback(params: ConversationCallbackRequest): Promise<{ request_id: string }> {
    return this.postJson('/v1/analyze/conversation', params);
  }

  /**
   * Retrieve results of a prior conversation analysis.
   * GET /v1/analyze/conversation/{conversation_id}
   */
  async getConversationAnalysis(conversationId: string): Promise<ConversationResponse> {
    return this.getJson(`/v1/analyze/conversation/${conversationId}`);
  }
}
