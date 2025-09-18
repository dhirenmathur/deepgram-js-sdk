import { AbstractClient } from "./AbstractClient";
import { AnalyticsRestClient } from "./AnalyticsRestClient";
import { AnalyticsLiveClient } from "./AnalyticsLiveClient";
import { ConversationAnalyticsSchema } from "../lib/types";

/**
 * The AnalyticsClient provides access to Deepgram's Conversation Analytics API.
 * It enables analysis of conversation dynamics, participant engagement, and extraction
 * of action items in real-time or from recorded conversations.
 * 
 * @example
 * ```typescript
 * const deepgram = createClient("your-api-key");
 * 
 * // Analyze prerecorded conversation
 * const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl({
 *   url: "https://example.com/conversation.wav"
 * }, {
 *   detect_speakers: true,
 *   measure_engagement: true,
 *   extract_action_items: true
 * });
 * 
 * // Real-time conversation analysis
 * const live = deepgram.analytics.live({
 *   detect_speakers: true,
 *   detect_sentiment: true
 * });
 * 
 * live.start();
 * live.send(audioData);
 * ```
 * 
 * @beta This feature is in beta and may change in future versions.
 */
export class AnalyticsClient extends AbstractClient {
  public namespace: string = "analytics";

  /**
   * Returns an AnalyticsRestClient instance for analyzing recorded conversations.
   * Supports both synchronous and asynchronous (callback) analysis patterns.
   * 
   * @returns {AnalyticsRestClient} A new instance of the AnalyticsRestClient.
   */
  get prerecorded(): AnalyticsRestClient {
    return new AnalyticsRestClient(this.options);
  }

  /**
   * Returns an AnalyticsLiveClient instance for real-time conversation analysis.
   * 
   * @param {ConversationAnalyticsSchema} [analysisOptions={}] - The analysis options for the live session.
   * @param {string} [endpoint=":version/analyze/conversation/stream"] - The endpoint for the live analytics API.
   * @returns {AnalyticsLiveClient} A new instance of the AnalyticsLiveClient.
   */
  public live(
    analysisOptions: ConversationAnalyticsSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ): AnalyticsLiveClient {
    return new AnalyticsLiveClient(this.options, analysisOptions, endpoint);
  }
}