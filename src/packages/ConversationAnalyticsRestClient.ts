import { CallbackUrl, isFileSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  ConversationAnalyticsSchema,
  ConversationResponse,
  AsyncConversationResponse,
  DeepgramResponse,
  FileSource,
  UrlSource,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

/**
 * The `ConversationAnalyticsRestClient` class extends the `AbstractRestClient` class and provides methods for analyzing conversations from URLs or files using the Deepgram API.
 *
 * The `analyzeUrl` method is used to analyze conversations from a URL synchronously.
 * The `analyzeFile` method is used to analyze conversations from a file synchronously.
 * The `analyzeUrlCallback` method is used to analyze conversations from a URL asynchronously with a callback.
 * The `analyzeFileCallback` method is used to analyze conversations from a file asynchronously with a callback.
 * The `getAnalysis` method retrieves analysis results by conversation ID.
 */
export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversation_analytics";

  /**
   * Analyzes a conversation from a URL synchronously.
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
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown conversation source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous analysis. Use `analyzeUrlCallback` or `analyzeFileCallback` instead."
        );
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, { ...{}, ...options });
      const result: ConversationResponse = await this.post(requestUrl, body).then((result) =>
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
   * Analyzes a conversation from a file synchronously.
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
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      let body;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown conversation source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous analysis. Use `analyzeUrlCallback` or `analyzeFileCallback` instead."
        );
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, { ...{}, ...options });
      const result: ConversationResponse = await this.post(requestUrl, body, {
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
   * Analyzes a conversation from a URL asynchronously.
   *
   * @param source - The URL source object containing the audio URL to analyze.
   * @param callback - The callback URL to receive the conversation analysis result.
   * @param options - An optional `ConversationAnalyticsSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis request result or an error.
   */
  async analyzeUrlCallback(
    source: UrlSource,
    callback: CallbackUrl,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationResponse>> {
    try {
      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown conversation source type");
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
   * Analyzes a conversation from a file asynchronously.
   *
   * @param source - The file source object containing the audio file to analyze.
   * @param callback - The callback URL to receive the conversation analysis result.
   * @param options - An optional `ConversationAnalyticsSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis request result or an error.
   */
  async analyzeFileCallback(
    source: FileSource,
    callback: CallbackUrl,
    options?: ConversationAnalyticsSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationResponse>> {
    try {
      let body;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown conversation source type");
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

  /**
   * Retrieves conversation analysis results by conversation ID.
   *
   * @param conversationId - The unique identifier for the conversation analysis.
   * @param endpoint - An optional endpoint string to use for the retrieval request.
   * @returns A `DeepgramResponse` object containing the conversation analysis result or an error.
   */
  async getAnalysis(
    conversationId: string,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      const requestUrl = this.getRequestUrl(`${endpoint}/${conversationId}`, {}, {});
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