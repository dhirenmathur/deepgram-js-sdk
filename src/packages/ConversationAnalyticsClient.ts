import { AbstractClient } from "./AbstractClient";
import { ConversationAnalyticsRestClient } from "./ConversationAnalyticsRestClient";
import { ConversationAnalyticsLiveClient } from "./ConversationAnalyticsLiveClient";
import type { ConversationAnalyticsSchema, DeepgramClientOptions } from "../lib/types";

/**
 * The ConversationAnalyticsClient class extends AbstractClient and provides access to both prerecorded 
 * and live conversation analysis functionality for the Deepgram Conversation Analytics API.
 */
export class ConversationAnalyticsClient extends AbstractClient {
  public namespace: string = "conversation";

  /**
   * Returns a new instance of the ConversationAnalyticsRestClient for prerecorded conversation analysis.
   *
   * @returns {ConversationAnalyticsRestClient} A new instance for REST-based conversation analysis.
   */
  get prerecorded(): ConversationAnalyticsRestClient {
    return new ConversationAnalyticsRestClient(this.options);
  }

  /**
   * Returns a new instance of the ConversationAnalyticsLiveClient for real-time conversation analysis.
   *
   * @param analyticsOptions - Optional conversation analytics configuration options.
   * @param endpoint - Optional WebSocket endpoint. Defaults to ":version/analyze/conversation/stream".
   * @returns {ConversationAnalyticsLiveClient} A new instance for live conversation analysis.
   */
  public live(
    analyticsOptions: ConversationAnalyticsSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ): ConversationAnalyticsLiveClient {
    return new ConversationAnalyticsLiveClient(this.options, analyticsOptions, endpoint);
  }
}

export { ConversationAnalyticsClient as ConversationClient };