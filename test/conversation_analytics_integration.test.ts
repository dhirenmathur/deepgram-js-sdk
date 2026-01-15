import { ConversationAnalyticsClient } from "../src/packages/ConversationAnalyticsClient";
import { ConversationAnalyticsEvents } from "../src/lib/enums";
import type { ConversationResponse } from "../src/lib/types";

describe("ConversationAnalytics Integration", () => {
  let client: ConversationAnalyticsClient;

  beforeEach(() => {
    client = new ConversationAnalyticsClient({
      key: process.env.DEEPGRAM_API_KEY || "test-api-key",
    });
  });

  describe("Full REST Workflow", () => {
    it("should complete full conversation analysis workflow", async () => {
      // Skip if no real API key available
      if (!process.env.DEEPGRAM_API_KEY) {
        return;
      }

      const source = { url: "https://static.deepgram.com/examples/interview_speech-analytics.wav" };
      const options = {
        detect_speakers: true,
        extract_action_items: true,
        measure_engagement: true,
        conversation_summary: true
      };

      const result = await client.rest.analyzeUrl(source, options);
      
      expect(result.error).toBeNull();
      expect(result.result).toBeDefined();
      expect(result.result?.metadata.conversation_id).toBeDefined();
      expect(result.result?.results.speakers).toBeInstanceOf(Array);
      expect(result.result?.results.dynamics).toBeDefined();
    });
  });

  describe("Async Callback Workflow", () => {
    it("should handle async callback workflow", async () => {
      // Skip if no real API key available  
      if (!process.env.DEEPGRAM_API_KEY) {
        return;
      }

      const source = { url: "https://static.deepgram.com/examples/interview_speech-analytics.wav" };
      const callback = new URL("https://webhook.site/unique-id");
      const options = {
        detect_speakers: true,
        extract_action_items: true
      };

      const result = await client.rest.analyzeUrlCallback(source, callback, options);
      
      expect(result.error).toBeNull();
      expect(result.result).toBeDefined();
      expect(result.result?.request_id).toBeDefined();
      expect(result.result?.conversation_id).toBeDefined();
    });
  });

  describe("Live Streaming Workflow", () => {
    it("should handle real-time streaming analysis", (done) => {
      // Skip if no real API key available
      if (!process.env.DEEPGRAM_API_KEY) {
        done();
        return;
      }

      const liveClient = client.live({
        detect_speakers: true,
        extract_action_items: true,
        realtime_metrics_interval: 1000
      });

      let eventsReceived = 0;
      const expectedEvents = [
        ConversationAnalyticsEvents.Open,
        ConversationAnalyticsEvents.MetricsUpdate
      ];

      const eventHandler = (event: string) => {
        eventsReceived++;
        expect(expectedEvents).toContain(event);
        
        if (eventsReceived >= 2) {
          liveClient.disconnect();
          done();
        }
      };

      liveClient.on(ConversationAnalyticsEvents.Open, () => eventHandler(ConversationAnalyticsEvents.Open));
      liveClient.on(ConversationAnalyticsEvents.MetricsUpdate, () => eventHandler(ConversationAnalyticsEvents.MetricsUpdate));
      liveClient.on(ConversationAnalyticsEvents.Error, (error) => {
        console.error("Streaming error:", error);
        done(new Error("Streaming failed"));
      });

      // Simulate sending audio data
      setTimeout(() => {
        const audioData = Buffer.from("fake audio data");
        liveClient.send(audioData);
        
        // Send some configuration updates
        liveClient.configure({
          detect_speakers: false,
          extract_action_items: true
        });
        
        liveClient.keepAlive();
      }, 100);

      // Cleanup timeout
      setTimeout(() => {
        liveClient.disconnect();
        if (eventsReceived === 0) {
          done(new Error("No events received within timeout"));
        }
      }, 5000);
    });
  });
});