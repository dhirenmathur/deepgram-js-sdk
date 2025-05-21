import { AbstractClient } from "./AbstractClient";
import { ConversationLiveClient } from "./ConversationLiveClient";
import { ConversationRestClient } from "./ConversationRestClient";
import { ConversationSchema } from "../lib/types";

/**
 * The `ConversationClient` class extends the `AbstractClient` class and provides access to the Deepgram Conversation Analytics API.
 *
 * This client provides methods to access both the REST-based conversation analytics API and the streaming conversation analytics API.
 */
export class ConversationClient extends AbstractClient {
  public namespace: string = "conversation";

  /**
   * Returns a new instance of the `ConversationRestClient`, which provides access to the Deepgram API's conversation analytics functionality.
   *
   * @returns {ConversationRestClient} A new instance of the ConversationRestClient.
   */
  get rest(): ConversationRestClient {
    return new ConversationRestClient(this.options);
  }

  /**
   * Creates a new instance of the `ConversationLiveClient`, which provides access to the Deepgram API's streaming conversation analytics functionality.
   *
   * @param options - Optional conversation analytics options to use for the streaming client.
   * @param endpoint - Optional endpoint to connect to for streaming conversation analytics.
   * @returns {ConversationLiveClient} A new instance of the ConversationLiveClient.
   */
  public live(
    options: ConversationSchema = {},
    endpoint = ":version/analyze/conversation/stream"
  ): ConversationLiveClient {
    return new ConversationLiveClient(this.options, options, endpoint);
  }
}