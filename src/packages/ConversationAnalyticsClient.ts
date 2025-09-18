import { AbstractClient } from "./AbstractClient";
import { ConversationAnalyticsRestClient } from "./ConversationAnalyticsRestClient";
import { ConversationAnalyticsLiveClient } from "./ConversationAnalyticsLiveClient";
import type { ConversationAnalyticsStreamOptions } from "../lib/types";

/**
 * The `ConversationAnalyticsClient` class extends the `AbstractClient` class and provides access to the "conversation analytics" namespace.
 * It exposes methods for both REST and live streaming conversation analysis:
 * 
 * 1. `rest`: Returns a `ConversationAnalyticsRestClient` instance for synchronous/asynchronous conversation analysis
 * 2. `live(options?: ConversationAnalyticsStreamOptions, endpoint?: string)`: Returns a `ConversationAnalyticsLiveClient` instance for real-time streaming analysis
 */
export class ConversationAnalyticsClient extends AbstractClient {
  public namespace: string = "conversation_analytics";

  /**
   * Returns a `ConversationAnalyticsRestClient` instance for interacting with the conversation analytics REST API.
   */
  get rest() {
    return new ConversationAnalyticsRestClient(this.options);
  }

  /**
   * Returns a `ConversationAnalyticsLiveClient` instance for interacting with the live conversation analytics API.
   * @param {ConversationAnalyticsStreamOptions} [options={}] - The streaming options to use for the live conversation analytics API.
   * @param {string} [endpoint=":version/analyze/conversation/stream"] - The endpoint to use for the live conversation analytics API.
   * @returns {ConversationAnalyticsLiveClient} - A `ConversationAnalyticsLiveClient` instance for real-time conversation analysis.
   */
  public live(
    options: ConversationAnalyticsStreamOptions = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ): ConversationAnalyticsLiveClient {
    return new ConversationAnalyticsLiveClient(this.options, options, endpoint);
  }
}