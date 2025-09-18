import { CallbackUrl, isFileSource, isUrlSource } from "../lib/helpers";
import { DeepgramError, isDeepgramError } from "../lib/errors";
import type {
  DeepgramResponse,
  ConversationUrlSource,
  ConversationFileSource,
  ConversationAnalysisSchema,
  ConversationResponse,
  AsyncConversationResponse,
} from "../lib/types";
import { AbstractRestClient } from "./AbstractRestClient";

/**
 * The `AnalyzeRestClient` class extends the `AbstractRestClient` class and provides methods for analyzing conversations from URLs or files using the Deepgram API.
 *
 * The `analyzeUrl` method is used to analyze conversations from a URL synchronously. It takes a `ConversationUrlSource` object as the source, an optional `ConversationAnalysisSchema` object as options, and an optional endpoint string. It returns a `DeepgramResponse` object containing the analysis result or an error.
 *
 * The `analyzeFile` method is used to analyze conversations from a file synchronously. It takes a `ConversationFileSource` object as the source, an optional `ConversationAnalysisSchema` object as options, and an optional endpoint string. It returns a `DeepgramResponse` object containing the analysis result or an error.
 *
 * The `analyzeUrlCallback` method is used to analyze conversations from a URL asynchronously. It takes a `ConversationUrlSource` object as the source, a `CallbackUrl` object as the callback, an optional `ConversationAnalysisSchema` object as options, and an optional endpoint string. It returns a `DeepgramResponse` object containing the request ID or an error.
 *
 * The `getAnalysis` method is used to retrieve a stored conversation analysis by ID.
 */
export class AnalyzeRestClient extends AbstractRestClient {
  public namespace: string = "analyze";

  /**
   * Analyzes conversation from a URL synchronously.
   *
   * @param source - The URL source object containing the audio URL to analyze.
   * @param options - An optional `ConversationAnalysisSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async analyzeUrl(
    source: ConversationUrlSource,
    options?: ConversationAnalysisSchema,
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
          "Callback cannot be provided as an option to a synchronous analysis. Use `analyzeUrlCallback` instead."
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
   * Analyzes conversation from a file synchronously.
   *
   * @param source - The file source object containing the audio file to analyze.
   * @param options - An optional `ConversationAnalysisSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async analyzeFile(
    source: ConversationFileSource,
    options?: ConversationAnalysisSchema,
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
          "Callback cannot be provided as an option to a synchronous analysis. Use `analyzeFileCallback` instead."
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
   * Analyzes conversation from a URL asynchronously.
   *
   * @param source - The URL source object containing the audio file to analyze.
   * @param callback - The callback URL to receive the analysis result.
   * @param options - An optional `ConversationAnalysisSchema` object containing additional options for the analysis.
   * @param endpoint - An optional endpoint string to use for the analysis request.
   * @returns A `DeepgramResponse` object containing the request ID or an error.
   */
  async analyzeUrlCallback(
    source: ConversationUrlSource,
    callback: CallbackUrl,
    options?: ConversationAnalysisSchema,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<AsyncConversationResponse>> {
    try {
      let body;

      if (isUrlSource(source)) {
        body = JSON.stringify(source);
      } else {
        throw new DeepgramError("Unknown conversation source type");
      }

      const requestOptions = { callback: callback.toString(), ...options };
      const requestUrl = this.getRequestUrl(endpoint, {}, requestOptions);
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
   * Retrieves a stored conversation analysis by ID.
   *
   * @param conversationId - The unique identifier of the conversation analysis to retrieve.
   * @param endpoint - An optional endpoint string to use for the retrieval request.
   * @returns A `DeepgramResponse` object containing the analysis result or an error.
   */
  async getAnalysis(
    conversationId: string,
    endpoint = ":version/analyze/conversation"
  ): Promise<DeepgramResponse<ConversationResponse>> {
    try {
      const requestUrl = this.getRequestUrl(`${endpoint}/${conversationId}`);
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