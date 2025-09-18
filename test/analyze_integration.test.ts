import { assert, expect } from "chai";
import { createClient } from "../src";
import { ConversationAnalyticsEvents } from "../src/lib/enums";

describe("conversation analytics integration", () => {
  it("should handle complete workflow", async function() {
    this.timeout(30000);
    
    // Skip if no API key provided
    if (!process.env.DEEPGRAM_API_KEY) {
      this.skip();
    }
    
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY!, {
      global: { url: "https://api.deepgram.com" }
    });

    // Test REST analysis
    const { result: analysisResult, error: analysisError } = 
      await deepgram.analyze.conversation.analyzeUrl({
        url: "https://dpgr.am/sample-conversation.wav"
      }, {
        detect_speakers: true,
        extract_action_items: true,
        measure_engagement: true,
        detect_sentiment: true
      });

    assert.isNull(analysisError);
    assert.isNotNull(analysisResult);
    assert.isAtLeast(analysisResult!.results.speakers.length, 1);

    if (analysisResult!.results.action_items) {
      assert.isArray(analysisResult!.results.action_items);
    }

    // Test retrieving stored analysis
    const conversationId = analysisResult!.metadata.conversation_id;
    const { result: storedResult, error: storedError } = 
      await deepgram.analyze.conversation.getAnalysis(conversationId);

    assert.isNull(storedError);
    assert.isNotNull(storedResult);
    assert.equal(storedResult!.metadata.conversation_id, conversationId);
  });

  it("should handle streaming analysis", function(done) {
    this.timeout(15000);

    // Skip if no API key provided
    if (!process.env.DEEPGRAM_API_KEY) {
      this.skip();
    }

    const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);
    const client = deepgram.analyze.stream({
      detect_speakers: true,
      realtime_metrics_interval: 5.0
    });

    let eventCount = 0;

    client.on(ConversationAnalyticsEvents.Open, () => {
      // Send test audio data
      const audioChunk = Buffer.from("test audio data");
      client.send(audioChunk);
    });

    client.on(ConversationAnalyticsEvents.MetricsUpdate, (data) => {
      eventCount++;
      expect(data.conversation_id).to.be.a('string');
      expect(data.event.event_type).to.equal('metrics_update');
      
      if (eventCount >= 1) {
        client.requestClose();
      }
    });

    client.on(ConversationAnalyticsEvents.Close, () => {
      expect(eventCount).to.be.greaterThan(0);
      done();
    });

    client.on(ConversationAnalyticsEvents.Error, done);
  });
});