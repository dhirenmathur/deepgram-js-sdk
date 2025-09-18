import { assert, expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";
import { CallbackUrl } from "../src/lib/helpers";
import { UrlSource } from "../src/lib/types";

describe("making conversation REST requests", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://api.mock.deepgram.com" },
    });
  });

  describe("conversation analyze", () => {
    it("should analyze conversation from URL synchronously", async () => {
      const urlSource: UrlSource = { 
        url: "https://example.com/conversation.wav" 
      };
      const { result, error } = await deepgram.conversation.analyze.analyzeUrl(
        urlSource,
        {
          detect_speakers: true,
          extract_action_items: true,
          detect_sentiment: true,
        }
      );

      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllDeepKeys(result?.metadata, [
        "request_id", 
        "conversation_id",
        "duration",
        "num_speakers"
      ]);
      assert.containsAllDeepKeys(result?.results, ["speakers", "dynamics"]);
    });

    it("should analyze conversation from file synchronously", async () => {
      const fileSource = Buffer.from("mock audio data");
      const { result, error } = await deepgram.conversation.analyze.analyzeFile(
        fileSource,
        {
          detect_speakers: true,
          detect_interruptions: true,
          measure_engagement: true,
        }
      );

      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllDeepKeys(result?.metadata, [
        "request_id", 
        "conversation_id"
      ]);
    });

    it("should analyze conversation with callback", async () => {
      const urlSource: UrlSource = { 
        url: "https://example.com/conversation.wav" 
      };
      const callback: CallbackUrl = "https://example.com/callback";

      const { result, error } = await deepgram.conversation.analyze.analyzeUrlCallback(
        urlSource,
        callback,
        {
          detect_speakers: true,
          conversation_summary: true,
        }
      );

      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllDeepKeys(result!, [
        "request_id",
        "conversation_id", 
        "status"
      ]);
      assert.equal(result?.status, "processing");
    });

    it("should retrieve analysis by conversation ID", async () => {
      const conversationId = "test-conversation-id-123";
      const { result, error } = await deepgram.conversation.analyze.getAnalysis(
        conversationId
      );

      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllDeepKeys(result?.metadata, [
        "conversation_id",
        "request_id"
      ]);
      assert.equal(result?.metadata.conversation_id, conversationId);
    });

    it("should reject callback in synchronous options", async () => {
      const urlSource: UrlSource = { 
        url: "https://example.com/conversation.wav" 
      };

      const { result, error } = await deepgram.conversation.analyze.analyzeUrl(
        urlSource,
        {
          callback: "https://example.com/callback",
          detect_speakers: true,
        } as any
      );

      assert.isNull(result);
      assert.isNotNull(error);
      assert.include(error?.message, "Callback cannot be provided");
    });

    it("should handle unknown source type", async () => {
      const invalidSource = { unknown: "type" } as any;

      const { result, error } = await deepgram.conversation.analyze.analyzeUrl(
        invalidSource
      );

      assert.isNull(result);
      assert.isNotNull(error);
      assert.include(error?.message, "Unknown conversation source type");
    });
  });
});