import { DeepgramVersionError } from "./lib/errors";
import {
  AbstractClient,
  AgentLiveClient,
  AuthRestClient,
  ConversationClient,
  ListenClient,
  ManageClient,
  ReadClient,
  SpeakClient,
} from "./packages";
import type { DeepgramClientOptions } from "./lib/types";

/**
 * The DeepgramClient class provides access to the Deepgram API.
 * It's the main entry point for interacting with Deepgram's various services.
 */
export default class DeepgramClient extends AbstractClient {
  /**
   * @param {string} apiKey - The API key for the Deepgram API.
   * @param {DeepgramClientOptions} options - The options for the Deepgram API client.
   */
  constructor(apiKey: string, options?: DeepgramClientOptions) {
    if (!apiKey || typeof apiKey !== "string") {
      throw new DeepgramVersionError("A deepgram API key is required");
    }

    super(apiKey, options);
  }

  /**
   * Returns a new instance of the AuthRestClient, which provides access to the Deepgram authentication API.
   *
   * @returns {AuthRestClient} A new instance of the AuthRestClient.
   */
  get auth(): AuthRestClient {
    return new AuthRestClient(this.options);
  }

  /**
   * Returns a new instance of the ConversationClient, which provides access to the Deepgram API's conversation analytics functionality.
   *
   * @returns {ConversationClient} A new instance of the ConversationClient.
   */
  get conversation(): ConversationClient {
    return new ConversationClient(this.options);
  }

  /**
   * Returns a new instance of the ListenClient, which provides access to the Deepgram API's listening functionality.
   *
   * @returns {ListenClient} A new instance of the ListenClient.
   */
  get listen(): ListenClient {
    return new ListenClient(this.options);
  }

  /**
   * Returns a new instance of the ManageClient, which provides access to the Deepgram API's project management functionality.
   *
   * @returns {ManageClient} A new instance of the ManageClient.
   */
  get manage(): ManageClient {
    return new ManageClient(this.options);
  }

  /**
   * Returns a new instance of the ReadClient, which provides access to the Deepgram API's reading functionality.
   *
   * @returns {ReadClient} A new instance of the ReadClient.
   */
  get read(): ReadClient {
    return new ReadClient(this.options);
  }

  /**
   * Returns a new instance of the SpeakClient, which provides access to the Deepgram API's speaking functionality.
   *
   * @returns {SpeakClient} A new instance of the SpeakClient.
   */
  get speak(): SpeakClient {
    return new SpeakClient(this.options);
  }

  /**
   * Returns a new instance of the AgentLiveClient, which provides access to the Agent AI functionality.
   *
   * @returns {AgentLiveClient} A new instance of the AgentLiveClient.
   */
  agent(): AgentLiveClient {
    return new AgentLiveClient(this.options);
  }
}