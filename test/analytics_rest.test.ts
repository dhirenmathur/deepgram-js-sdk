import { assert, expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";
import type { UrlSource, FileSource } from "../src/lib/types";

describe("Analytics REST Client", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://api.mock.deepgram.com" },
    });
  });

  describe("Client Creation", () => {
    it("should create analytics client", () => {
      expect(deepgram.analytics).to.not.be.undefined;
      expect(deepgram.analytics.prerecorded).to.not.be.undefined;
    });

    it("should have correct namespace", () => {
      expect(deepgram.analytics.namespace).to.equal("analytics");
      expect(deepgram.analytics.prerecorded.namespace).to.equal("analytics");
    });
  });

  describe("URL Analysis", () => {
    it("should analyze URL source synchronously", async () => {
      const source: UrlSource = {
        url: faker.internet.url() + "/conversation.wav",
      };

      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl(source, {
        detect_speakers: true,
        extract_action_items: true,
        measure_engagement: true,
      });

      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllDeepKeys(result?.metadata, ["request_id", "conversation_id"]);
    });

    it("should reject callback in synchronous URL analysis", async () => {
      const source: UrlSource = { url: faker.internet.url() + "/conversation.wav" };

      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl(source, {
        callback: "https://example.com/callback",
      } as any);

      assert.isNotNull(error);
      expect(error?.message).to.contain("Callback cannot be provided as an option to synchronous analysis");
    });
  });

  describe("File Analysis", () => {
    it("should analyze file source synchronously", async () => {
      const source: FileSource = Buffer.from("fake audio data");

      const { result, error } = await deepgram.analytics.prerecorded.analyzeFile(source, {
        detect_speakers: true,
        min_speakers: 2,
        max_speakers: 4,
      });

      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllDeepKeys(result?.metadata, ["request_id", "conversation_id"]);
    });

    it("should reject callback in synchronous file analysis", async () => {
      const source: FileSource = Buffer.from("fake audio data");

      const { result, error } = await deepgram.analytics.prerecorded.analyzeFile(source, {
        callback: "https://example.com/callback",
      } as any);

      assert.isNotNull(error);
      expect(error?.message).to.contain("Callback cannot be provided as an option to synchronous analysis");
    });
  });

  describe("Validation", () => {
    it("should validate speaker configuration", async () => {
      const source: UrlSource = { url: faker.internet.url() + "/conversation.wav" };

      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl(source, {
        min_speakers: 5,
        max_speakers: 3, // Invalid: min > max
      });

      assert.isNotNull(error);
      expect(error?.message).to.contain("min_speakers cannot be greater than max_speakers");
    });

    it("should handle unknown source type", async () => {
      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl({} as any);

      assert.isNotNull(error);
      expect(error?.message).to.contain("Unknown conversation source type");
    });
  });

  describe("Callback Methods", () => {
    it("should handle URL analysis with callback", async () => {
      const source: UrlSource = { url: faker.internet.url() + "/conversation.wav" };
      const callback = new URL("https://example.com/callback");

      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrlCallback(
        source,
        callback,
        {
          detect_speakers: true,
          extract_action_items: true,
        }
      );

      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllDeepKeys(result, ["request_id", "conversation_id", "status"]);
    });

    it("should handle file analysis with callback", async () => {
      const source: FileSource = Buffer.from("fake audio data");
      const callback = new URL("https://example.com/callback");

      const { result, error } = await deepgram.analytics.prerecorded.analyzeFileCallback(
        source,
        callback,
        {
          detect_sentiment: true,
          conversation_summary: true,
        }
      );

      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllDeepKeys(result, ["request_id", "conversation_id", "status"]);
    });
  });

  describe("Analysis Retrieval", () => {
    it("should retrieve analysis by conversation ID", async () => {
      const conversationId = faker.string.uuid();

      const { result, error } = await deepgram.analytics.prerecorded.getAnalysis(conversationId);

      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllDeepKeys(result?.metadata, ["request_id", "conversation_id"]);
      expect(result?.metadata.conversation_id).to.equal(conversationId);
    });
  });
});