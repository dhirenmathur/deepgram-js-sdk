import { ConversationAnalyticsRestClient } from "../src/packages/ConversationAnalyticsRestClient";
import { DeepgramError } from "../src/lib/errors";
import type { 
  ConversationAnalyticsSchema,
  ConversationResponse,
  AsyncConversationResponse
} from "../src/lib/types";

describe("ConversationAnalyticsRestClient", () => {
  let client: ConversationAnalyticsRestClient;

  beforeEach(() => {
    client = new ConversationAnalyticsRestClient({
      key: "test-api-key",
    });
  });

  describe("analyzeUrl", () => {
    it("should analyze conversation from URL with default options", async () => {
      const source = { url: "https://example.com/audio.wav" };
      const mockResponse: ConversationResponse = {
        metadata: {
          request_id: "test-request-id",
          conversation_id: "test-conversation-id",
          created: "2023-01-01T00:00:00Z",
          duration: 120.5,
          channels: 2,
          num_speakers: 2,
          language: "en",
          models: ["conversation-analytics-v1"],
          model_info: {
            "conversation-analytics-v1": { name: "Conversation Analytics", version: "1.0" }
          }
        },
        results: {
          speakers: [],
          dynamics: {
            total_talk_time: 100.0,
            silence_percentage: 15.5,
            overlap_percentage: 5.0,
            turn_taking_frequency: 0.25,
            interruptions_total: 3,
            engagement_score: 0.85,
            dominant_speaker_percentage: 65.0
          }
        }
      };

      // Mock the post method
      jest.spyOn(client as any, "post").mockResolvedValue({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.analyzeUrl(source);
      
      expect(result.error).toBeNull();
      expect(result.result).toEqual(mockResponse);
    });

    it("should handle speaker detection options", async () => {
      const source = { url: "https://example.com/audio.wav" };
      const options: ConversationAnalyticsSchema = {
        detect_speakers: true,
        min_speakers: 2,
        max_speakers: 4,
        speaker_labels: ["Customer", "Agent"]
      };

      jest.spyOn(client as any, "post").mockResolvedValue({
        json: () => Promise.resolve({})
      });
      jest.spyOn(client as any, "getRequestUrl").mockReturnValue(new URL("https://api.deepgram.com/v1/analyze/conversation"));

      await client.analyzeUrl(source, options);
      
      expect(client.getRequestUrl).toHaveBeenCalledWith(":version/analyze/conversation", {}, { ...{}, ...options });
    });

    it("should reject callback options for synchronous analysis", async () => {
      const source = { url: "https://example.com/audio.wav" };
      const options: ConversationAnalyticsSchema = {
        callback: "https://example.com/callback"
      };

      const result = await client.analyzeUrl(source, options);
      
      expect(result.error).toBeInstanceOf(DeepgramError);
      expect(result.error?.message).toContain("Callback cannot be provided");
    });
  });

  describe("analyzeFile", () => {
    it("should analyze conversation from audio file", async () => {
      const source = Buffer.from("fake audio data");
      
      jest.spyOn(client as any, "post").mockResolvedValue({
        json: () => Promise.resolve({})
      });

      const result = await client.analyzeFile(source);
      
      expect(result.error).toBeNull();
      expect(client.post).toHaveBeenCalledWith(
        expect.any(URL),
        source,
        { headers: { "Content-Type": "deepgram/audio+video" } }
      );
    });
  });

  describe("getAnalysis", () => {
    it("should retrieve analysis by conversation ID", async () => {
      const conversationId = "test-conversation-id";
      
      jest.spyOn(client as any, "get").mockResolvedValue({
        json: () => Promise.resolve({})
      });
      jest.spyOn(client as any, "getRequestUrl").mockReturnValue(new URL("https://api.deepgram.com/v1/analyze/conversation/test-conversation-id"));

      await client.getAnalysis(conversationId);
      
      expect(client.getRequestUrl).toHaveBeenCalledWith(":version/analyze/conversation/test-conversation-id", {}, {});
    });
  });

  describe("analyzeUrlCallback", () => {
    it("should handle async callback analysis", async () => {
      const source = { url: "https://example.com/audio.wav" };
      const callback = new URL("https://example.com/callback");
      const mockResponse: AsyncConversationResponse = {
        request_id: "test-request-id",
        conversation_id: "test-conversation-id"
      };

      jest.spyOn(client as any, "post").mockResolvedValue({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await client.analyzeUrlCallback(source, callback);
      
      expect(result.error).toBeNull();
      expect(result.result).toEqual(mockResponse);
    });
  });
});