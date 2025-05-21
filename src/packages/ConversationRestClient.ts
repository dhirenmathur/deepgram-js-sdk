import { CallbackUrl, isFileSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  AsyncConversationResponse,
  ConversationSchema,
  DeepgramResponse,
  FileSource,
  SyncConversationResponse,
  UrlSource,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

/**
 * The `ConversationRestClient` class extends the `AbstractRestClient` class and provides methods for analyzing conversations from URLs or files using the Deepgram API.
 *
 * The `analyzeUrl` method is used to analyze a conversation from a URL synchronously. It takes a `UrlSource` object as the source, an optional `ConversationSchema` object as options, and an optional endpoint string. It returns a `DeepgramResponse` object containing the analysis result or an error.
 *
 * The `analyzeFile` method is used to analyze a conversation from a file synchronously. It takes a `FileSource` object as the source, an optional `ConversationSchema` object as options, and an optional endpoint string. It returns a `DeepgramResponse` object containing the analysis result or an error.
 *
 * The `analyzeUrlCallback` method is used to analyze a conversation from a URL asynchronously. It takes a `UrlSource` object as the source, a `CallbackUrl` object as the callback, an optional `ConversationSchema` object as options, and an optional endpoint string. It returns a `DeepgramResponse` object containing the analysis result or an error.
 *
 * The `analyzeFileCallback` method is used to analyze a conversation from a file asynchronously. It takes a `FileSource` object as the source, a `CallbackUrl` object as the callback, an optional `ConversationSchema` object as options, and an optional endpoint string. It returns a `DeepgramResponse` object containing the analysis result or an error.
 *
 * The `getConversation` method is used to retrieve the analysis for a specific conversation by its ID. It takes a conversation ID string and an optional endpoint string. It returns a `DeepgramResponse` object containing the analysis result or an error.
 */
export class ConversationRestClient extends AbstractRestClient {
  public namespace: string = "conversation";

  /**
   * Analyzes a conversation from a URL synchronously.
   *
   * @param source - The URL source object containing the audio URL to analyze.
   * @param options - An optional `ConversationSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async analyzeUrl(
    source: UrlSource,
    options?: ConversationSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<SyncConversationResponse>> {
    try {
      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown analysis source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous analysis. Use `analyzeUrlCallback` or `analyzeFileCallback` instead."
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
   * Analyzes a conversation from a file synchronously.
   *
   * @param source - The file source object containing the audio file to analyze.
   * @param options - An optional `ConversationSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async analyzeFile(
    source: FileSource,
    options?: ConversationSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<SyncConversationResponse>> {
    try {
      let body;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown analysis source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous analysis. Use `analyzeUrlCallback` or `analyzeFileCallback` instead."
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
   * Analyzes a conversation from a URL asynchronously.
   *
   * @param source - The URL source object containing the audio URL to analyze.
   * @param callback - The callback URL to receive the analysis result.
   * @param options - An optional `ConversationSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async analyzeUrlCallback(
    source: UrlSource,
    callback: CallbackUrl,
    options?: ConversationSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationResponse>> {
    try {
      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown analysis source type");
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
   * @param callback - The callback URL to receive the analysis result.
   * @param options - An optional `ConversationSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async analyzeFileCallback(
    source: FileSource,
    callback: CallbackUrl,
    options?: ConversationSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationResponse>> {
    try {
      let body;

      if (isFileSource(source)) {
        body = source;
      } else {
        throw new DeepgramError("Unknown analysis source type");
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
   * Retrieves the analysis for a specific conversation by its ID.
   *
   * @param conversationId - The ID of the conversation to retrieve the analysis for.
   * @param endpoint - An optional endpoint string to use for the retrieval request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async getConversation(
    conversationId: string,
    endpoint = ":version/analyze/conversation/:conversationId"
  ): Promise<DeepgramResponse<SyncConversationResponse>> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { conversationId });
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
}