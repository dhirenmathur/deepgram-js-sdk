import { AbstractClient } from "./AbstractClient";
import { AnalyticsRestClient } from "./AnalyticsRestClient";
import { AnalyticsLiveClient } from "./AnalyticsLiveClient";
import { ConversationAnalyticsSchema } from "../lib/types";

/**
 * The `AnalyticsClient` class extends the `AbstractClient` class and provides access to the "analytics" namespace.
 * It exposes two methods:
 *
 * 1. `prerecorded()`: Returns an `AnalyticsRestClient` instance for analyzing prerecorded conversations.
 * 2. `live(options, endpoint)`: Returns an `AnalyticsLiveClient` instance for real-time conversation analytics.
 */
export class AnalyticsClient extends AbstractClient {
  public namespace: string = "analytics";

  /**
   * Returns an `AnalyticsRestClient` instance for analyzing prerecorded conversations.
   */
  get prerecorded(): AnalyticsRestClient {
    return new AnalyticsRestClient(this.options);
  }

  /**
   * Returns an `AnalyticsLiveClient` instance for real-time conversation analytics.
   * 
   * @param options - The analytics options to configure the streaming session.
   * @param endpoint - The endpoint to use for the analytics WebSocket connection.
   * @returns {AnalyticsLiveClient} - An `AnalyticsLiveClient` instance for real-time analytics.
   */
  public live(
    options: ConversationAnalyticsSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ): AnalyticsLiveClient {
    return new AnalyticsLiveClient(this.options, options, endpoint);
  }
}