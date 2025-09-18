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
   * Returns a new instance of the ConversationClient, which provides access to conversation analytics functionality.
   *
   * @returns {ConversationClient} A new instance of the ConversationClient.
   * @beta
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
   * Returns a new instance of the OnPremClient, which provides access to the Deepgram API's on-premises functionality.
   * @deprecated Use `SelfHostedRestClient` instead.
   * @returns {OnPremClient} A new instance of the OnPremClient.
   */
  get onprem(): OnPremClient {
    return new OnPremClient(this.options);
  }

  /**
   * Returns a new instance of the ReadClient, which provides access to the Deepgram API's read functionality.
   *
   * @returns {ReadClient} A new instance of the ReadClient.
   */
  get read(): ReadClient {
    return new ReadClient(this.options);
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
   * Returns a new instance of the SpeakClient, which provides access to the Deepgram API's text-to-speech functionality.
   *
   * @returns {SpeakClient} A new instance of the SpeakClient.
   */
  get speak(): SpeakClient {
    return new SpeakClient(this.options);
  }

  /**
   * Returns a new instance of the ModelsRestClient, which provides access to the Deepgram API's models endpoint.
   *
   * @returns {ModelsRestClient} A new instance of the ModelsRestClient.
   * @beta
   */
  get models(): ModelsRestClient {
    return new ModelsRestClient(this.options);
  }

  /**
   * An alias for the agent (Agent Live API).
   * @returns {AgentLiveClient} A new instance of the AgentLiveClient.
   * @experimental
   */
  get agent(): AgentLiveClient {
    throw new DeepgramVersionError();
  }
}