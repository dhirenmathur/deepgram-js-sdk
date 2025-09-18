import { CallbackUrl, isFileSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  ConversationAnalyticsSchema,
  AsyncConversationResponse,
  DeepgramResponse,
  FileSource,
  ConversationResponse,
  UrlSource,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

/**
 * The ConversationAnalyticsRestClient class extends AbstractRestClient and provides methods for 
 * analyzing conversation audio sources synchronously and asynchronously using the Deepgram 
 * Conversation Analytics API.
 */
export class ConversationAnalyticsRestClient extends AbstractRestClient {
  public namespace: string = "conversation";

  /**
   * Analyzes conversation from a URL source synchronously.
   *
   * @param source - The URL source containing conversation audio to analyze.
   * @param options - Optional conversation analytics options.
   * @param endpoint - The API endpoint to use. Defaults to ":version/analyze/conversation".
   * @returns A promise that resolves to the conversation analysis response.
   * @throws {DeepgramError} If callback is provided in options (use analyzeUrlCallback instead).
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
        throw new DeepgramError("Unknown source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous request. Use `analyzeUrlCallback` instead."
        );
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, { ...{}, ...options });
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
   * Analyzes conversation from a file source synchronously.
   *
   * @param source - The file source (Buffer or Readable) containing conversation audio to analyze.
   * @param options - Optional conversation analytics options.
   * @param endpoint - The API endpoint to use. Defaults to ":version/analyze/conversation".
   * @returns A promise that resolves to the conversation analysis response.
   * @throws {DeepgramError} If callback is provided in options (use analyzeFileCallback instead).
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
        throw new DeepgramError("Unknown source type");
      }

      if (options !== undefined && "callback" in options) {
        throw new DeepgramError(
          "Callback cannot be provided as an option to a synchronous request. Use `analyzeFileCallback` instead."
        );
      }

      const requestUrl = this.getRequestUrl(endpoint, {}, { ...{}, ...options });
      const result: ConversationResponse = await this.post(requestUrl, body, {
        headers: { "Content-Type": "audio/*" },
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
   * Analyzes conversation from a URL source asynchronously with callback.
   *
   * @param source - The URL source containing conversation audio to analyze.
   * @param callback - The callback URL where results will be sent.
   * @param options - Optional conversation analytics options.
   * @param endpoint - The API endpoint to use. Defaults to ":version/analyze/conversation".
   * @returns A promise that resolves to the async conversation analysis response.
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
        throw new DeepgramError("Unknown source type");
      }

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
   * Analyzes conversation from a file source asynchronously with callback.
   *
   * @param source - The file source (Buffer or Readable) containing conversation audio to analyze.
   * @param callback - The callback URL where results will be sent.
   * @param options - Optional conversation analytics options.
   * @param endpoint - The API endpoint to use. Defaults to ":version/analyze/conversation".
   * @returns A promise that resolves to the async conversation analysis response.
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
        throw new DeepgramError("Unknown source type");
      }

      const requestUrl = this.getRequestUrl(
        endpoint,
        {},
        { ...options, callback: callback.toString() }
      );
      const result: AsyncConversationResponse = await this.post(requestUrl, body, {
        headers: { "Content-Type": "audio/*" },
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
   * @param endpoint - The API endpoint to use. Defaults to ":version/analyze/conversation".
   * @returns A promise that resolves to the conversation analysis response.
   */
  async getAnalysis(
    conversationId: string,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      if (!conversationId || typeof conversationId !== 'string') {
        throw new DeepgramError("Invalid conversation ID provided");
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

export { ConversationAnalyticsRestClient as ConversationRestClient };