import { CallbackUrl, isFileSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  ConversationAnalyticsSchema,
  ConversationAnalyticsResponse,
  AsyncConversationAnalyticsResponse,
  DeepgramResponse,
  FileSource,
  UrlSource,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

/**
 * The `ConversationRestClient` class extends the `AbstractRestClient` class and provides methods for analyzing conversations from URLs or files using the Deepgram Conversation Analytics API.
 *
 * This client provides methods for:
 * - Synchronous conversation analysis from URL or file sources
 * - Asynchronous conversation analysis with callback URLs
 * - Retrieving conversation analysis results by ID
 */
export class ConversationRestClient extends AbstractRestClient {
  public namespace: string = "conversation";

  /**
   * Analyzes conversation from a URL source synchronously.
   *
   * @param source - The URL source object containing the audio URL to analyze.
   * @param options - An optional `ConversationAnalyticsSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the conversation analysis result or an error.
   */
  async analyzeUrl(
    source: UrlSource,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationAnalyticsResponse>> {
    try {
      let body: string;
      
      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown conversation analysis source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous analysis. Use `analyzeUrlCallback` or `analyzeFileCallback` instead."
        );
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, options);
      const result: ConversationAnalyticsResponse = await this.post(requestUrl, body, {
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
   * Analyzes conversation from a file source synchronously.
   *
   * @param source - The file source object containing the audio file to analyze.
   * @param options - An optional `ConversationAnalyticsSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the conversation analysis result or an error.
   */
  async analyzeFile(
    source: FileSource,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationAnalyticsResponse>> {
    try {
      let body: string | Buffer;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown conversation analysis source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous analysis. Use `analyzeUrlCallback` or `analyzeFileCallback` instead."
        );
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, options);
      const result: ConversationAnalyticsResponse = await this.post(requestUrl, body, {
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
   * Retrieves conversation analysis results by conversation ID.
   *
   * @param conversationId - The unique identifier for the conversation analysis.
   * @param endpoint - An optional endpoint string to use for the request.
   * @returns A `DeepgramResponse` object containing the conversation analysis result or an error.
   */
  async getConversation(
    conversationId: string,
    endpoint = ":version/analyze/conversation/:conversationId"
  ): Promise<DeepgramResponse<ConversationAnalyticsResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { conversationId });
      const result: ConversationAnalyticsResponse = await this.get(requestUrl).then((result) => 
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

  /**
   * Analyzes conversation from a URL source asynchronously with callback.
   *
   * @param source - The URL source object containing the audio file to analyze.
   * @param callback - The callback URL to receive the analysis result.
   * @param options - An optional `ConversationAnalyticsSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the request ID or an error.
   */
  async analyzeUrlCallback(
    source: UrlSource,
    callback: CallbackUrl,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationAnalyticsResponse>> {
    try {
      let body: string;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown conversation analysis source type");
      }

      const requestOptions = {
        ...options,
        callback: callback.toString(),
        callback_method: callback.method || "POST",
      };

      const requestUrl = this.getRequestUrl(endpoint, {}, requestOptions);
      const result: AsyncConversationAnalyticsResponse = await this.post(requestUrl, body, {
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
   * Analyzes conversation from a file source asynchronously with callback.
   *
   * @param source - The file source object containing the audio file to analyze.
   * @param callback - The callback URL to receive the analysis result.
   * @param options - An optional `ConversationAnalyticsSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the request ID or an error.
   */
  async analyzeFileCallback(
    source: FileSource,
    callback: CallbackUrl,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationAnalyticsResponse>> {
    try {
      let body: string | Buffer;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown conversation analysis source type");
      }

      const requestOptions = {
        ...options,
        callback: callback.toString(),
        callback_method: callback.method || "POST",
      };

      const requestUrl = this.getRequestUrl(endpoint, {}, requestOptions);
      const result: AsyncConversationAnalyticsResponse = await this.post(requestUrl, body, {
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
}