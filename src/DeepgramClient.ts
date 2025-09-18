import {
  DEFAULT_OPTIONS,
  AbstractClient,
  AgentLiveClient,
  AuthRestClient,
  ConversationAnalyticsClient,
  ListenClient,
  ManageClient,
  ReadClient,
  SpeakClient,
  isDeepgramClientOptions,
  isLiveConfigOptions,
} from "./lib/types";
import type { DeepgramClientOptions } from "./lib/types";

/**
 * The DeepgramClient class extends AbstractClient and provides access to various
 * features of the Deepgram API, including speech-to-text, text-to-speech, and user
 * management.
 */
export default class DeepgramClient extends AbstractClient {
  /**
   * Constructs a new DeepgramClient instance.
   *
   * @param options - The Deepgram client options to use for the client instance. This includes the API key and global configuration options for the client.
   */
  constructor(options?: DeepgramClientOptions | string) {
    if (typeof options === "string") {
      options = { key: options };
    }

    if (!options) {
      options = {};
    }

    if (!isDeepgramClientOptions(options)) {
      throw new Error("Invalid client options");
    }

    options = { ...DEFAULT_OPTIONS, ...options };

    super(options);
  }

  /**
   * Returns a new instance of the ListenClient, which provides access to Deepgram's speech-to-text features.
   *
   * @returns {ListenClient} A new instance of the ListenClient.
   */
  get listen(): ListenClient {
    return new ListenClient(this.options);
  }

  /**
   * Returns a new instance of the ManageClient, which provides access to Deepgram's project management features.
   *
   * @returns {ManageClient} A new instance of the ManageClient.
   */
  get manage(): ManageClient {
    return new ManageClient(this.options);
  }

  /**
   * Returns a new instance of the ReadClient, which provides access to Deepgram's text intelligence features.
   *
   * @returns {ReadClient} A new instance of the ReadClient.
   */
  get read(): ReadClient {
    return new ReadClient(this.options);
  }

  /**
   * Returns a new instance of the SpeakClient, which provides access to Deepgram's text-to-speech features.
   *
   * @returns {SpeakClient} A new instance of the SpeakClient.
   */
  get speak(): SpeakClient {
    return new SpeakClient(this.options);
  }

  /**
   * Returns a new instance of the ConversationAnalyticsClient for conversation analysis APIs.
   *
   * @returns {ConversationAnalyticsClient} A new instance of the ConversationAnalyticsClient.
   */
  get conversation(): ConversationAnalyticsClient {
    return new ConversationAnalyticsClient(this.options);
  }

  /**
   * Returns a new instance of the AgentLiveClient, which provides access to Deepgram's Voice Agent API.
   *
   * @param options - Optional configuration options for the Voice Agent client.
   * @param endpoint - Optional WebSocket endpoint URL. Defaults to ":version/agent".
   * @returns {AgentLiveClient} A new instance of the AgentLiveClient.
   * @deprecated Use `client.speak.live` or a dedicated agent client instead. This method will be removed in a future version.
   * @example
   * ```typescript
   * // Current usage (deprecated)
   * const agent = client.agent;
   * 
   * // Recommended usage
   * const agent = client.speak.live;
   * ```
   */
  agent(
    options: DeepgramClientOptions | {} = {},
    endpoint: string = ":version/agent"
  ): AgentLiveClient {
    return new AgentLiveClient(this.v(1).options, options, endpoint);
  }
}