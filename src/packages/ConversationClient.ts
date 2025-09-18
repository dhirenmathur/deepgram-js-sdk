import { ConversationRestClient } from './ConversationRestClient';
import { ConversationLiveClient } from './ConversationLiveClient';

/**
 * Facade client for Deepgram Conversation Analytics (REST + Streaming).
 */
export class ConversationClient {
  public readonly rest: ConversationRestClient;
  public readonly live: ConversationLiveClient;

  constructor(auth: string) {
    this.rest = new ConversationRestClient(auth);
    this.live = new ConversationLiveClient(auth);
  }
}
