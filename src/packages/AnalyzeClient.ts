import { AbstractClient } from "./AbstractClient";
import { AnalyzeRestClient } from "./AnalyzeRestClient";
import { AnalyzeLiveClient } from "./AnalyzeLiveClient";
import { ConversationStreamSchema } from "../lib/types";

/**
 * The `AnalyzeClient` class extends the `AbstractClient` class and provides access to the "analyze" namespace.
 * It exposes two methods:
 *
 * 1. `conversation()`: Returns a `AnalyzeRestClient` instance for interacting with the conversation analysis API.
 * 2. `stream(analysisOptions: ConversationStreamSchema = {}, endpoint = ":version/analyze/conversation/stream")`: Returns a `AnalyzeLiveClient` instance for real-time conversation analytics.
 */
export class AnalyzeClient extends AbstractClient {
  public namespace: string = "analyze";

  /**
   * Returns a `AnalyzeRestClient` instance for interacting with the conversation analysis API.
   */
  get conversation() {
    return new AnalyzeRestClient(this.options);
  }

  /**
   * Returns a `AnalyzeLiveClient` instance for real-time conversation analytics with the provided options and endpoint.
   * @param {ConversationStreamSchema} [analysisOptions={}] - The analysis options to use for the streaming analytics.
   * @param {string} [endpoint=":version/analyze/conversation/stream"] - The endpoint to use for the streaming analytics.
   * @returns {AnalyzeLiveClient} - A `AnalyzeLiveClient` instance for real-time conversation analytics.
   */
  public stream(
    analysisOptions: ConversationStreamSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ): AnalyzeLiveClient {
    return new AnalyzeLiveClient(this.options, analysisOptions, endpoint);
  }
}