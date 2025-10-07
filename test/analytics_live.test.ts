import { expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import { AnalyticsEvents } from "../src/lib/enums";
import DeepgramClient from "../src/DeepgramClient";
import type { AnalyticsLiveClient } from "../src/packages";

describe("Analytics Live Streaming", () => {
  let deepgram: DeepgramClient;
  let connection: AnalyticsLiveClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { 
        url: "wss://api.mock.deepgram.com",
        websocket: {
          url: "wss://api.mock.deepgram.com",
        },
      },
    });
  });

  afterEach(() => {
    if (connection) {
      connection.disconnect();
    }
  });

  describe("Connection Management", () => {
    it("should create live analytics connection", () => {
      connection = deepgram.analytics.live({
        detect_speakers: true,
        measure_engagement: true,
      });
      
      expect(connection).to.not.be.undefined;
      expect(connection.namespace).to.equal("analytics");
    });

    it("should establish WebSocket connection", (done) => {
      connection = deepgram.analytics.live();
      
      connection.on(AnalyticsEvents.Open, () => {
        expect(connection.isConnected()).to.be.true;
        done();
      });
    });

    it("should handle connection errors", (done) => {
      connection = deepgram.analytics.live();
      
      connection.on(AnalyticsEvents.Error, (error) => {
        expect(error).to.not.be.undefined;
        done();
      });
      
      // Simulate connection error
      connection.conn?.dispatchEvent(new Event("error"));
    });

    it("should handle connection close", (done) => {
      connection = deepgram.analytics.live();
      
      connection.on(AnalyticsEvents.Close, (event) => {
        expect(event).to.not.be.undefined;
        done();
      });
      
      connection.disconnect();
    });
  });

  describe("Event Handling", () => {
    beforeEach(() => {
      connection = deepgram.analytics.live({
        detect_speakers: true,
        extract_action_items: true,
        detect_sentiment: true,
      });
    });

    it("should handle speaker change events", (done) => {
      connection.on(AnalyticsEvents.SpeakerChange, (data) => {
        expect(data).to.have.property("speaker_id");
        expect(data).to.have.property("timestamp");
        done();
      });
      
      // Simulate speaker change event
      const mockEvent = {
        data: JSON.stringify({
          type: "speaker_change",
          speaker_id: 1,
          timestamp: 10.5,
        }),
      };
      connection.conn?.onmessage?.(mockEvent as MessageEvent);
    });

    it("should handle action item events", (done) => {
      connection.on(AnalyticsEvents.ActionItem, (data) => {
        expect(data).to.have.property("description");
        expect(data).to.have.property("speaker_id");
        done();
      });
      
      // Simulate action item event
      const mockEvent = {
        data: JSON.stringify({
          type: "action_item",
          description: "Follow up with customer next week",
          speaker_id: 2,
          timestamp: 25.3,
          confidence: 0.85,
        }),
      };
      connection.conn?.onmessage?.(mockEvent as MessageEvent);
    });

    it("should handle sentiment change events", (done) => {
      connection.on(AnalyticsEvents.SentimentChange, (data) => {
        expect(data).to.have.property("sentiment");
        expect(data).to.have.property("score");
        done();
      });
      
      // Simulate sentiment change event
      const mockEvent = {
        data: JSON.stringify({
          type: "sentiment_change",
          speaker_id: 1,
          sentiment: "positive",
          score: 0.7,
          timestamp: 15.8,
        }),
      };
      connection.conn?.onmessage?.(mockEvent as MessageEvent);
    });

    it("should handle metrics update events", (done) => {
      connection.on(AnalyticsEvents.MetricsUpdate, (data) => {
        expect(data).to.have.property("speakers");
        expect(data).to.have.property("conversation");
        done();
      });
    });

    it("should handle unhandled message types", (done) => {
      connection.on(AnalyticsEvents.Unhandled, (data) => {
        expect(data).to.have.property("type");
        expect(data.type).to.equal("unknown_event");
        done();
      });
      
      // Simulate unknown event
      const mockEvent = {
        data: JSON.stringify({
          type: "unknown_event",
          data: { custom: "value" },
        }),
      };
      connection.conn?.onmessage?.(mockEvent as MessageEvent);
    });
  });

  describe("Runtime Configuration", () => {
    beforeEach(() => {
      connection = deepgram.analytics.live();
    });

    it("should allow runtime configuration updates", () => {
      const config = {
        realtime_metrics_interval: 5000,
        detect_key_phrases: true,
      };
      
      expect(() => connection.configure(config)).to.not.throw();
    });

    it("should handle configuration errors when disconnected", (done) => {
      connection.disconnect();
      
      connection.on(AnalyticsEvents.Error, (error) => {
        expect(error.type).to.equal("connection_error");
        done();
      });
      
      connection.configure({ detect_speakers: true });
    });
  });

  describe("Audio Data Streaming", () => {
    beforeEach(() => {
      connection = deepgram.analytics.live();
    });

    it("should send audio data when connected", () => {
      const audioData = new ArrayBuffer(1024);
      expect(() => connection.send(audioData)).to.not.throw();
    });

    it("should buffer audio data when disconnected", () => {
      connection.disconnect();
      const audioData = new ArrayBuffer(1024);
      
      expect(() => connection.send(audioData)).to.not.throw();
      expect(connection.sendBuffer.length).to.be.greaterThan(0);
    });
  });
});