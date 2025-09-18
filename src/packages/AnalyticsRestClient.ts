import { CallbackUrl, isFileSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  ConversationAnalyticsResponse,
  ConversationAnalysisSchema,
  DeepgramResponse,
  FileSource,
  UrlSource,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

/**
 * The `AnalyticsRestClient` class extends the `AbstractRestClient` class and provides methods for analyzing conversations from URLs or files using the Deepgram Conversation Analytics API.
 */
export class AnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "analytics";

  /**
   * Analyzes conversation from a URL synchronously.
   *
   * @param source - The URL source object containing the audio URL to analyze.
   * @param options - An optional `ConversationAnalysisSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async analyzeUrl(
    source: UrlSource,
    options?: ConversationAnalysisSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationAnalyticsResponse>> {
    try {
      let body: string;

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
      const result: ConversationAnalyticsResponse = await this.post(requestUrl, body).then(
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

  /**
   * Analyzes conversation from a file synchronously.
   *
   * @param source - The file source object containing the audio file to analyze.
   * @param options - An optional `ConversationAnalysisSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async analyzeFile(
    source: FileSource,
    options?: ConversationAnalysisSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationAnalyticsResponse>> {
    try {
      let body: FileSource;

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
   * Analyzes conversation from a URL asynchronously with callback.
   *
   * @param source - The URL source object containing the audio file to analyze.
   * @param callback - The callback URL to receive the analysis result.
   * @param options - An optional `ConversationAnalysisSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the async analysis request confirmation.
   */
  async analyzeUrlCallback(
    source: UrlSource,
    callback: CallbackUrl,
    options?: ConversationAnalysisSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<{ request_id: string }>> {
    try {
      let body: string;

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
      const result: { request_id: string } = await this.post(requestUrl, body).then((result) =>
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
   * @param options - An optional `ConversationAnalysisSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the async analysis request confirmation.
   */
  async analyzeFileCallback(
    source: FileSource,
    callback: CallbackUrl,
    options?: ConversationAnalysisSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<{ request_id: string }>> {
    try {
      let body: FileSource;

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
      const result: { request_id: string } = await this.post(requestUrl, body, {
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
   * Retrieves a previously processed conversation analysis by ID.
   *
   * @param conversationId - The unique identifier of the conversation analysis to retrieve.
   * @param endpoint - An optional endpoint string to use for the retrieval request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async getConversationAnalysis(
    conversationId: string,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationAnalyticsResponse>> {
    try {
      const requestUrl = this.getRequestUrl(`${endpoint}/${conversationId}`, {}, {});
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
}