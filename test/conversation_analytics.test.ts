import { DeepgramClient } from '../src/DeepgramClient';
import { ConversationRequestUrl, ConversationResponse } from '../src/lib/types/ConversationAnalytics/ConversationAnalyticsTypes';

// Mock fetch or wire up a test key/environment as needed for real-world tests
describe('ConversationAnalyticsRestClient', () => {
  const client = new DeepgramClient({ apiKey: 'dg_test_apikey' });

  it('analyzes a conversation by URL', async () => {
    // (Assume API mock or nock used here)
    const params: ConversationRequestUrl = { url: 'https://example.com/audio.wav' };
    const resp = await client.conversationAnalytics.rest.analyzeConversationUrl(params);
    expect(resp).toHaveProperty('analysis');
  });

  it('fetches previous analysis', async () => {
    // (Mock/fake conversation id here)
    const convId = 'fake-conv-id';
    const resp = await client.conversationAnalytics.rest.getConversationAnalysis(convId);
    expect(resp).toHaveProperty('conversation_id');
  });

  it('throws on invalid payload', async () => {
    await expect(client.conversationAnalytics.rest.analyzeConversationUrl({} as any))
      .rejects.toThrow();
  });
});

// LiveClient streaming integration would require WebSocket mock or e2e environment.
// Pseudo-test:
describe('ConversationAnalyticsLiveClient', () => {
  it('establishes a WebSocket connection', () => {
    // Should attempt to connect to /v1/analyze/conversation/stream
    // ... mock WebSocket, assert connection/eventing
  });
});
