import { DeepgramVersionError } from "./lib/errors";
import {
  AbstractClient,
  AgentLiveClient,
  AnalyticsClient,
  AuthRestClient,
  ListenClient,
  ManageClient,
  SpeakClient,
} from "./packages";
import type { DeepgramClientOptions } from "./lib/types";

/**
 * The Deepgram Client.
 *
 * An isomorphic client for interacting with the Deepgram API.
 * @example
 * ```typescript
 * import { createClient } from "@deepgram/sdk";
 * // - or -
 * // import { DeepgramClient } from "@deepgram/sdk";
 *
 * const deepgram = createClient({
 *   key: "DEEPGRAM_API_KEY",
 * });
 * // - or -
 * // const deepgram = new DeepgramClient({
 * //   key: "DEEPGRAM_API_KEY",
 * // });
 * ```
 */
export class DeepgramClient extends AbstractClient {
  /**
   * Returns a new instance of the AuthRestClient, which provides access to the Deepgram API's authentication functionality.
   *
   * @returns {AuthRestClient} A new instance of the AuthRestClient.
   */
  get auth(): AuthRestClient {
    return new AuthRestClient(this.options);
  }
  
  /**
   * Returns a new instance of the AnalyticsClient, which provides access to the Deepgram API's conversation analytics functionality.
   *
   * @returns {AnalyticsClient} A new instance of the AnalyticsClient.
   */
  get analytics(): AnalyticsClient {
    return new AnalyticsClient(this.options);
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
   * Returns a new instance of the ManageClient, which provides access to the Deepgram API's manage functionality.
   *
   * @returns {ManageClient} A new instance of the ManageClient.
   */
  get manage(): ManageClient {
    return new ManageClient(this.options);
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
   * Agent client for interacting with Deepgram's agent functionality.
   * Returns a new instance of the AgentLiveClient.
   * 
   * @param options Additional options for the agent client
   * @param endpoint WebSocket endpoint for the agent connection
   * @returns {AgentLiveClient} A new instance of the AgentLiveClient
   */
  public agent(options = {}, endpoint = ":version/agent"): AgentLiveClient {
    return new AgentLiveClient(this.options, options, endpoint);
  }

  constructor(options: DeepgramClientOptions) {
    if (!options.key) {
      throw new DeepgramVersionError("Deepgram API Key is required");
    }

    super(options);
  }
}