import { CallbackUrl, isFileSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  ConversationAnalysisSchema,
  ConversationResponse,
  DeepgramResponse,
  FileSource,
  UrlSource,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

/**
 * The `AnalyticsRestClient` class extends the `AbstractRestClient` class and provides methods for analyzing conversations
 * from URLs or files using the Deepgram Conversation Analytics API.
 *
 * This class provides methods for:
 * - Analyzing conversations from URLs synchronously and asynchronously
 * - Analyzing conversations from files synchronously and asynchronously  
 * - Retrieving stored conversation analysis results
 */
export class AnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "analytics";

  /**
   * Analyzes a conversation from a URL synchronously.
   *
   * @param source - The URL source object containing the conversation audio/video URL to analyze.
   * @param options - Optional conversation analysis schema containing analysis options.
   * @param endpoint - Optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the conversation analysis result or an error.
   */
  async analyzeUrl(
    source: UrlSource,
    options?: ConversationAnalysisSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown conversation analysis source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous conversation analysis. Use `analyzeUrlCallback` or `analyzeFileCallback` instead."
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
   * @param source - The file source object containing the conversation audio/video file to analyze.
   * @param options - Optional conversation analysis schema containing analysis options.
   * @param endpoint - Optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the conversation analysis result or an error.
   */
  async analyzeFile(
    source: FileSource,
    options?: ConversationAnalysisSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      let body;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown conversation analysis source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous conversation analysis. Use `analyzeUrlCallback` or `analyzeFileCallback` instead."
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
   * @param source - The URL source object containing the conversation audio/video URL to analyze.
   * @param callback - The callback URL to receive the analysis result.
   * @param options - Optional conversation analysis schema containing analysis options.
   * @param endpoint - Optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis acknowledgment or an error.
   */
  async analyzeUrlCallback(
    source: UrlSource,
    callback: CallbackUrl,
    options?: ConversationAnalysisSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<{ request_id: string }>> {
    try {
      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown conversation analysis source type");
      }

      const requestUrl = this.getRequestUrl(
        endpoint,
        {},
        { ...options, callback: callback.toString() }
      );
      const result = await this.post(requestUrl, body).then((result) => result.json());

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
   * @param source - The file source object containing the conversation audio/video file to analyze.
   * @param callback - The callback URL to receive the analysis result.
   * @param options - Optional conversation analysis schema containing analysis options.
   * @param endpoint - Optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis acknowledgment or an error.
   */
  async analyzeFileCallback(
    source: FileSource,
    callback: CallbackUrl,
    options?: ConversationAnalysisSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<{ request_id: string }>> {
    try {
      let body;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown conversation analysis source type");
      }

      const requestUrl = this.getRequestUrl(
        endpoint,
        {},
        { ...options, callback: callback.toString() }
      );
      const result = await this.post(requestUrl, body, {
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
   * Retrieves stored conversation analysis results by conversation ID.
   *
   * @param conversationId - The ID of the conversation analysis to retrieve.
   * @param endpoint - Optional endpoint string to use for the retrieval request.
   * @returns A `DeepgramResponse` object containing the conversation analysis result or an error.
   */
  async getConversationAnalysis(
    conversationId: string,
    endpoint = ":version/analyze/conversation/:conversationId"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { conversationId });
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