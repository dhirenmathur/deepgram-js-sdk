import { CallbackUrl, isFileSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  DeepgramResponse,
  FileSource,
  UrlSource,
  ConversationAnalyticsSchema,
  SyncConversationResponse,
  AsyncConversationResponse,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

/**
 * The `AnalyticsRestClient` class extends the `AbstractRestClient` class and provides methods for analyzing conversations from URLs or files using Deepgram's Conversation Analytics API.
 *
 * The class provides methods for:
 * - Synchronous conversation analysis from URLs and files
 * - Asynchronous analysis with callbacks
 * - Retrieving analysis results by conversation ID
 */
export class AnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "analytics";

  /**
   * Analyzes conversation from a URL synchronously.
   *
   * @param source - The URL source object containing the audio URL to analyze.
   * @param options - An optional `ConversationAnalyticsSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async analyzeUrl(
    source: UrlSource,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<SyncConversationResponse>> {
    try {
      let body: string;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown conversation source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to synchronous analysis. Use `analyzeUrlCallback` instead."
        );
      }

      // Validate speaker configuration
      if (options?.min_speakers && options?.max_speakers) {
        if (options.min_speakers > options.max_speakers) {
          throw new DeepgramError("min_speakers cannot be greater than max_speakers");
        }
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, { ...{}, ...options });
      const result: SyncConversationResponse = await this.post(requestUrl, body).then((result) =>
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
   * Analyzes conversation from a file synchronously.
   *
   * @param source - The file source object containing the audio file to analyze.
   * @param options - An optional `ConversationAnalyticsSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async analyzeFile(
    source: FileSource,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<SyncConversationResponse>> {
    try {
      let body: FileSource;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown conversation source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to synchronous analysis. Use `analyzeFileCallback` instead."
        );
      }

      // Validate speaker configuration
      if (options?.min_speakers && options?.max_speakers) {
        if (options.min_speakers > options.max_speakers) {
          throw new DeepgramError("min_speakers cannot be greater than max_speakers");
        }
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, { ...{}, ...options });
      const result: SyncConversationResponse = await this.post(requestUrl, body, {
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
   * Retrieves analysis results for a specific conversation ID.
   *
   * @param conversationId - The conversation ID to retrieve analysis for.
   * @param endpoint - An optional endpoint string to use for the retrieval request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async getAnalysis(
    conversationId: string,
    endpoint = ":version/analyze/conversation/:conversation_id"
  ): Promise<DeepgramResponse<SyncConversationResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { conversation_id: conversationId });
      const result: SyncConversationResponse = await this.get(requestUrl).then((result) =>
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
   * Analyzes conversation from a URL asynchronously with callback.
   *
   * @param source - The URL source object containing the audio file to analyze.
   * @param callback - The callback URL to receive the analysis result.
   * @param options - An optional `ConversationAnalyticsSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async analyzeUrlCallback(
    source: UrlSource,
    callback: CallbackUrl,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationResponse>> {
    try {
      let body: string;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown conversation source type");
      }

      // Validate speaker configuration
      if (options?.min_speakers && options?.max_speakers) {
        if (options.min_speakers > options.max_speakers) {
          throw new DeepgramError("min_speakers cannot be greater than max_speakers");
        }
      }

      const requestUrl = this.getRequestUrl(
        endpoint,
        {},
        { ...options, callback: callback.toString() }
      );
      const result: AsyncConversationResponse = await this.post(requestUrl, body).then((result) =>
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
   * Analyzes conversation from a file asynchronously with callback.
   *
   * @param source - The file source object containing the audio file to analyze.
   * @param callback - The callback URL to receive the analysis result.
   * @param options - An optional `ConversationAnalyticsSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async analyzeFileCallback(
    source: FileSource,
    callback: CallbackUrl,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationResponse>> {
    try {
      let body: FileSource;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown conversation source type");
      }

      // Validate speaker configuration
      if (options?.min_speakers && options?.max_speakers) {
        if (options.min_speakers > options.max_speakers) {
          throw new DeepgramError("min_speakers cannot be greater than max_speakers");
        }
      }

      const requestUrl = this.getRequestUrl(
        endpoint,
        {},
        { ...options, callback: callback.toString() }
      );
      const result: AsyncConversationResponse = await this.post(requestUrl, body, {
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

export { AnalyticsRestClient as ConversationAnalyticsClient };