import { AbstractRestClient } from './AbstractRestClient';
import {
  ConversationRequestUrl,
  ConversationRequestFile,
  ConversationResponse,
  ConversationAnalyticsParams,
} from '../lib/types/ConversationAnalyticsSchemas';

/**
 * REST client for Deepgram Conversation Analytics (prerecorded/audio file or URL).
 * Handles synchronous and async callback flows.
 */
export class ConversationRestClient extends AbstractRestClient {
  /**
   * Analyze a conversation from a remote URL.
   * @param requestData ConversationRequestUrl object.
   * @param params ConversationAnalyticsParams object.
   * @returns Promise resolving to ConversationResponse.
   */
  async analyzeConversationUrl(
    requestData: ConversationRequestUrl,
    params: ConversationAnalyticsParams
  ): Promise<ConversationResponse> {
    const endpoint = '/v1/analyze/conversation';
    return this.post(endpoint, { ...requestData, ...params });
  }

  /**
   * Analyze a conversation from a file or stream.
   * @param file Buffer | Stream containing audio.
   * @param params ConversationAnalyticsParams.
   * @returns Promise resolving to ConversationResponse.
   */
  async analyzeConversationFile(
    file: Buffer | NodeJS.ReadableStream,
    params: ConversationAnalyticsParams
  ): Promise<ConversationResponse> {
    const endpoint = '/v1/analyze/conversation';
    // Assume AbstractRestClient handles multipart/form-data.
    return this.postFile(endpoint, file, params);
  }

  /**
   * Fetch results of an analysis by conversationId.
   * @param conversationId Unique ID returned from async analysis.
   * @returns Promise resolving to ConversationResponse.
   */
  async getConversationAnalysis(
    conversationId: string
  ): Promise<ConversationResponse> {
    const endpoint = `/v1/analyze/conversation/${encodeURIComponent(conversationId)}`;
    return this.get(endpoint);
  }
}
