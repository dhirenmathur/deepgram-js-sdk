import { assert, expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";
import { CallbackUrl } from "../src/lib/helpers";
import { ConversationUrlSource } from "../src/lib/types";

const bufferSource: Buffer = Buffer.from("mock audio data");
const urlSource: ConversationUrlSource = {
  url: faker.internet.url({ appendSlash: false }) + "/meeting.wav",
};

describe("making analyze REST requests", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://api.mock.deepgram.com" },
    });
  });

  it("should create the analyze client", () => {
    expect(deepgram.analyze).to.not.be.undefined;
    expect(deepgram.analyze.conversation).to.not.be.undefined;
  });

  it("should analyze conversation from URL synchronously", async () => {
    const { result, error } = await deepgram.analyze.conversation.analyzeUrl(urlSource, {
      detect_speakers: true,
      extract_action_items: true,
      measure_engagement: true
    });

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result?.metadata, ["request_id", "conversation_id"]);
    assert.isArray(result?.results.speakers);
  });

  it("should analyze conversation from file synchronously", async () => {
    const { result, error } = await deepgram.analyze.conversation.analyzeFile(bufferSource, {
      detect_sentiment: true,
      conversation_summary: true
    });

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result?.results, ["speakers", "dynamics"]);
  });

  it("should analyze conversation from URL asynchronously", async () => {
    const { result, error } = await deepgram.analyze.conversation.analyzeUrlCallback(
      urlSource,
      new CallbackUrl("https://example.com/callback")
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["request_id"]);
  });

  it("should retrieve conversation analysis by ID", async () => {
    const conversationId = faker.string.uuid();
    const { result, error } = await deepgram.analyze.conversation.getAnalysis(conversationId);

    assert.isNull(error);
    assert.isNotNull(result);
    assert.equal(result?.metadata.conversation_id, conversationId);
  });

  it("should validate synchronous callback constraint", async () => {
    const optionsWithCallback = {
      callback: "https://example.com/callback",
      detect_speakers: true
    };

    const { result, error } = await deepgram.analyze.conversation.analyzeUrl(
      urlSource,
      optionsWithCallback
    );

    assert.isNotNull(error);
    assert.include(error?.message, "Callback cannot be provided as an option to a synchronous");
  });
});