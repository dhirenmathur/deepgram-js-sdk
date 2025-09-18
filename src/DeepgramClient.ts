import { DeepgramClientOptions, DeepgramVersionError, isDeepgramError } from "./lib";
import { AbstractClient } from "./packages";
import {
  ListenClient,
  ManageClient,
  ReadClient,
  OnPremClient,
  SelfHostedRestClient,
  AnalyzeClient,
  SpeakClient,
  ModelsRestClient,
} from "./packages";

/**
 * The DeepgramClient class provides access to the Deepgram API.
 * It extends the AbstractClient class and provides methods for accessing the various API endpoints.
 * The class is initialized with the API key and options for the client.
 * The options include the global options for the client and the fetch options for the requests.
 *
 * @example
 * ```typescript
 * import { createClient } from "@deepgram/sdk";
 *
 * const deepgram = createClient(DEEPGRAM_API_KEY, {
 *   global: { url: "https://api.beta.deepgram.com" },
 * });
 *
 * const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
 *   {
 *     url: "https://dpgr.am/spacewalk.wav",
 *   },
 *   {
 *     model: "nova",
 *   }
 * );
 * ```
 */
export default class DeepgramClient extends AbstractClient {
  /**
   * Returns a new instance of the AnalyzeClient, which provides access to conversation analytics functionality.
   *
   * @returns {AnalyzeClient} A new instance of the AnalyzeClient.
   */
  get analyze(): AnalyzeClient {
    return new AnalyzeClient(this.options);
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
   * Returns a new instance of the OnPremClient, which provides access to the Deepgram API's on-premises functionality.
   *
   * @returns {OnPremClient} A new instance of the OnPremClient.
   */
  get onprem(): OnPremClient {
    return new OnPremClient(this.options);
  }

  /**
   * Returns a new instance of the SelfHostedRestClient, which provides access to the Deepgram API's self-hosted functionality.
   *
   * @returns {SelfHostedRestClient} A new instance of the SelfHostedRestClient.
   */
  get selfhosted(): SelfHostedRestClient {
    return new SelfHostedRestClient(this.options);
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
   * Returns a new instance of the ModelsRestClient, which provides access to the Deepgram API's model information functionality.
   *
   * @returns {ModelsRestClient} A new instance of the ModelsRestClient.
   */
  get models(): ModelsRestClient {
    return new ModelsRestClient(this.options);
  }
}