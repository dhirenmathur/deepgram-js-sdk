import { CallbackUrl, isFileSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  AsyncConversationResponse,
  ConversationAnalysisSchema,
  ConversationResponse,
  DeepgramResponse,
  FileSource,
  SyncConversationResponse,
  UrlSource,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

/**
 * The `AnalyticsRestClient` class extends the `AbstractRestClient` class and provides methods for analyzing conversations from URLs or files using the Deepgram API.
 *
 * The `analyzeUrl` method is used to analyze conversations from a URL synchronously. It takes a `UrlSource` object as the source, an optional `ConversationAnalysisSchema` object as options, and an optional endpoint string. It returns a `DeepgramResponse` object containing the analysis result or an error.
 *
 * The `analyzeFile` method is used to analyze conversations from a file synchronously. It takes a `FileSource` object as the source, an optional `ConversationAnalysisSchema` object as options, and an optional endpoint string. It returns a `DeepgramResponse` object containing the analysis result or an error.
 *
 * The `analyzeUrlCallback` method is used to analyze conversations from a URL asynchronously. It takes a `UrlSource` object as the source, a `CallbackUrl` object as the callback, an optional `ConversationAnalysisSchema` object as options, and an optional endpoint string. It returns a `DeepgramResponse` object containing the analysis result or an error.
 *
 * The `analyzeFileCallback` method is used to analyze conversations from a file asynchronously. It takes a `FileSource` object as the source, a `CallbackUrl` object as the callback, an optional `ConversationAnalysisSchema` object as options, and an optional endpoint string. It returns a `DeepgramResponse` object containing the analysis result or an error.
 *
 * The `getAnalysis` method retrieves an existing conversation analysis by its ID.
 */
export class AnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "analytics";

  /**
   * Analyzes conversation from a URL synchronously.
   *
   * @param source - The URL source object containing the audio URL to analyze.
   * @param options - An optional `ConversationAnalysisSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the conversation analysis result or an error.
   */
  async analyzeUrl(
    source: UrlSource,
    options?: ConversationAnalysisSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<SyncConversationResponse>> {
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

      // Validate conversation-specific parameters
      if (options?.detect_speakers && options?.max_speakers && options?.min_speakers) {
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
   * @param options - An optional `ConversationAnalysisSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the conversation analysis result or an error.
   */
  async analyzeFile(
    source: FileSource,
    options?: ConversationAnalysisSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<SyncConversationResponse>> {
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

      // Validate conversation-specific parameters
      if (options?.detect_speakers && options?.max_speakers && options?.min_speakers) {
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
   * Analyzes conversation from a URL asynchronously.
   *
   * @param source - The URL source object containing the audio file to analyze.
   * @param callback - The callback URL to receive the analysis result.
   * @param options - An optional `ConversationAnalysisSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the conversation analysis result or an error.
   */
  async analyzeUrlCallback(
    source: UrlSource,
    callback: CallbackUrl,
    options?: ConversationAnalysisSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationResponse>> {
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
   * Analyzes conversation from a file asynchronously.
   *
   * @param source - The file source object containing the audio file to analyze.
   * @param callback - The callback URL to receive the analysis result.
   * @param options - An optional `ConversationAnalysisSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the conversation analysis result or an error.
   */
  async analyzeFileCallback(
    source: FileSource,
    callback: CallbackUrl,
    options?: ConversationAnalysisSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationResponse>> {
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
   * Retrieves an existing conversation analysis by ID.
   *
   * @param conversationId - The ID of the conversation analysis to retrieve.
   * @param endpoint - An optional endpoint string to use for the retrieval request.
   * @returns A `DeepgramResponse` object containing the conversation analysis result or an error.
   */
  async getAnalysis(
    conversationId: string,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      if (!conversationId || conversationId.trim().length === 0) {
        throw new DeepgramError("Conversation ID is required");
      }

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

export { AnalyticsRestClient as ConversationAnalysisClient };