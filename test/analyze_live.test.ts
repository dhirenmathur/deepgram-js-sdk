import { expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";
import { ConversationAnalyticsEvents } from "../src/lib/enums";

describe("making analyze streaming requests", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "wss://api.mock.deepgram.com" },
    });
  });

  it("should create streaming analyze client", () => {
    const client = deepgram.analyze.stream({
      detect_speakers: true,
      realtime_metrics_interval: 10
    });

    expect(client).to.not.be.undefined;
    expect(client.namespace).to.equal("analyze");
  });

  it("should handle streaming events", (done) => {
    const client = deepgram.analyze.stream({
      extract_action_items: true,
      measure_engagement: true
    });

    client.on(ConversationAnalyticsEvents.Open, () => {
      // Connection opened successfully
      expect(client.conn?.readyState).to.equal(1);
    });

    client.on(ConversationAnalyticsEvents.ActionItem, (data) => {
      expect(data.event.event_type).to.equal("action_item");
      expect(data.event.data).to.have.property("text");
      done();
    });

    client.on(ConversationAnalyticsEvents.SpeakerChange, (data) => {
      expect(data.event.event_type).to.equal("speaker_change");
      expect(data.event).to.have.property("speaker_id");
    });

    client.on(ConversationAnalyticsEvents.Error, (error) => {
      done(error);
    });

    // Simulate sending audio data
    setTimeout(() => {
      client.send(Buffer.from("mock audio chunk"));
    }, 100);
  });

  it("should configure streaming options", () => {
    const client = deepgram.analyze.stream();

    client.on(ConversationAnalyticsEvents.Open, () => {
      client.configure({
        detect_questions: true,
        silence_threshold: 2.0
      });
      
      expect(() => client.configure({})).to.not.throw();
    });
  });

  it("should handle keepAlive and requestClose", () => {
    const client = deepgram.analyze.stream();

    expect(() => client.keepAlive()).to.not.throw();
    expect(() => client.requestClose()).to.not.throw();
  });
});