// Add necessary imports at the top of the file
import { ConversationAnalyticsClient } from "./packages/ConversationAnalyticsClient";

// ...rest of the DeepgramClient code is unchanged

// In the DeepgramClient class, add the getter for conversationAnalytics
/**
 * Returns a new instance of the ConversationAnalyticsClient, which provides access
 * to the Conversation Analytics REST API.
 */
get conversationAnalytics(): ConversationAnalyticsClient {
  return new ConversationAnalyticsClient(this.options);
}

// ...rest of the DeepgramClient code remains as is