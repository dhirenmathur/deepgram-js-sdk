import { CallbackUrl, isFileSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  ConversationAnalyticsSchema,
  ConversationResponse,
  DeepgramResponse,
  FileSource,
  UrlSource,
  AsyncConversationResponse,
  SyncConversationResponse,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

/**
 * The AnalyticsRestClient provides methods for analyzing conversations using
 * Deepgram's Conversation Analytics API.
 * 
 * This client supports:
 * - Synchronous analysis from URL or file sources
 * - Asynchronous analysis with callback notifications
 * - Retrieving analysis results by conversation ID
 * 
 * @example
 * ```typescript
 * const client = new AnalyticsRestClient(options);
 * 
 * // Analyze URL synchronously
 * const { result, error } = await client.analyzeUrl(
 *   { url: "https://example.com/conversation.wav" },
 *   { detect_speakers: true, extract_action_items: true }
 * );
 * 
 * // Analyze with callback
 * const callbackUrl = new CallbackUrl("https://example.com/webhook");
 * const { result, error } = await client.analyzeUrlCallback(
 *   { url: "https://example.com/conversation.wav" },
 *   callbackUrl,
 *   { detect_sentiment: true }
 * );
 * ```
 */
export class AnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "analytics";

  /**
   * Analyzes a conversation from a URL synchronously.
   * 
   * @param {UrlSource} source - The URL source containing the conversation audio.
   * @param {ConversationAnalyticsSchema} [options] - Analysis options including speaker detection, sentiment analysis, etc.
   * @param {string} [endpoint=":version/analyze/conversation"] - The API endpoint to use.
   * @returns {Promise<DeepgramResponse<SyncConversationResponse>>} The analysis result or error.
   */
  async analyzeUrl(
    source: UrlSource,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<SyncConversationResponse>> {
    try {
      if (!isUrlSource(source)) {
        throw new DeepgramError("Invalid source type for URL analysis");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided for synchronous analysis. Use analyzeUrlCallback instead."
        );
      }

      const body = JSON.stringify(source);
      const requestUrl = this.getRequestUrl(endpoint, {}, { ...{}, ...options });
      const result: SyncConversationResponse = await this.post(requestUrl, body, {
        headers: { "Content-Type": "application/json" },
      }).then((result) => result.json());

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }
      throw error;
    }
  }

  /**
   * Analyzes a conversation from a file synchronously.
   * 
   * @param {FileSource} source - The file source containing the conversation audio.
   * @param {ConversationAnalyticsSchema} [options] - Analysis options.
   * @param {string} [endpoint=":version/analyze/conversation"] - The API endpoint to use.
   * @returns {Promise<DeepgramResponse<SyncConversationResponse>>} The analysis result or error.
   */
  async analyzeFile(
    source: FileSource,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<SyncConversationResponse>> {
    try {
      if (!isFileSource(source)) {
        throw new DeepgramError("Invalid source type for file analysis");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided for synchronous analysis. Use analyzeFileCallback instead."
        );
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, { ...{}, ...options });
      const result: SyncConversationResponse = await this.post(requestUrl, source, {
        headers: { "Content-Type": "deepgram/audio+video" },
      }).then((result) => result.json());

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }
      throw error;
    }
  }

  /**
   * Analyzes a conversation from a URL with callback.
   * 
   * @param {UrlSource} source - The URL source containing the conversation audio.
   * @param {CallbackUrl} callback - The callback URL to receive results.
   * @param {ConversationAnalyticsSchema} [options] - Analysis options.
   * @param {string} [endpoint=":version/analyze/conversation"] - The API endpoint to use.
   * @returns {Promise<DeepgramResponse<AsyncConversationResponse>>} The request confirmation or error.
   */
  async analyzeUrlCallback(
    source: UrlSource,
    callback: CallbackUrl,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationResponse>> {
    try {
      if (!isUrlSource(source)) {
        throw new DeepgramError("Invalid source type for URL analysis");
      }

      const body = JSON.stringify(source);
      const requestUrl = this.getRequestUrl(
        endpoint,
        {},
        { ...options, callback: callback.toString() }
      );
      const result: AsyncConversationResponse = await this.post(requestUrl, body, {
        headers: { "Content-Type": "application/json" },
      }).then((result) => result.json());

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }
      throw error;
    }
  }

  /**
   * Analyzes a conversation from a file with callback.
   * 
   * @param {FileSource} source - The file source containing the conversation audio.
   * @param {CallbackUrl} callback - The callback URL to receive results.
   * @param {ConversationAnalyticsSchema} [options] - Analysis options.
   * @param {string} [endpoint=":version/analyze/conversation"] - The API endpoint to use.
   * @returns {Promise<DeepgramResponse<AsyncConversationResponse>>} The request confirmation or error.
   */
  async analyzeFileCallback(
    source: FileSource,
    callback: CallbackUrl,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationResponse>> {
    try {
      if (!isFileSource(source)) {
        throw new DeepgramError("Invalid source type for file analysis");
      }

      const requestUrl = this.getRequestUrl(
        endpoint,
        {},
        { ...options, callback: callback.toString() }
      );
      const result: AsyncConversationResponse = await this.post(requestUrl, source, {
        headers: { "Content-Type": "deepgram/audio+video" },
      }).then((result) => result.json());

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }
      throw error;
    }
  }

  /**
   * Retrieves analysis for a specific conversation by ID.
   * 
   * @param {string} conversationId - The unique conversation ID returned from async analysis.
   * @param {string} [endpoint=":version/analyze/conversation"] - The API endpoint to use.
   * @returns {Promise<DeepgramResponse<ConversationResponse>>} The conversation analysis result or error.
   */
  async getAnalysis(
    conversationId: string,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      const requestUrl = this.getRequestUrl(`${endpoint}/${conversationId}`);
      const result: ConversationResponse = await this.get(requestUrl).then((result) =>
        result.json()
      );

      return { result, error: null };
    } catch (error) {
      if (isDeepgramError(error)) {
        return { result: null, error };
      }
      throw error;
    }
  }
}