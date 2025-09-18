import { AbstractClient } from "./AbstractClient";
import { AnalyticsRestClient } from "./AnalyticsRestClient";
import { AnalyticsLiveClient } from "./AnalyticsLiveClient";
import { ConversationAnalysisSchema } from "../lib/types";

/**
 * The `AnalyticsClient` class extends the `AbstractClient` class and provides access to the "analytics" namespace.
 * It exposes two methods:
 *
 * 1. `rest`: Returns an `AnalyticsRestClient` instance for interacting with the conversation analytics REST API.
 * 2. `live(analysisOptions: ConversationAnalysisSchema = {}, endpoint = ":version/analyze/conversation/stream")`: Returns an `AnalyticsLiveClient` instance for real-time conversation analytics, with the provided analysis options and endpoint.
 */
export class AnalyticsClient extends AbstractClient {
  public namespace: string = "analytics";

  /**
   * Returns an `AnalyticsRestClient` instance for interacting with the conversation analytics REST API.
   */
  get rest(): AnalyticsRestClient {
    return new AnalyticsRestClient(this.options);
  }

  /**
   * Returns an `AnalyticsLiveClient` instance for real-time conversation analytics, with the provided analysis options and endpoint.
   * @param {ConversationAnalysisSchema} [analysisOptions={}] - The analysis options to use for the live analytics API.
   * @param {string} [endpoint=":version/analyze/conversation/stream"] - The endpoint to use for the live analytics API.
   * @returns {AnalyticsLiveClient} - An `AnalyticsLiveClient` instance for real-time conversation analytics.
   */
  public live(
    analysisOptions: ConversationAnalysisSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ): AnalyticsLiveClient {
    return new AnalyticsLiveClient(this.options, analysisOptions, endpoint);
  }
}