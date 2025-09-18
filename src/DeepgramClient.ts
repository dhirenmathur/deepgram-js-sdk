import { ConversationAnalyticsRestClient } from './packages/ConversationAnalyticsRestClient';
// ... (assume all previous imports remain, so actual content should be merged with prior code)

export class DeepgramClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(options: { apiKey: string; baseUrl?: string }) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || 'https://api.deepgram.com';
  }

  /**
   * Access Conversation Analytics client
   */
  private _conversationAnalytics?: ConversationAnalyticsRestClient;
  public get conversationAnalytics(): ConversationAnalyticsRestClient {
    if (!this._conversationAnalytics) {
      this._conversationAnalytics = new ConversationAnalyticsRestClient(
        this.baseUrl,
        this.apiKey
      );
    }
    return this._conversationAnalytics;
  }

  // ... (rest of DeepgramClient logic remains unchanged)
}
