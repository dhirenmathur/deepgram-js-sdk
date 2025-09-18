import { assert, expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";
import { ConversationEvents } from "../src/lib/enums";

describe("conversation analytics live client", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "wss://api.mock.deepgram.com" },
    });
  });

  it("should create the live conversation client", () => {
    const conversationClient = deepgram.conversation.stream({
      detect_speakers: true,
      realtime_metrics_interval: 10.0,
    });

    expect(conversationClient).to.not.be.undefined;
    expect(conversationClient.namespace).to.equal("conversation");
  });

  it("should create live client with default options", () => {
    const conversationClient = deepgram.conversation.stream();
    expect(conversationClient).to.not.be.undefined;
  });

  it("should create live client with custom endpoint", () => {
    const customEndpoint = ":version/analyze/conversation/stream/custom";
    const conversationClient = deepgram.conversation.stream({}, customEndpoint);
    expect(conversationClient).to.not.be.undefined;
  });

  it("should handle conversation events", (done) => {
    const conversationClient = deepgram.conversation.stream();

    conversationClient.on(ConversationEvents.Open, () => {
      // Send mock audio data
      conversationClient.send(Buffer.from("mock audio"));
    });

    conversationClient.on(ConversationEvents.SpeakerChange, (data) => {
      expect(data).to.have.property("event");
      expect(data.event.event_type).to.equal("speaker_change");
      done();
    });

    conversationClient.on(ConversationEvents.Error, (error) => {
      done(error);
    });
  });

  it("should handle action item events", (done) => {
    const conversationClient = deepgram.conversation.stream();

    conversationClient.on(ConversationEvents.ActionItem, (data) => {
      expect(data).to.have.property("event");
      expect(data.event.event_type).to.equal("action_item");
      done();
    });

    conversationClient.on(ConversationEvents.Error, (error) => {
      done(error);
    });
  });

  it("should handle sentiment change events", (done) => {
    const conversationClient = deepgram.conversation.stream();

    conversationClient.on(ConversationEvents.SentimentChange, (data) => {
      expect(data).to.have.property("event");
      expect(data.event.event_type).to.equal("sentiment_change");
      done();
    });

    conversationClient.on(ConversationEvents.Error, (error) => {
      done(error);
    });
  });

  it("should handle unhandled events", (done) => {
    const conversationClient = deepgram.conversation.stream();

    conversationClient.on(ConversationEvents.Unhandled, (data) => {
      expect(data).to.not.be.undefined;
      done();
    });

    conversationClient.on(ConversationEvents.Error, (error) => {
      done(error);
    });
  });

  it("should handle connection errors", (done) => {
    const conversationClient = deepgram.conversation.stream();

    conversationClient.on(ConversationEvents.Error, (error) => {
      expect(error).to.not.be.undefined;
      done();
    });
  });

  it("should handle connection close events", (done) => {
    const conversationClient = deepgram.conversation.stream();

    conversationClient.on(ConversationEvents.Close, (event) => {
      expect(event).to.not.be.undefined;
      done();
    });
  });
});