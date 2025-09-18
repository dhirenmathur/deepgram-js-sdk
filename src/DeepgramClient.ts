import { DEFAULT_OPTIONS, DEFAULT_URL } from "./lib/constants";
import { isDeepgramError } from "./lib/errors";
import { appendSearchParams, convertProtocolToWs, isBrowser } from "./lib/helpers";
import type { DeepgramClientOptions, LiveSchema } from "./lib/types";
import { AbstractClient } from "./packages/AbstractClient";
import { ManageClient } from "./packages/ManageClient";
import { ListenClient } from "./packages/ListenClient";
import { ReadClient } from "./packages/ReadClient";
import { SpeakClient } from "./packages/SpeakClient";
import { ModelsRestClient } from "./packages/ModelsRestClient";
import { AnalyticsClient } from "./packages";

/**
 * Main Deepgram Client.
 *
 * An isomorphic JavaScript client for interacting with the Deepgram API.
 * @example
 * ```typescript
 * import { createClient } from "@deepgram/sdk";
 * // - or -
 * // import { DeepgramClient } from "@deepgram/sdk";
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
  constructor(key: string, options: DeepgramClientOptions = DEFAULT_OPTIONS) {
    if (!key) {
      throw new Error(
        "A deepgram API key is required. Please set it in the DEEPGRAM_API_KEY environment variable or pass it as a parameter to the DeepgramClient constructor."
      );
    }

    super(key, options);
  }

  /**
   * Returns a ManageClient instance with the provided options.
   * @example
   * ```typescript
   * const deepgram = createClient(DEEPGRAM_API_KEY);
   * const { result, error } = await deepgram.manage.getProjects();
   * ```
   * @returns {ManageClient} A ManageClient instance.
   */
  get manage(): ManageClient {
    return new ManageClient(this.options);
  }

  /**
   * Returns a ListenClient instance with the provided options.
   * @example
   * ```typescript
   * const deepgram = createClient(DEEPGRAM_API_KEY);
   * const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(...);
   * ```
   * @returns {ListenClient} A ListenClient instance.
   */
  get listen(): ListenClient {
    return new ListenClient(this.options);
  }

  /**
   * Returns a ReadClient instance with the provided options.
   * @example
   * ```typescript
   * const deepgram = createClient(DEEPGRAM_API_KEY);
   * const { result, error } = await deepgram.read.analyzeUrl(...);
   * ```
   * @returns {ReadClient} A ReadClient instance.
   */
  get read(): ReadClient {
    return new ReadClient(this.options);
  }

  /**
   * Returns a SpeakClient instance with the provided options.
   * @example
   * ```typescript
   * const deepgram = createClient(DEEPGRAM_API_KEY);
   * const { result, error } = await deepgram.speak.request(...);
   * ```
   * @returns {SpeakClient} A SpeakClient instance.
   */
  get speak(): SpeakClient {
    return new SpeakClient(this.options);
  }

  /**
   * Returns a new instance of the AnalyticsClient, which provides access to Deepgram's conversation analytics functionality.
   *
   * @returns {AnalyticsClient} A new instance of the AnalyticsClient.
   */
  get analytics(): AnalyticsClient {
    return new AnalyticsClient(this.options);
  }

  /**
   * Returns a new instance of the AgentLiveClient, which provides access to Deepgram's Voice Agent API.
   *
   * @deprecated The AgentLiveClient is deprecated and will be removed in the next major version. Use the more generic speak.live().
   * @returns {ListenLiveClient} A new instance of the ListenLiveClient.
   */
  get agents() {
    console.warn(
      "The agents namespace is deprecated and will be removed in the next major version. Use the more generic speak.live()."
    );
    return this.speak.live();
  }

  /**
   * Returns a ModelsClient instance with the provided options.
   * @example
   * ```typescript
   * const deepgram = createClient(DEEPGRAM_API_KEY);
   * const { result, error } = await deepgram.models.getAll();
   * ```
   * @returns {ModelsRestClient} A ModelsClient instance.
   */
  get models(): ModelsRestClient {
    return new ModelsRestClient(this.options);
  }
}