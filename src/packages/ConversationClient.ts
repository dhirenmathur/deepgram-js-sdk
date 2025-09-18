import { AbstractClient } from "./AbstractClient";
import { ConversationRestClient } from "./ConversationRestClient";
import { ConversationLiveClient } from "./ConversationLiveClient";
import type { ConversationStreamingSchema } from "../lib/types";

/**
 * The `ConversationClient` class extends the `AbstractClient` class and provides access to the Deepgram conversation analytics functionality.
 * 
 * It exposes methods for:
 * - Prerecorded conversation analysis via REST API
 * - Real-time conversation analysis via WebSocket streaming
 * 
 * This follows the same pattern as other service clients in the SDK.
 */
export class ConversationClient extends AbstractClient {
  public namespace: string = "conversation";

  /**
   * Returns a `ConversationRestClient` instance for interacting with the prerecorded conversation analysis API.
   * 
   * @returns A new instance of `ConversationRestClient` for synchronous and asynchronous conversation analysis.
   */
  get prerecorded(): ConversationRestClient {
    return new ConversationRestClient(this.options);
  }

  /**
   * Returns a `ConversationLiveClient` instance for interacting with the real-time conversation analysis API.
   * 
   * @param streamingOptions - Configuration options for the streaming session
   * @param endpoint - The WebSocket endpoint to connect to
   * @returns A new instance of `ConversationLiveClient` for real-time conversation analysis.
   */
  public live(
    streamingOptions: ConversationStreamingSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ): ConversationLiveClient {
    return new ConversationLiveClient(this.options, streamingOptions, endpoint);
  }
}