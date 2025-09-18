import { AbstractLiveClient } from './AbstractLiveClient';
import {
  ConversationAnalyticsParams,
  StreamingConversationResponse,
} from '../lib/types/ConversationAnalyticsSchemas';

/**
 * Live/Streaming WebSocket client for Real-time Conversation Analytics.
 */
export class ConversationLiveClient extends AbstractLiveClient {
  /**
   * Connects and streams audio for real-time analytics.
   * Emits analytics events as received from server.
   * @param params ConversationAnalyticsParams
   * @returns Promise that resolves when connection is established.
   */
  async connect(
    params: ConversationAnalyticsParams
  ): Promise<void> {
    const wsUrl = this.buildWsUrl('/v1/analyze/conversation/stream', params);
    await this._initiateWebSocket(wsUrl);
    // Event handling/wiring can be handled by AbstractLiveClient, emitting StreamingConversationResponse events.
  }
}
