import { DeepgramVersionError } from "./lib/errors";
import {
  AbstractClient,
  AgentLiveClient,
  AnalyticsClient,
  AuthRestClient,
  ListenClient,
  ManageClient,
  ReadClient,
  OnPremClient,
  SelfHostedRestClient,
  SpeakClient,
  ModelsRestClient,
} from "./packages";

import type {
  DeepgramClientOptions,
  SpeakLiveSchema,
  LiveSchema,
  PrerecordedSchema,
  SpeakSchema,
  ReadSchema,
  AnalyzeSchema,
  CreateProjectKeySchema,
  CreateProjectKeyResponse,
  GetAllProjectsResponse,
  GetProjectResponse,
  UpdateProjectSchema,
  UpdateProjectResponse,
  DeleteProjectResponse,
  GetProjectBalancesResponse,
  CreateProjectInviteSchema,
  CreateProjectInviteResponse,
  GetProjectInvitesResponse,
  DeleteProjectInviteResponse,
  GetProjectMembersResponse,
  RemoveProjectMemberResponse,
  UpdateProjectMemberScopeSchema,
  UpdateProjectMemberScopeResponse,
  GetAllProjectKeysResponse,
  GetProjectKeyResponse,
  DeleteProjectKeyResponse,
  UpdateProjectKeySchema,
  UpdateProjectKeyResponse,
  GetAllModelsResponse,
  GetModelResponse,
  GetUsageRequestsResponse,
  GetUsageRequestResponse,
  GetUsageSummaryResponse,
  GetUsageFieldsResponse,
  GetTokenBalancesResponse,
  CreateOnPremCredentialsSchema,
  CreateOnPremCredentialsResponse,
  GetOnPremCredentialsResponse,
  UpdateOnPremCredentialsSchema,
  UpdateOnPremCredentialsResponse,
  DeleteOnPremCredentialsResponse,
  GetAllOnPremCredentialsResponse,
  AuthRestClientOptions,
} from "./lib/types";

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
   * Returns a new instance of the AnalyticsClient, which provides access to 
   * Deepgram's Conversation Analytics functionality.
   *
   * @returns {AnalyticsClient} A new instance of the AnalyticsClient.
   * @beta This feature is in beta and may change in future versions.
   * @example
   * ```typescript
   * // Analyze prerecorded conversation
   * const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl({
   *   url: "https://example.com/conversation.wav"
   * }, {
   *   detect_speakers: true,
   *   extract_action_items: true
   * });
   * 
   * // Real-time analytics
   * const live = deepgram.analytics.live({ detect_speakers: true });
   * live.start();
   * ```
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
   * Returns a new instance of the ManageClient, which provides access to the Deepgram API's management functionality.
   *
   * @returns {ManageClient} A new instance of the ManageClient.
   */
  get manage(): ManageClient {
    return new ManageClient(this.options);
  }

  /**
   * Returns a new instance of the OnPremClient, which provides access to the Deepgram API's on-premise functionality.
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
}