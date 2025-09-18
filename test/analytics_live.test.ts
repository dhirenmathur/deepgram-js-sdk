import { expect } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import { AnalyticsLiveEvents } from "../src/lib/enums";

describe("Analytics Live Client", () => {
  let deepgram: any;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "wss://api.mock.deepgram.com" },
    });
  });

  describe("Client Creation", () => {
    it("should create live analytics client", () => {
      const live = deepgram.analytics.live();
      expect(live).to.not.be.undefined;
      expect(live.namespace).to.equal("analytics");
    });

    it("should accept custom options", () => {
      const options = {
        detect_speakers: true,
        min_speakers: 2,
        max_speakers: 6,
        realtime_metrics_interval: 10.0,
      };

      expect(() => {
        deepgram.analytics.live(options);
      }).to.not.throw();
    });
  });

  describe("Validation", () => {
    it("should validate speaker count ranges", () => {
      expect(() => {
        deepgram.analytics.live({
          min_speakers: 5,
          max_speakers: 3,
        });
      }).to.throw("min_speakers cannot be greater than max_speakers");
    });

    it("should validate min_speakers range", () => {
      expect(() => {
        deepgram.analytics.live({
          min_speakers: 15, // Too high
        });
      }).to.throw("min_speakers must be between 1 and 10");
    });

    it("should validate max_speakers range", () => {
      expect(() => {
        deepgram.analytics.live({
          max_speakers: 25, // Too high
        });
      }).to.throw("max_speakers must be between 1 and 20");
    });

    it("should validate silence threshold", () => {
      expect(() => {
        deepgram.analytics.live({
          silence_threshold: 6.0, // Too high
        });
      }).to.throw("silence_threshold must be between 0.1 and 5.0 seconds");
    });

    it("should validate metrics interval", () => {
      expect(() => {
        deepgram.analytics.live({
          realtime_metrics_interval: 70.0, // Too high
        });
      }).to.throw("realtime_metrics_interval must be between 1.0 and 60.0 seconds");
    });
  });

  describe("Event Handling", () => {
    it("should emit connection events", (done) => {
      const live = deepgram.analytics.live();

      live.on(AnalyticsLiveEvents.Open, () => {
        done();
      });

      // Mock WebSocket connection
      if (live.conn) {
        live.conn.dispatchEvent(new Event("open"));
      }
    });

    it("should emit speaker change events", (done) => {
      const live = deepgram.analytics.live();

      live.on(AnalyticsLiveEvents.SpeakerChange, (data: any) => {
        expect(data).to.have.property("conversation_id");
        expect(data).to.have.property("event");
        expect(data.event.event_type).to.equal("speaker_change");
        done();
      });

      // Mock message event
      const mockMessage = {
        data: JSON.stringify({
          conversation_id: faker.string.uuid(),
          event: {
            event_type: "speaker_change",
            event_id: faker.string.uuid(),
            timestamp: Date.now(),
            data: {
              previous_speaker_id: 0,
              current_speaker_id: 1,
              confidence: 0.95,
            },
          },
        }),
      };

      if (live.conn) {
        live.conn.dispatchEvent(new MessageEvent("message", mockMessage));
      }
    });

    it("should emit action item events", (done) => {
      const live = deepgram.analytics.live();

      live.on(AnalyticsLiveEvents.ActionItem, (data: any) => {
        expect(data.event.event_type).to.equal("action_item");
        expect(data.event.data).to.have.property("text");
        done();
      });

      const mockMessage = {
        data: JSON.stringify({
          conversation_id: faker.string.uuid(),
          event: {
            event_type: "action_item",
            event_id: faker.string.uuid(),
            timestamp: Date.now(),
            data: {
              item_id: faker.string.uuid(),
              text: "Follow up with customer next week",
              speaker_id: 1,
              confidence: 0.87,
              priority: "medium",
            },
          },
        }),
      };

      if (live.conn) {
        live.conn.dispatchEvent(new MessageEvent("message", mockMessage));
      }
    });
  });

  describe("Control Methods", () => {
    it("should handle configuration updates", () => {
      const live = deepgram.analytics.live();
      expect(() => {
        live.configure({ detect_sentiment: true });
      }).to.not.throw();
    });

    it("should handle keep-alive messages", () => {
      const live = deepgram.analytics.live();
      expect(() => {
        live.keepAlive();
      }).to.not.throw();
    });

    it("should handle close requests", () => {
      const live = deepgram.analytics.live();
      expect(() => {
        live.requestClose();
      }).to.not.throw();
    });

    it("should handle custom control messages", () => {
      const live = deepgram.analytics.live();
      expect(() => {
        live.sendControlMessage({
          type: "UpdateConfig",
          config: { realtime_metrics_interval: 15.0 },
        });
      }).to.not.throw();
    });
  });
});