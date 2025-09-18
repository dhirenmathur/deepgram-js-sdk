import { AbstractClient } from "./AbstractClient";
import { ConversationLiveClient } from "./ConversationLiveClient";
import { ConversationRestClient } from "./ConversationRestClient";
import { ConversationSchema } from "../lib/types";

/**
 * The `ConversationClient` class extends the `AbstractClient` class and provides access to the "conversation" namespace.
 * It exposes two methods:
 *
 * 1. `prerecorded()`: Returns a `ConversationRestClient` instance for interacting with the conversation analytics REST API.
 * 2. `stream(conversationOptions: ConversationSchema = {}, endpoint = ":version/analyze/conversation/stream")`: Returns a `ConversationLiveClient` instance for real-time conversation analytics.
 */
export class ConversationClient extends AbstractClient {
  public namespace: string = "conversation";

  /**
   * Returns a `ConversationRestClient` instance for interacting with the conversation analytics REST API.
   */
  get prerecorded() {
    return new ConversationRestClient(this.options);
  }

  /**
   * Returns a `ConversationLiveClient` instance for real-time conversation analytics with the provided options and endpoint.
   * @param {ConversationSchema} [conversationOptions={}] - The conversation analytics options to use.
   * @param {string} [endpoint=":version/analyze/conversation/stream"] - The endpoint to use for the streaming conversation analytics API.
   * @returns {ConversationLiveClient} - A `ConversationLiveClient` instance for real-time conversation analytics.
   */
  public stream(
    conversationOptions: ConversationSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ): ConversationLiveClient {
    return new ConversationLiveClient(this.options, conversationOptions, endpoint);
  }
}