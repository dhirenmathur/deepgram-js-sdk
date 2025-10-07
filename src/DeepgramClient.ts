import { AbstractClient } from "./packages/AbstractClient";
import { AgentLiveClient } from "./packages/AgentLiveClient";
import { ListenClient } from "./packages/ListenClient";
import { ManageClient } from "./packages/ManageClient";
import {
  OnPremClient,
  SelfHostedRestClient,
  SpeakClient,
  ModelsRestClient,
  AnalyticsClient,
} from "./packages";

/**
 * The Deepgram Client.
 *
 * An isomorphic Javascript client for interacting with the Deepgram API.
 * @example
 * ```typescript
 * import { createClient } from "@deepgram/sdk";
 *
 * const deepgram = createClient(DEEPGRAM_API_KEY, DEEPGRAM_PROJECT_ID);
 *
 * const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
 *   {
 *     url: "https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav",
 *   },
 *   {
 *     model: "nova-2",
 *     smart_format: true,
 *   }
 * );
 * ```
 */
export default class DeepgramClient extends AbstractClient {
  /**
   * Returns a new instance of the ListenClient, which provides access to the Deepgram's transcription API.
   *
   * @returns {ListenClient} A new instance of the ListenClient.
   */
  get listen(): ListenClient {
    return new ListenClient(this.options);
  }

  /**
   * Returns a new instance of the ManageClient, which provides access to the Deepgram's management API.
   *
   * @returns {ManageClient} A new instance of the ManageClient.
   */
  get manage(): ManageClient {
    return new ManageClient(this.options);
  }

  /**
   * Returns a new instance of the OnPremClient, which provides access to the Deepgram's on-premises API.
   *
   * @returns {OnPremClient} A new instance of the OnPremClient.
   */
  get onprem(): OnPremClient {
    return new OnPremClient(this.options);
  }

  /**
   * Returns a new instance of the OnPremClient, which provides access to the Deepgram's on-premises API.
   *
   * Alias for the `onprem` property.
   *
   * @returns {OnPremClient} A new instance of the OnPremClient.
   */
  get selfhosted(): SelfHostedRestClient {
    return new SelfHostedRestClient(this.options);
  }

  /**
   * Returns a new instance of the SpeakClient, which provides access to Deepgram's text-to-speech API.
   *
   * @returns {SpeakClient} A new instance of the SpeakClient.
   */
  get speak(): SpeakClient {
    return new SpeakClient(this.options);
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
   * Returns a new instance of the AgentLiveClient, which provides access to Deepgram's Voice Agent API.
   *
   * @returns {AgentLiveClient} A new instance of the AgentLiveClient.
   */
  get agent(): AgentLiveClient {
    return new AgentLiveClient(this.options);
  }

  /**
   * Returns a new instance of the ModelsRestClient, which provides access to the Deepgram's models API.
   *
   * @returns {ModelsRestClient} A new instance of the ModelsRestClient.
   */
  get models(): ModelsRestClient {
    return new ModelsRestClient(this.options);
  }
}