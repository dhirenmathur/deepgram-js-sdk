import { AbstractClient } from "./AbstractClient";
import { ConversationRestClient } from "./ConversationRestClient";
import { ConversationLiveClient } from "./ConversationLiveClient";
import { ConversationAnalyzeSchema } from "../lib/types";

/**
 * The `ConversationClient` class extends the `AbstractClient` class and provides access to the "conversation" namespace.
 * It exposes methods for both synchronous/asynchronous analysis and real-time streaming conversation analytics.
 *
 * Usage:
 * - `analyze`: Returns a `ConversationRestClient` instance for REST-based conversation analysis
 * - `stream()`: Returns a `ConversationLiveClient` instance for real-time streaming analysis
 */
export class ConversationClient extends AbstractClient {
  public namespace: string = "conversation";

  /**
   * Returns a `ConversationRestClient` instance for REST-based conversation analysis.
   * Supports both synchronous and asynchronous (callback-based) analysis operations.
   */
  get analyze() {
    return new ConversationRestClient(this.options);
  }

  /**
   * Returns a `ConversationLiveClient` instance for real-time streaming conversation analysis.
   * 
   * @param analysisOptions - Optional conversation analysis configuration options.
   * @param endpoint - The WebSocket endpoint to connect to. Defaults to ":version/analyze/conversation/stream".
   * @returns A `ConversationLiveClient` instance for real-time conversation analysis.
   */
  public stream(
    analysisOptions: ConversationAnalyzeSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ): ConversationLiveClient {
    return new ConversationLiveClient(this.options, analysisOptions, endpoint);
  }
}