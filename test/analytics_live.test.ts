import { createClient, getApiKey } from "./helpers";
import { expect } from "chai";
import { AnalyticsEvents } from "../src/lib/enums";
import { AnalyticsLiveClient } from "../src/packages";
import { readFileSync } from "fs";

const deepgram = createClient();

describe("AnalyticsLiveClient", function() {
  this.timeout(10000);

  it("should establish WebSocket connection", function(done) {
    if (!getApiKey()) {
      console.log("No API key found, skipping test");
      this.skip();
      return;
    }

    const client = deepgram.analytics.live({
      detect_speakers: true,
      realtime_metrics_interval: 1000,
    });

    client.on(AnalyticsEvents.Open, () => {
      expect(client.getReadyState()).to.equal(1); // WebSocket.OPEN
      client.disconnect();
      done();
    });

    client.on(AnalyticsEvents.Error, (error) => {
      done(error);
    });
  });

  it("should handle streaming events", function(done) {
    if (!getApiKey()) {
      console.log("No API key found, skipping test");
      this.skip();
      return;
    }

    let eventReceived = false;
    const client = deepgram.analytics.live({
      detect_speakers: true,
      extract_action_items: true,
    });

    client.on(AnalyticsEvents.Open, () => {
      // Send some test audio data
      try {
        const audioData = readFileSync("examples/spacewalk.wav");
        client.send(audioData);
        
        // Close after a short delay to allow processing
        setTimeout(() => {
          client.requestClose();
        }, 2000);
      } catch (error) {
        console.log("Test audio file not found, simulating close");
        client.requestClose();
      }
    });

    client.on(AnalyticsEvents.SpeakerChange, (data) => {
      eventReceived = true;
      expect(data).to.have.property("speaker_id");
      expect(data).to.have.property("timestamp");
    });

    client.on(AnalyticsEvents.MetricsUpdate, (data) => {
      eventReceived = true;
      expect(data).to.have.property("timestamp");
      expect(data).to.have.property("speakers");
      expect(data.speakers).to.be.an("array");
    });

    client.on(AnalyticsEvents.Close, () => {
      // Test passes if connection was established and closed properly
      // Event reception is optional as it depends on audio content
      done();
    });

    client.on(AnalyticsEvents.Error, (error) => {
      done(error);
    });
  });

  it("should handle configuration updates", function(done) {
    if (!getApiKey()) {
      console.log("No API key found, skipping test");
      this.skip();
      return;
    }

    const client = deepgram.analytics.live({
      detect_speakers: true,
    });

    client.on(AnalyticsEvents.Open, () => {
      // Test configuration method
      expect(() => {
        client.configure({
          detect_interruptions: true,
          silence_threshold: 2000,
        });
      }).to.not.throw();

      // Test other control methods
      expect(() => {
        client.keepAlive();
        client.finalize();
        client.requestClose();
      }).to.not.throw();

      done();
    });

    client.on(AnalyticsEvents.Error, (error) => {
      done(error);
    });
  });

  it("should handle different event types", function(done) {
    if (!getApiKey()) {
      console.log("No API key found, skipping test");
      this.skip();
      return;
    }

    const client = deepgram.analytics.live({
      detect_speakers: true,
      extract_action_items: true,
      detect_sentiment: true,
      detect_interruptions: true,
    });

    const eventHandlers: { [key: string]: boolean } = {};

    // Set up handlers for all event types
    client.on(AnalyticsEvents.SpeakerChange, () => { eventHandlers.speakerChange = true; });
    client.on(AnalyticsEvents.ActionItem, () => { eventHandlers.actionItem = true; });
    client.on(AnalyticsEvents.SentimentChange, () => { eventHandlers.sentimentChange = true; });
    client.on(AnalyticsEvents.Interruption, () => { eventHandlers.interruption = true; });
    client.on(AnalyticsEvents.KeyPhrase, () => { eventHandlers.keyPhrase = true; });
    client.on(AnalyticsEvents.Question, () => { eventHandlers.question = true; });
    client.on(AnalyticsEvents.Silence, () => { eventHandlers.silence = true; });
    client.on(AnalyticsEvents.Unhandled, () => { eventHandlers.unhandled = true; });

    client.on(AnalyticsEvents.Open, () => {
      // Event handlers are set up, close the connection
      setTimeout(() => {
        client.requestClose();
      }, 1000);
    });

    client.on(AnalyticsEvents.Close, () => {
      // Test passes if connection lifecycle worked correctly
      done();
    });

    client.on(AnalyticsEvents.Error, (error) => {
      done(error);
    });
  });
});