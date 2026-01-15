import { expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";

describe("Conversation Analytics Live/Streaming", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "wss://api.mock.deepgram.com" },
    });
  });

  it("should create live conversation client", () => {
    const liveClient = deepgram.conversation.live({
      detect_speakers: true,
      realtime_metrics_interval: 5.0,
      measure_engagement: true
    });
    
    expect(liveClient).to.not.be.undefined;
    expect(liveClient.namespace).to.equal("conversation");
  });

  it("should handle streaming events", (done) => {
    const liveClient = deepgram.conversation.live({
      detect_speakers: true,
      extract_action_items: true
    });
    
    let eventCount = 0;
    
    liveClient.on("open", (connection) => {
      expect(connection).to.equal(liveClient);
      eventCount++;
    });

    liveClient.on("speaker_change", (data) => {
      expect(data.event.event_type).to.equal("speaker_change");
      expect(data.conversation_id).to.be.a("string");
      eventCount++;
    });

    liveClient.on("action_item", (data) => {
      expect(data.event.event_type).to.equal("action_item");
      expect(data.event.timestamp).to.be.a("number");
      eventCount++;
    });

    liveClient.on("metrics_update", (data) => {
      expect(data.event.event_type).to.equal("metrics_update");
      eventCount++;
      
      // Complete test after receiving multiple events
      if (eventCount >= 2) {
        done();
      }
    });

    liveClient.on("error", (error) => {
      done(error);
    });

    // Start the connection (mocked in test environment)
    liveClient.start();
  });

  it("should handle connection lifecycle", (done) => {
    const liveClient = deepgram.conversation.live();
    
    liveClient.on("open", () => {
      expect(liveClient.isConnected()).to.be.true;
      
      // Send some mock audio data
      liveClient.send(Buffer.from("mock audio chunk"));
      
      // Finish the conversation
      liveClient.finish();
    });

    liveClient.on("close", (event) => {
      expect(liveClient.isConnected()).to.be.false;
      done();
    });

    liveClient.on("error", (error) => {
      done(error);
    });

    liveClient.start();
  });

  it("should buffer audio data when not connected", () => {
    const liveClient = deepgram.conversation.live();
    
    // Send data before connection
    liveClient.send(Buffer.from("buffered audio"));
    
    expect(liveClient.sendBuffer.length).to.be.greaterThan(0);
  });
});