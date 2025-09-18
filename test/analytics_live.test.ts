import { expect } from "chai";
import { createClient } from "../src";
import DeepgramClient from "../src/DeepgramClient";
import { faker } from "@faker-js/faker";

describe("Analytics Live Stream", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "wss://api.mock.deepgram.com" },
    });
  });

  describe("client creation", () => {
    it("should create live analytics client", () => {
      const live = deepgram.analytics.live({
        detect_speakers: true,
        measure_engagement: true,
      });
      
      expect(live).to.not.be.undefined;
      expect(live.namespace).to.equal("analytics");
    });

    it("should accept analysis options", () => {
      const options = {
        detect_speakers: true,
        min_speakers: 2,
        max_speakers: 4,
        detect_sentiment: true,
        extract_action_items: true,
        measure_engagement: true,
        realtime_metrics_interval: 5000,
        sample_rate: 16000,
        encoding: "linear16" as const,
      };
      
      const live = deepgram.analytics.live(options);
      expect(live).to.not.be.undefined;
    });

    it("should use default options when none provided", () => {
      const live = deepgram.analytics.live();
      expect(live).to.not.be.undefined;
      expect(live.namespace).to.equal("analytics");
    });
  });

  describe("connection management", () => {
    it("should handle connection state changes", (done) => {
      const live = deepgram.analytics.live({ detect_speakers: true });
      let eventCount = 0;
      
      live.on("open", () => {
        eventCount++;
        expect(live.isConnected()).to.be.true;
        
        if (eventCount === 1) {
          live.disconnect();
        }
      });
      
      live.on("close", () => {
        eventCount++;
        expect(live.isConnected()).to.be.false;
        
        if (eventCount === 2) {
          done();
        }
      });
      
      // Mock connection establishment
      setTimeout(() => {
        if (live.conn) {
          live.conn.onopen?.({} as Event);
          setTimeout(() => {
            live.conn?.onclose?.({} as CloseEvent);
          }, 100);
        }
      }, 50);
    });

    it("should handle errors gracefully", (done) => {
      const live = deepgram.analytics.live({ detect_speakers: true });
      
      live.on("error", (error) => {
        expect(error).to.not.be.undefined;
        done();
      });
      
      // Mock error
      setTimeout(() => {
        if (live.conn) {
          live.conn.onerror?.({} as Event);
        }
      }, 50);
    });
  });

  describe("streaming events", () => {
    it("should handle speaker change events", (done) => {
      const live = deepgram.analytics.live({ detect_speakers: true });
      
      live.on("speaker_change", (event) => {
        expect(event).to.have.property("conversation_id");
        expect(event.event).to.have.property("event_type", "speaker_change");
        expect(event.event).to.have.property("speaker_id");
        done();
      });
      
      // Mock speaker change event
      setTimeout(() => {
        if (live.conn) {
          const mockEvent = {
            data: JSON.stringify({
              conversation_id: "test-conversation",
              event: {
                event_type: "speaker_change",
                timestamp: 5.2,
                speaker_id: 1,
                data: { previous_speaker: 0, new_speaker: 1 }
              }
            })
          };
          live.conn.onmessage?.(mockEvent as MessageEvent);
        }
      }, 50);
    });

    it("should handle action item events", (done) => {
      const live = deepgram.analytics.live({ extract_action_items: true });
      
      live.on("action_item", (event) => {
        expect(event).to.have.property("conversation_id");
        expect(event.event).to.have.property("event_type", "action_item");
        expect(event.event.data).to.have.property("text");
        done();
      });
      
      // Mock action item event
      setTimeout(() => {
        if (live.conn) {
          const mockEvent = {
            data: JSON.stringify({
              conversation_id: "test-conversation",
              event: {
                event_type: "action_item",
                timestamp: 10.5,
                speaker_id: 2,
                data: {
                  text: "Schedule follow-up meeting for next week",
                  confidence: 0.95
                }
              }
            })
          };
          live.conn.onmessage?.(mockEvent as MessageEvent);
        }
      }, 50);
    });

    it("should handle metrics updates", (done) => {
      const live = deepgram.analytics.live({ 
        measure_engagement: true,
        realtime_metrics_interval: 1000 
      });
      
      live.on("metrics_update", (event) => {
        expect(event.event).to.have.property("event_type", "metrics_update");
        expect(event.event.data).to.have.property("engagement_score");
        done();
      });
      
      // Mock metrics update
      setTimeout(() => {
        if (live.conn) {
          const mockEvent = {
            data: JSON.stringify({
              conversation_id: "test-conversation",
              event: {
                event_type: "metrics_update",
                timestamp: 15.0,
                data: {
                  engagement_score: 0.75,
                  participation_balance: 0.6,
                  current_speakers: 2
                }
              }
            })
          };
          live.conn.onmessage?.(mockEvent as MessageEvent);
        }
      }, 50);
    });

    it("should handle malformed JSON gracefully", (done) => {
      const live = deepgram.analytics.live({ detect_speakers: true });
      
      live.on("error", (error) => {
        expect(error).to.be.instanceOf(Error);
        done();
      });
      
      // Mock malformed JSON
      setTimeout(() => {
        if (live.conn) {
          const mockEvent = {
            data: "invalid-json-{{"
          };
          live.conn.onmessage?.(mockEvent as MessageEvent);
        }
      }, 50);
    });
  });

  describe("data sending", () => {
    it("should send audio data", () => {
      const live = deepgram.analytics.live({ detect_speakers: true });
      const audioData = new ArrayBuffer(1024);
      
      // Mock connected state
      live.conn = {
        readyState: 1, // OPEN
        send: (data: any) => {
          expect(data).to.equal(audioData);
        }
      } as any;
      
      live.send(audioData);
    });

    it("should buffer sends when not connected", () => {
      const live = deepgram.analytics.live({ detect_speakers: true });
      const audioData = new ArrayBuffer(1024);
      
      // Mock disconnected state
      live.conn = {
        readyState: 0 // CONNECTING
      } as any;
      
      live.send(audioData);
      
      // Should be buffered
      expect(live.sendBuffer.length).to.be.greaterThan(0);
    });

    it("should handle keepAlive", () => {
      const live = deepgram.analytics.live({ detect_speakers: true });
      let sentData: string | undefined;
      
      // Mock connected state
      live.conn = {
        readyState: 1, // OPEN
        send: (data: string) => {
          sentData = data;
        }
      } as any;
      
      live.keepAlive();
      
      expect(sentData).to.equal(JSON.stringify({ type: "KeepAlive" }));
    });

    it("should handle finish", () => {
      const live = deepgram.analytics.live({ detect_speakers: true });
      let sentData: string | undefined;
      
      // Mock connected state
      live.conn = {
        readyState: 1, // OPEN
        send: (data: string) => {
          sentData = data;
        }
      } as any;
      
      live.finish();
      
      expect(sentData).to.equal(JSON.stringify({ type: "FinalizeSpeech" }));
    });

    it("should handle requestMetrics", () => {
      const live = deepgram.analytics.live({ measure_engagement: true });
      let sentData: string | undefined;
      
      // Mock connected state
      live.conn = {
        readyState: 1, // OPEN
        send: (data: string) => {
          sentData = data;
        }
      } as any;
      
      live.requestMetrics();
      
      expect(sentData).to.equal(JSON.stringify({ type: "RequestMetrics" }));
    });
  });
});