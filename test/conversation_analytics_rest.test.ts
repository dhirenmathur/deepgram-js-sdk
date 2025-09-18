import { describe, test, expect, vi, beforeEach } from "vitest";
import { ConversationAnalyticsRestClient } from "../src/packages/ConversationAnalyticsRestClient";
import { DeepgramError } from "../src/lib/errors";

describe("ConversationAnalyticsRestClient", () => {
  let client: ConversationAnalyticsRestClient;
  const mockOptions = {
    global: { url: "https://api.deepgram.com" },
    key: "test-key"
  };

  beforeEach(() => {
    client = new ConversationAnalyticsRestClient(mockOptions as any);
  });

  describe("analyzeUrl", () => {
    test("should analyze conversation from URL with default options", async () => {
      const mockPost = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
          metadata: { conversation_id: "test-123", request_id: "req-123" },
          results: { speakers: [], dynamics: {} }
        })
      });
      client.post = mockPost;

      const result = await client.analyzeUrl({ url: "http://example.com/audio.mp3" });

      expect(result.error).toBeNull();
      expect(result.result?.metadata.conversation_id).toBe("test-123");
      expect(mockPost).toHaveBeenCalledWith(
        expect.any(URL),
        JSON.stringify({ url: "http://example.com/audio.mp3" }),
        expect.objectContaining({
          headers: { "Content-Type": "application/json" }
        })
      );
    });

    test("should handle all analytics parameters", async () => {
      const mockPost = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ metadata: {}, results: {} })
      });
      client.post = mockPost;
      client.getRequestUrl = vi.fn().mockReturnValue(new URL("http://test.com"));

      const options = {
        detect_speakers: true,
        min_speakers: 2,
        max_speakers: 5,
        extract_action_items: true,
        detect_sentiment: true,
        language: "en"
      };

      await client.analyzeUrl({ url: "http://example.com/audio.mp3" }, options);

      expect(client.getRequestUrl).toHaveBeenCalledWith(
        ":version/analyze/conversation",
        {},
        options
      );
    });

    test("should throw error when callback provided in synchronous mode", async () => {
      const result = await client.analyzeUrl(
        { url: "http://example.com/audio.mp3" },
        { callback: "http://callback.com" } as any
      );

      expect(result.error).toBeInstanceOf(DeepgramError);
      expect(result.error?.message).toContain("Use `analyzeUrlCallback` instead");
    });
  });

  describe("analyzeFile", () => {
    test("should analyze conversation from file", async () => {
      const mockPost = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
          metadata: { conversation_id: "test-file-123" },
          results: {}
        })
      });
      client.post = mockPost;

      const fileBuffer = Buffer.from("fake audio data");
      const result = await client.analyzeFile(fileBuffer);

      expect(result.error).toBeNull();
      expect(mockPost).toHaveBeenCalledWith(
        expect.any(URL),
        fileBuffer,
        expect.objectContaining({
          headers: { "Content-Type": "audio/*" }
        })
      );
    });
  });

  describe("getAnalysis", () => {
    test("should retrieve analysis by conversation ID", async () => {
      const mockGet = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
          metadata: { conversation_id: "conv-123" },
          results: { speakers: [{ speaker_id: 0, talk_time: 60 }] }
        })
      });
      client.get = mockGet;
      client.getRequestUrl = vi.fn().mockReturnValue(new URL("http://test.com"));

      const result = await client.getAnalysis("conv-123");

      expect(result.error).toBeNull();
      expect(result.result?.metadata.conversation_id).toBe("conv-123");
      expect(client.getRequestUrl).toHaveBeenCalledWith(
        ":version/analyze/conversation/conv-123",
        {},
        {}
      );
    });

    test("should handle invalid conversation ID", async () => {
      const result = await client.getAnalysis("");

      expect(result.error).toBeInstanceOf(DeepgramError);
      expect(result.error?.message).toContain("Invalid conversation ID");
    });
  });

  describe("callback methods", () => {
    test("should handle async analysis with callback", async () => {
      const mockPost = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
          request_id: "async-req-123",
          conversation_id: "async-conv-123"
        })
      });
      client.post = mockPost;
      client.getRequestUrl = vi.fn().mockReturnValue(new URL("http://test.com"));

      const result = await client.analyzeUrlCallback(
        { url: "http://example.com/audio.mp3" },
        new URL("http://callback.com")
      );

      expect(result.error).toBeNull();
      expect(result.result?.request_id).toBe("async-req-123");
    });
  });
});