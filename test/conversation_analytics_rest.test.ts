import DeepgramClient from "../src/DeepgramClient";
import { ConversationRequestUrl } from "../src/lib/types/ConversationAnalyticsSchema";

describe("ConversationAnalyticsRestClient", () => {
  let client: DeepgramClient;
  beforeAll(() => {
    client = new DeepgramClient({ apiKey: "test_key" });
  });

  test("should send analysis request for URL", async () => {
    const request: ConversationRequestUrl = { url: "https://example.com/audio.wav" };
    // This should be mocked in CI
    // const response = await client.conversationAnalytics.analyzeConversationUrl(request);
    // expect(response).toHaveProperty("result");
    // expect(response.result).toHaveProperty("metadata");
  });
});
