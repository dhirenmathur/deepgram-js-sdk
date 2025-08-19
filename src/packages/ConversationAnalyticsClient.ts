import { ConversationAnalyticsRestClient } from "./ConversationAnalyticsRestClient";

/**
 * Provides access to the Conversation Analytics API.
 */
export class ConversationAnalyticsClient {
  constructor(private options: any) {}

  /**
   * REST endpoints for conversation analytics.
   */
  get rest() {
    return new ConversationAnalyticsRestClient(this.options);
  }
}
