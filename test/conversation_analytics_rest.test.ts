import DeepgramClient from "../src/DeepgramClient";

describe("ConversationAnalyticsRestClient", () => {
  it("should instantiate and have analyzeConversation method", () => {
    const dg = new DeepgramClient({ apiKey: "test" });
    expect(typeof dg.conversationAnalytics.analyzeConversation).toBe("function");
  });
});
