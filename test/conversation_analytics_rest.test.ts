import DeepgramClient from '../src/DeepgramClient';

describe('ConversationAnalyticsRestClient', () => {
  const dg = new DeepgramClient({ key: 'test-key' });
  const client = dg.conversationAnalytics;

  it('should have analyzeConversation, streamConversationAnalysis, getConversationAnalysis methods', () => {
    expect(typeof client.analyzeConversation).toBe('function');
    expect(typeof client.streamConversationAnalysis).toBe('function');
    expect(typeof client.getConversationAnalysis).toBe('function');
  });

  // Integration tests would require a real API key and audio input
});
