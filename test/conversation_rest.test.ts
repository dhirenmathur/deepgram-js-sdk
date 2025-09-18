import { assert, expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";
import { CallbackUrl } from "../src/lib/helpers";
import { UrlSource } from "../src/lib/types";

const bufferSource: Buffer = Buffer.from("conversation audio data");
const urlSource: UrlSource = {
  url: faker.internet.url({ appendSlash: false }) + "/conversation.wav",
};

describe("making conversation analytics REST requests", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://api.mock.deepgram.com" },
    });
  });

  it("should create the conversation client", () => {
    expect(deepgram.conversation).to.not.be.undefined;
    expect(deepgram.conversation.prerecorded).to.not.be.undefined;
  });

  it("should analyze a URL source synchronously", async () => {
    const { result, error } = await deepgram.conversation.prerecorded.analyzeUrl(
      urlSource,
      { detect_speakers: true, extract_action_items: true }
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result?.metadata, ["request_id", "conversation_id"]);
    assert.isArray(result?.results.speakers);
  });

  it("should analyze a file source synchronously", async () => {
    const { result, error } = await deepgram.conversation.prerecorded.analyzeFile(
      bufferSource,
      { measure_engagement: true, detect_sentiment: true }
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result?.metadata, ["request_id", "conversation_id"]);
  });

  it("should analyze with callback URL", async () => {
    const { result, error } = await deepgram.conversation.prerecorded.analyzeUrlCallback(
      urlSource,
      new CallbackUrl("https://example.com/conversation-callback"),
      { conversation_summary: true }
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["request_id", "conversation_id"]);
  });

  it("should analyze file with callback URL", async () => {
    const { result, error } = await deepgram.conversation.prerecorded.analyzeFileCallback(
      bufferSource,
      new CallbackUrl("https://example.com/conversation-callback"),
      { detect_questions: true }
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["request_id", "conversation_id"]);
  });

  it("should retrieve analysis by conversation ID", async () => {
    const conversationId = faker.string.uuid();
    const { result, error } = await deepgram.conversation.prerecorded.getAnalysis(conversationId);

    assert.isNull(error);
    assert.isNotNull(result);
    assert.equal(result?.metadata.conversation_id, conversationId);
  });

  it("should throw error when providing callback to sync methods", async () => {
    try {
      await deepgram.conversation.prerecorded.analyzeUrl(urlSource, {
        callback: "https://example.com/callback",
      });
      assert.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).to.contain("Callback cannot be provided to synchronous analysis");
    }
  });

  it("should handle invalid URL source", async () => {
    const invalidSource = { notUrl: "invalid" } as any;
    const { result, error } = await deepgram.conversation.prerecorded.analyzeUrl(invalidSource);

    assert.isNull(result);
    assert.isNotNull(error);
    expect(error?.message).to.contain("Invalid source type");
  });

  it("should handle invalid file source", async () => {
    const invalidSource = { notFile: "invalid" } as any;
    const { result, error } = await deepgram.conversation.prerecorded.analyzeFile(invalidSource);

    assert.isNull(result);
    assert.isNotNull(error);
    expect(error?.message).to.contain("Invalid source type");
  });

  it("should handle conversation analytics options", async () => {
    const options = {
      detect_speakers: true,
      min_speakers: 2,
      max_speakers: 5,
      extract_action_items: true,
      measure_engagement: true,
      detect_sentiment: true,
      conversation_summary: true,
      detect_questions: true,
      detect_key_phrases: true,
      silence_threshold: 2.0,
      customer_speaker_id: 0,
      agent_speaker_id: 1,
    };

    const { result, error } = await deepgram.conversation.prerecorded.analyzeUrl(
      urlSource,
      options
    );

    assert.isNull(error);
    assert.isNotNull(result);
  });
});