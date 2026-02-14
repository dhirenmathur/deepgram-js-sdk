import { CallbackUrl, isFileSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  ConversationAnalyzeSchema,
  ConversationAnalysisResponse,
  DeepgramResponse,
  FileSource,
  UrlSource,
  AsyncConversationResponse,
  SyncConversationResponse,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

/**
 * The `ConversationRestClient` class extends the `AbstractRestClient` class and provides methods 
 * for conversation analysis from URLs or files using the Deepgram Conversation Analytics API.
 *
 * Supports both synchronous and asynchronous (callback-based) analysis operations.
 */
export class ConversationRestClient extends AbstractRestClient {
  public namespace: string = "conversation";

  /**
   * Analyzes conversation from a URL synchronously.
   *
   * @param source - The URL source object containing the audio URL to analyze.
   * @param options - Optional conversation analysis configuration.
   * @param endpoint - Optional endpoint string. Defaults to ":version/analyze/conversation".
   * @returns A promise resolving to conversation analysis results or error.
   */
  async analyzeUrl(
    source: UrlSource,
    options?: ConversationAnalyzeSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<SyncConversationResponse>> {
    try {
      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown conversation source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous conversation analysis. Use `analyzeUrlCallback` or `analyzeFileCallback` instead."
        );
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
   * @param options - Optional conversation analysis configuration.
   * @param endpoint - Optional endpoint string. Defaults to ":version/analyze/conversation".
   * @returns A promise resolving to conversation analysis results or error.
   */
  async analyzeFile(
    source: FileSource,
    options?: ConversationAnalyzeSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<SyncConversationResponse>> {
    try {
      let body;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown conversation source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous conversation analysis. Use `analyzeUrlCallback` or `analyzeFileCallback` instead."
        );
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
   * Analyzes conversation from a URL asynchronously using callback.
   *
   * @param source - The URL source object containing the audio file to analyze.
   * @param callback - The callback URL to receive the analysis result.
   * @param options - Optional conversation analysis configuration.
   * @param endpoint - Optional endpoint string. Defaults to ":version/analyze/conversation".
   * @returns A promise resolving to async analysis response or error.
   */
  async analyzeUrlCallback(
    source: UrlSource,
    callback: CallbackUrl,
    options?: ConversationAnalyzeSchema,
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
   * Analyzes conversation from a file asynchronously using callback.
   *
   * @param source - The file source object containing the audio file to analyze.
   * @param callback - The callback URL to receive the analysis result.
   * @param options - Optional conversation analysis configuration.
   * @param endpoint - Optional endpoint string. Defaults to ":version/analyze/conversation".
   * @returns A promise resolving to async analysis response or error.
   */
  async analyzeFileCallback(
    source: FileSource,
    callback: CallbackUrl,
    options?: ConversationAnalyzeSchema,
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
   * @param endpoint - Optional endpoint string. Defaults to ":version/analyze/conversation".
   * @returns A promise resolving to conversation analysis results or error.
   */
  async getAnalysis(
    conversationId: string,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationAnalysisResponse>> {
    try {
      const requestUrl = this.getRequestUrl(`${endpoint}/${conversationId}`, {}, {});
      const result: ConversationAnalysisResponse = await this.get(requestUrl).then((result) =>
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