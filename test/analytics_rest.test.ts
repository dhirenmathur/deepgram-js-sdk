import { assert, expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";
import type { UrlSource, FileSource } from "../src/lib/types";

describe("Analytics REST API", () => {
  let deepgram: DeepgramClient;
  const urlSource: UrlSource = {
    url: faker.internet.url() + "/conversation.wav",
  };
  const fileSource: FileSource = Buffer.from("mock audio data");

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://api.mock.deepgram.com" },
    });
  });

  describe("Analytics client accessibility", () => {
    it("should provide analytics namespace", () => {
      expect(deepgram.analytics).to.not.be.undefined;
      expect(deepgram.analytics.namespace).to.equal("analytics");
    });

    it("should provide prerecorded client", () => {
      expect(deepgram.analytics.prerecorded).to.not.be.undefined;
      expect(deepgram.analytics.prerecorded.namespace).to.equal("analytics");
    });
  });

  describe("URL Analysis", () => {
    it("should analyze conversation from URL", async () => {
      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl(urlSource);
      
      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllDeepKeys(result?.metadata, ["conversation_id", "request_id"]);
      assert.isArray(result?.results.speakers);
      assert.isObject(result?.results.dynamics);
    });

    it("should analyze conversation from URL with options", async () => {
      const options = {
        detect_speakers: true,
        extract_action_items: true,
        detect_sentiment: true,
        measure_engagement: true,
      };

      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl(urlSource, options);
      
      assert.isNull(error);
      assert.isNotNull(result);
      assert.isTrue(result?.results.speakers.length > 0);
      assert.isDefined(result?.results.action_items);
    });

    it("should handle callback URL analysis", async () => {
      const callbackUrl = new URL("https://example.com/callback");
      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrlCallback(
        urlSource,
        callbackUrl
      );
      
      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllKeys(result, ["request_id"]);
    });

    it("should reject synchronous analysis with callback option", async () => {
      const options = {
        callback: "https://example.com/callback",
      };

      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl(urlSource, options);
      
      assert.isNotNull(error);
      assert.isNull(result);
      assert.include(error.message, "Callback cannot be provided");
    });
  });

  describe("File Analysis", () => {
    it("should analyze conversation from file", async () => {
      const { result, error } = await deepgram.analytics.prerecorded.analyzeFile(fileSource);
      
      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllDeepKeys(result?.metadata, ["conversation_id", "request_id"]);
    });

    it("should analyze conversation from file with options", async () => {
      const options = {
        language: "en",
        detect_speakers: true,
        min_speakers: 2,
        max_speakers: 4,
      };

      const { result, error } = await deepgram.analytics.prerecorded.analyzeFile(fileSource, options);
      
      assert.isNull(error);
      assert.isNotNull(result);
      assert.equal(result?.metadata.language, "en");
    });

    it("should handle callback file analysis", async () => {
      const callbackUrl = new URL("https://example.com/callback");
      const { result, error } = await deepgram.analytics.prerecorded.analyzeFileCallback(
        fileSource,
        callbackUrl
      );
      
      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllKeys(result, ["request_id"]);
    });
  });

  describe("Conversation Retrieval", () => {
    it("should retrieve conversation analysis by ID", async () => {
      const conversationId = faker.string.uuid();
      const { result, error } = await deepgram.analytics.retrieve(conversationId);
      
      assert.isNull(error);
      assert.isNotNull(result);
      assert.equal(result?.metadata.conversation_id, conversationId);
    });

    it("should retrieve conversation analysis using REST client directly", async () => {
      const conversationId = faker.string.uuid();
      const { result, error } = await deepgram.analytics.prerecorded.getConversationAnalysis(conversationId);
      
      assert.isNull(error);
      assert.isNotNull(result);
      assert.equal(result?.metadata.conversation_id, conversationId);
    });
  });
});