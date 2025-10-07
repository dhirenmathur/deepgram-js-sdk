import { AbstractClient } from "./AbstractClient";
import { AnalyticsRestClient } from "./AnalyticsRestClient";
import { AnalyticsLiveClient } from "./AnalyticsLiveClient";
import type { ConversationAnalysisSchema, DeepgramResponse, ConversationResponse } from "../lib/types";

/**
 * The `AnalyticsClient` class extends the `AbstractClient` class and provides access to the "analytics" namespace.
 * It exposes three methods:
 *
 * 1. `prerecorded()`: Returns an `AnalyticsRestClient` instance for interacting with the conversation analysis API.
 * 2. `live(analysisOptions: ConversationAnalysisSchema = {}, endpoint = ":version/analyze/conversation/stream")`: Returns an `AnalyticsLiveClient` instance for real-time conversation analytics.
 * 3. `retrieve(conversationId: string)`: Retrieves stored conversation analysis results by ID.
 */
export class AnalyticsClient extends AbstractClient {
  public namespace: string = "analytics";

  /**
   * Returns an `AnalyticsRestClient` instance for interacting with the conversation analysis API.
   */
  get prerecorded() {
    return new AnalyticsRestClient(this.options);
  }

  /**
   * Returns an `AnalyticsLiveClient` instance for real-time conversation analytics.
   * @param {ConversationAnalysisSchema} [analysisOptions={}] - The analysis options to use for real-time analytics.
   * @param {string} [endpoint=":version/analyze/conversation/stream"] - The endpoint to use for the streaming API.
   * @returns {AnalyticsLiveClient} - An `AnalyticsLiveClient` instance for real-time conversation analytics.
   */
  public live(
    analysisOptions: ConversationAnalysisSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ): AnalyticsLiveClient {
    return new AnalyticsLiveClient(this.options, analysisOptions, endpoint);
  }

  /**
   * Retrieves stored conversation analysis results by conversation ID.
   */
  async retrieve(conversationId: string): Promise<DeepgramResponse<ConversationResponse>> {
    const restClient = new AnalyticsRestClient(this.options);
    return restClient.getConversationAnalysis(conversationId);
  }
}