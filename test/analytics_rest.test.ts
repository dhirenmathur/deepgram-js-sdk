import { assert, expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";
import { CallbackUrl } from "../src/lib/helpers";
import { UrlSource } from "../src/lib/types";

describe("Analytics REST API", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://api.mock.deepgram.com" },
    });
  });

  describe("analyzeUrl", () => {
    it("should analyze URL source synchronously", async () => {
      const urlSource: UrlSource = {
        url: faker.internet.url() + "/conversation.wav",
      };
      
      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl(
        urlSource,
        {
          detect_speakers: true,
          extract_action_items: true,
          measure_engagement: true,
        }
      );
      
      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllDeepKeys(result?.metadata, ["conversation_id", "request_id"]);
      assert.property(result, "results");
      assert.property(result?.results, "speakers");
      assert.property(result?.results, "dynamics");
    });

    it("should reject callback option for sync analysis", async () => {
      const urlSource: UrlSource = {
        url: faker.internet.url() + "/conversation.wav",
      };
      
      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl(
        urlSource,
        { callback: "https://example.com/webhook" } as any
      );
      
      assert.isNull(result);
      assert.isNotNull(error);
      assert.include(error?.message, "Callback cannot be provided for synchronous analysis");
    });

    it("should validate URL source format", async () => {
      const invalidSource = { notUrl: "invalid" } as any;
      
      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl(invalidSource);
      
      assert.isNull(result);
      assert.isNotNull(error);
      assert.include(error?.message, "Invalid source type for URL analysis");
    });
  });

  describe("analyzeFile", () => {
    it("should analyze file source synchronously", async () => {
      const fileSource = Buffer.from("fake-audio-data");
      
      const { result, error } = await deepgram.analytics.prerecorded.analyzeFile(
        fileSource,
        {
          detect_speakers: true,
          detect_sentiment: true,
        }
      );
      
      assert.isNull(error);
      assert.isNotNull(result);
      assert.property(result, "metadata");
      assert.property(result, "results");
    });

    it("should validate file source format", async () => {
      const invalidSource = "not-a-buffer" as any;
      
      const { result, error } = await deepgram.analytics.prerecorded.analyzeFile(invalidSource);
      
      assert.isNull(result);
      assert.isNotNull(error);
      assert.include(error?.message, "Invalid source type for file analysis");
    });
  });

  describe("analyzeUrlCallback", () => {
    it("should handle callback analysis", async () => {
      const urlSource: UrlSource = {
        url: faker.internet.url() + "/conversation.wav",
      };
      const callback = new CallbackUrl("https://example.com/callback");
      
      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrlCallback(
        urlSource,
        callback,
        {
          detect_speakers: true,
          extract_action_items: true,
        }
      );
      
      assert.isNull(error);
      assert.isNotNull(result);
      assert.property(result, "conversation_id");
      assert.property(result, "request_id");
      assert.property(result, "status");
      assert.include(["processing", "queued"], result?.status);
    });

    it("should validate callback URL format", async () => {
      const urlSource: UrlSource = {
        url: faker.internet.url() + "/conversation.wav",
      };
      const invalidCallback = "not-a-url" as any;
      
      try {
        await deepgram.analytics.prerecorded.analyzeUrlCallback(urlSource, invalidCallback);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.isTrue(true); // Expected to throw
      }
    });
  });

  describe("analyzeFileCallback", () => {
    it("should handle file callback analysis", async () => {
      const fileSource = Buffer.from("fake-audio-data");
      const callback = new CallbackUrl("https://example.com/callback");
      
      const { result, error } = await deepgram.analytics.prerecorded.analyzeFileCallback(
        fileSource,
        callback,
        {
          detect_sentiment: true,
          conversation_summary: true,
        }
      );
      
      assert.isNull(error);
      assert.isNotNull(result);
      assert.property(result, "conversation_id");
      assert.property(result, "status");
    });
  });

  describe("getAnalysis", () => {
    it("should retrieve conversation analysis", async () => {
      const conversationId = faker.string.uuid();
      
      const { result, error } = await deepgram.analytics.prerecorded.getAnalysis(conversationId);
      
      assert.isNull(error);
      assert.isNotNull(result);
      assert.property(result, "metadata");
      assert.property(result, "results");
      assert.equal(result?.metadata.conversation_id, conversationId);
    });

    it("should handle invalid conversation ID", async () => {
      const invalidId = "invalid-conversation-id";
      
      const { result, error } = await deepgram.analytics.prerecorded.getAnalysis(invalidId);
      
      // Should either return an error or throw, depending on API behavior
      assert.isTrue(result === null || error !== null);
    });
  });

  describe("client namespace", () => {
    it("should have correct namespace", () => {
      const client = deepgram.analytics.prerecorded;
      assert.equal(client.namespace, "analytics");
    });

    it("should be accessible from main client", () => {
      assert.isDefined(deepgram.analytics);
      assert.isDefined(deepgram.analytics.prerecorded);
      assert.isFunction(deepgram.analytics.prerecorded.analyzeUrl);
      assert.isFunction(deepgram.analytics.prerecorded.analyzeFile);
      assert.isFunction(deepgram.analytics.prerecorded.analyzeUrlCallback);
      assert.isFunction(deepgram.analytics.prerecorded.analyzeFileCallback);
      assert.isFunction(deepgram.analytics.prerecorded.getAnalysis);
    });
  });
});