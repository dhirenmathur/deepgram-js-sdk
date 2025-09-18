import { ConversationLiveClient } from '../src/packages/ConversationLiveClient';

describe('ConversationLiveClient', () => {
  const mockAuth = 'apiKey123';

  it('connects and emits analysis events', async () => {
    const client = new ConversationLiveClient(mockAuth);
    // Mock ws/init logic
    // ... assert event emission ...
  });

  it('propagates streaming errors', async () => {
    const client = new ConversationLiveClient(mockAuth);
    // Simulate error from ws and ensure it bubbles
  });
});
