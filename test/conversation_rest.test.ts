import { assert, expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";
import { CallbackUrl } from "../src/lib/helpers";
import { UrlSource } from "../src/lib/types";

const bufferSource: Buffer = Buffer.from("mock audio data");
const urlSource: UrlSource = {
  url: faker.internet.url({ appendSlash: false }) + "/conversation.wav",
};

describe("Conversation Analytics REST API", () => {
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

  it("should analyze conversation from URL", async () => {
    const { result, error } = await deepgram.conversation.prerecorded.analyzeUrl(
      urlSource,
      { 
        detect_speakers: true, 
        measure_engagement: true,
        extract_action_items: true,
        language: "en"
      }
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result?.metadata, ["request_id", "conversation_id"]);
    assert.isArray(result?.results.speakers);
    assert.isObject(result?.results.dynamics);
  });

  it("should analyze conversation from file", async () => {
    const { result, error } = await deepgram.conversation.prerecorded.analyzeFile(
      bufferSource,
      { 
        extract_action_items: true, 
        detect_sentiment: true,
        conversation_summary: true
      }
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result?.metadata, ["request_id", "conversation_id"]);
    assert.isArray(result?.results.speakers);
  });

  it("should retrieve conversation analysis by ID", async () => {
    const conversationId = faker.string.uuid();
    const { result, error } = await deepgram.conversation.prerecorded.getConversation(conversationId);

    assert.isNull(error);
    assert.isNotNull(result);
    assert.equal(result?.metadata.conversation_id, conversationId);
  });

  it("should handle callback-based analysis for URL", async () => {
    const callback = new CallbackUrl("https://example.com/webhook");
    const { result, error } = await deepgram.conversation.prerecorded.analyzeUrlCallback(
      urlSource,
      callback,
      { 
        conversation_summary: true,
        detect_speakers: true
      }
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["request_id"]);
  });

  it("should handle callback-based analysis for file", async () => {
    const callback = new CallbackUrl("https://example.com/webhook");
    const { result, error } = await deepgram.conversation.prerecorded.analyzeFileCallback(
      bufferSource,
      callback,
      { 
        measure_engagement: true,
        detect_interruptions: true
      }
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["request_id"]);
  });

  it("should throw error when callback is provided to synchronous method", async () => {
    const { result, error } = await deepgram.conversation.prerecorded.analyzeUrl(
      urlSource,
      { 
        callback: "https://example.com/webhook",
        detect_speakers: true
      }
    );

    assert.isNotNull(error);
    assert.isNull(result);
    assert.include(error?.message, "Callback cannot be provided");
  });

  it("should handle unknown source type error", async () => {
    const invalidSource = { invalid: "source" } as any;
    const { result, error } = await deepgram.conversation.prerecorded.analyzeUrl(invalidSource);

    assert.isNotNull(error);
    assert.isNull(result);
    assert.include(error?.message, "Unknown conversation analysis source type");
  });
});