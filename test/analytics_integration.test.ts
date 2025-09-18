import { expect } from "chai";
import { createClient } from "../src";
import { AnalyticsLiveEvents } from "../src/lib/enums";

describe("Analytics Integration Tests", () => {
  let deepgram: any;

  beforeEach(() => {
    deepgram = createClient(process.env.DEEPGRAM_API_KEY || "test-key", {
      global: { 
        url: process.env.DEEPGRAM_URL || "https://api.deepgram.com",
      },
    });
  });

  describe("End-to-End Workflow", () => {
    it("should handle complete conversation analysis workflow", async function () {
      this.timeout(30000); // 30 second timeout for integration test

      const source = {
        url: "https://static.deepgram.com/examples/interview_speech-analytics.wav",
      };

      // Step 1: Analyze conversation
      const { result: analysisResult, error: analysisError } = 
        await deepgram.analytics.prerecorded.analyzeUrl(source, {
          detect_speakers: true,
          extract_action_items: true,
          measure_engagement: true,
          detect_sentiment: true,
          conversation_summary: true,
        });

      expect(analysisError).to.be.null;
      expect(analysisResult).to.not.be.null;
      expect(analysisResult?.metadata).to.have.property("conversation_id");

      // Step 2: Retrieve analysis (should return same results)
      const conversationId = analysisResult?.metadata.conversation_id;
      if (conversationId) {
        const { result: retrievedResult, error: retrieveError } =
          await deepgram.analytics.prerecorded.getAnalysis(conversationId);

        expect(retrieveError).to.be.null;
        expect(retrievedResult).to.not.be.null;
        expect(retrievedResult?.metadata.conversation_id).to.equal(conversationId);
      }
    });

    it("should handle live analytics session", async function () {
      this.timeout(15000); // 15 second timeout

      return new Promise((resolve, reject) => {
        const live = deepgram.analytics.live({
          detect_speakers: true,
          realtime_metrics_interval: 5.0,
        });

        let eventCount = 0;

        live.on(AnalyticsLiveEvents.Open, () => {
          // Send some test audio data
          live.send(Buffer.from("test audio data"));
          
          setTimeout(() => {
            live.requestClose();
          }, 2000);
        });

        live.on(AnalyticsLiveEvents.SpeakerChange, () => {
          eventCount++;
        });

        live.on(AnalyticsLiveEvents.MetricsUpdate, () => {
          eventCount++;
        });

        live.on(AnalyticsLiveEvents.Close, () => {
          expect(eventCount).to.be.greaterThan(0);
          resolve(undefined);
        });

        live.on(AnalyticsLiveEvents.Error, (error: any) => {
          reject(error);
        });

        // Fail test if it takes too long
        setTimeout(() => {
          reject(new Error("Test timeout: Live analytics session took too long"));
        }, 12000);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid audio source gracefully", async () => {
      const source = {
        url: "https://invalid-url.com/nonexistent.wav",
      };

      const { result, error } = await deepgram.analytics.prerecorded.analyzeUrl(source, {
        detect_speakers: true,
      });

      // Should handle the error gracefully
      if (error) {
        expect(error).to.be.an("object");
        expect(error.message).to.be.a("string");
      }
    });

    it("should handle network connectivity issues", async function () {
      this.timeout(10000);

      const offlineClient = createClient("test-key", {
        global: { 
          url: "https://nonexistent-deepgram-api.com",
        },
      });

      const source = {
        url: "https://example.com/test.wav",
      };

      const { result, error } = await offlineClient.analytics.prerecorded.analyzeUrl(source);

      // Should handle network errors gracefully
      expect(result).to.be.null;
      expect(error).to.not.be.null;
    });
  });
});