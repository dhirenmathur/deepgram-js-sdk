// ...existing imports...
import { ConversationAnalyticsRestClient } from "./packages/ConversationAnalyticsRestClient";

// ...existing DeepgramClient class definition...

  /**
   * Returns a new instance of the ConversationAnalyticsRestClient.
   *
   * @returns {ConversationAnalyticsRestClient} A new instance of the ConversationAnalyticsRestClient.
   */
  get conversationAnalytics(): ConversationAnalyticsRestClient {
    return new ConversationAnalyticsRestClient(this.options);
  }

// ...rest of the file...
