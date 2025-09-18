import { AbstractRestClient } from "./AbstractRestClient";
import { CallbackUrl, isFileSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  ConversationSchema,
  ConversationResponse,
  AsyncConversationResponse,
  DeepgramResponse,
  FileSource,
  UrlSource,
} from "../lib/types";

/**
 * The `ConversationRestClient` class extends the `AbstractRestClient` class and provides methods for interacting with the conversation analytics REST API.
 * It provides methods for analyzing conversations from URL and file sources, both synchronously and asynchronously.
 */
export class ConversationRestClient extends AbstractRestClient {
  public namespace: string = "conversation";

  /**
   * Analyzes a conversation from a URL source synchronously.
   * @param {UrlSource} source - The URL source containing the conversation audio/video to analyze.
   * @param {ConversationSchema} [options] - Additional options for conversation analysis.
   * @param {string} [endpoint=":version/analyze/conversation"] - The API endpoint to use.
   * @returns {Promise<DeepgramResponse<ConversationResponse>>} - A promise that resolves to the conversation analysis response.
   */
  async analyzeUrl(
    source: UrlSource,
    options?: ConversationSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      if (!isUrlSource(source)) {
        throw new DeepgramError("Invalid source type for URL analysis");
      }

      if (options?.callback) {
        throw new DeepgramError("Callback cannot be provided to synchronous analysis. Use analyzeUrlCallback instead.");
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, { ...options });
      const body = JSON.stringify(source);
      
      const result: ConversationResponse = await this.post(requestUrl, body, {
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
   * Analyzes a conversation from a file source synchronously.
   * @param {FileSource} source - The file source containing the conversation audio/video to analyze.
   * @param {ConversationSchema} [options] - Additional options for conversation analysis.
   * @param {string} [endpoint=":version/analyze/conversation"] - The API endpoint to use.
   * @returns {Promise<DeepgramResponse<ConversationResponse>>} - A promise that resolves to the conversation analysis response.
   */
  async analyzeFile(
    source: FileSource,
    options?: ConversationSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      if (!isFileSource(source)) {
        throw new DeepgramError("Invalid source type for file analysis");
      }

      if (options?.callback) {
        throw new DeepgramError("Callback cannot be provided to synchronous analysis. Use analyzeFileCallback instead.");
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, { ...options });
      
      const result: ConversationResponse = await this.post(requestUrl, source, {
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
   * Analyzes a conversation from a URL source asynchronously with callback.
   * @param {UrlSource} source - The URL source containing the conversation audio/video to analyze.
   * @param {CallbackUrl} callback - The callback URL to receive the analysis results.
   * @param {ConversationSchema} [options] - Additional options for conversation analysis.
   * @param {string} [endpoint=":version/analyze/conversation"] - The API endpoint to use.
   * @returns {Promise<DeepgramResponse<AsyncConversationResponse>>} - A promise that resolves to the async conversation analysis response.
   */
  async analyzeUrlCallback(
    source: UrlSource,
    callback: CallbackUrl,
    options?: ConversationSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationResponse>> {
    try {
      if (!isUrlSource(source)) {
        throw new DeepgramError("Invalid source type for URL analysis");
      }

      const requestUrl = this.getRequestUrl(
        endpoint,
        {},
        { ...options, callback: callback.toString() }
      );
      const body = JSON.stringify(source);
      
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
   * Analyzes a conversation from a file source asynchronously with callback.
   * @param {FileSource} source - The file source containing the conversation audio/video to analyze.
   * @param {CallbackUrl} callback - The callback URL to receive the analysis results.
   * @param {ConversationSchema} [options] - Additional options for conversation analysis.
   * @param {string} [endpoint=":version/analyze/conversation"] - The API endpoint to use.
   * @returns {Promise<DeepgramResponse<AsyncConversationResponse>>} - A promise that resolves to the async conversation analysis response.
   */
  async analyzeFileCallback(
    source: FileSource,
    callback: CallbackUrl,
    options?: ConversationSchema,
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
   * Retrieves a conversation analysis by its ID.
   * @param {string} conversationId - The unique identifier for the conversation analysis.
   * @param {string} [endpoint=":version/analyze/conversation"] - The API endpoint to use.
   * @returns {Promise<DeepgramResponse<ConversationResponse>>} - A promise that resolves to the conversation analysis response.
   */
  async getAnalysis(
    conversationId: string,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      const requestUrl = this.getRequestUrl(`${endpoint}/${conversationId}`);
      
      const result: ConversationResponse = await this.get(requestUrl).then(
        (result) => result.json()
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