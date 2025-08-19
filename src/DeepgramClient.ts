import { ConversationAnalyticsRestClient } from "./packages";
import AbstractClient from "./AbstractClient";

// ...other imports and code if any...

export default class DeepgramClient extends AbstractClient {
    // ...other methods ...
    get conversationAnalytics(): ConversationAnalyticsRestClient {
        return new ConversationAnalyticsRestClient(this.options);
    }
    // ... (keep existing content) ...
}
