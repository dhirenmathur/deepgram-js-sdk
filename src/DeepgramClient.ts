import { DeepgramVersionError } from "./lib/errors";
import {
  AbstractClient,
  AgentLiveClient,
  AuthRestClient,
  ConversationClient,
  ListenClient,
  ManageClient,
  ReadClient,
  OnPremClient,
  SelfHostedRestClient,
  SpeakClient,
  ModelsRestClient,
} from "./packages";
import type { DeepgramClientOptions } from "./lib/types";

/**
 * Main Deepgram client class providing access to various API endpoints.
 *
 * This client provides organized access to Deepgram's APIs:
 *
 * - **Authentication**: Temporary key generation and authentication
 * - **Audio Intelligence**: Conversation analytics and insights
 * - **Transcription**: Speech-to-text processing and real-time streaming
 * - **Synthesis**: Text-to-speech generation
 * - **Management**: Account and project management
 * - **Self-Hosted**: On-premises deployment support
 *
 * The DeepgramClient class provides access to various Deepgram API clients, including ListenClient, ManageClient, SelfHostedRestClient, ReadClient, and SpeakClient.
 *
 * @see https://github.com/deepgram/deepgram-js-sdk
 */
export default class DeepgramClient extends AbstractClient {
  /**
   * Returns a new instance of the AuthRestClient, which provides access to the Deepgram API's temporary token endpoints.
   *
   * @returns {AuthRestClient} A new instance of the AuthRestClient.
   * @see https://developers.deepgram.com/reference/token-based-auth-api/grant-token
   */
  get auth(): AuthRestClient {
    return new AuthRestClient(this.options);
  }

  /**
   * Returns a new instance of the ConversationClient, which provides access to the Deepgram Conversation Analytics API.
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
   * Returns a new instance of the ManageClient, which provides access to the Deepgram API's management functionality.
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
   * @deprecated Use `selfHosted` instead.
   */
  get onprem(): OnPremClient {
    return new OnPremClient(this.options);
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
   * Returns a new instance of the SelfHostedRestClient, which provides access to the Deepgram's self-hosted API.
   *
   * @returns {SelfHostedRestClient} A new instance of the SelfHostedRestClient.
   */
  get selfHosted(): SelfHostedRestClient {
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
   * Returns a new instance of the ModelsClient, which provides access to the models.
   *
   * @returns {ModelsRestClient} A new instance of the ModelsRestClient.
   */
  get models(): ModelsRestClient {
    return new ModelsRestClient(this.options);
  }

  public constructor(apiKey?: string, options?: DeepgramClientOptions | string) {
    // call the parent constructor, which will handle the argument parsing and validation
    super(apiKey, options);

    // check minimum supported version
    this.checkVersion();
  }

  private checkVersion(): void {
    // if no `globalThis` support (ie. not nodejs 12+ or not modern browser), then fail
    if (!globalThis?.process?.versions?.node) {
      return;
    }

    const version = globalThis.process.versions.node;
    const major = parseInt(version.split(".")[0]);

    if (major < 18) {
      throw new DeepgramVersionError();
    }
  }
}