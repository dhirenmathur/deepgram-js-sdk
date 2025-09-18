import { assert } from "chai";
import { createClient } from "../src";
import { faker } from "@faker-js/faker";
import DeepgramClient from "../src/DeepgramClient";
import { ConversationEvents } from "../src/lib/enums";

describe("conversation streaming client", () => {
  let deepgram: DeepgramClient;

  beforeEach(() => {
    deepgram = createClient(faker.string.alphanumeric(40), {
      global: { url: "https://api.mock.deepgram.com" },
    });
  });

  describe("streaming connection", () => {
    it("should create streaming client with default options", () => {
      const conversationStream = deepgram.conversation.stream();
      
      assert.isNotNull(conversationStream);
      assert.equal(conversationStream.namespace, "conversation");
      assert.equal(conversationStream.getReadyState(), 0); // CONNECTING
    });

    it("should create streaming client with analysis options", () => {
      const conversationStream = deepgram.conversation.stream({
        detect_speakers: true,
        extract_action_items: true,
        detect_sentiment: true,
        realtime_metrics_interval: 5000,
      });

      assert.isNotNull(conversationStream);
      assert.equal(conversationStream.namespace, "conversation");
    });

    it("should handle connection events", (done) => {
      const conversationStream = deepgram.conversation.stream();
      let eventsReceived = 0;
      const expectedEvents = 3;

      conversationStream.on(ConversationEvents.Open, (data) => {
        eventsReceived++;
        assert.isNotNull(data);
        if (eventsReceived === expectedEvents) done();
      });

      conversationStream.on(ConversationEvents.Close, (data) => {
        eventsReceived++;
        assert.isNotNull(data);
        if (eventsReceived === expectedEvents) done();
      });

      conversationStream.on(ConversationEvents.Error, (data) => {
        eventsReceived++;
        assert.isNotNull(data);
        if (eventsReceived === expectedEvents) done();
      });

      // Simulate events for testing
      setTimeout(() => {
        conversationStream.emit(ConversationEvents.Open, conversationStream);
        conversationStream.emit(ConversationEvents.Close, { code: 1000 });
        conversationStream.emit(ConversationEvents.Error, new Error("test"));
      }, 100);
    });

    it("should handle conversation analysis events", (done) => {
      const conversationStream = deepgram.conversation.stream();
      let eventsReceived = 0;
      const expectedEvents = 4;

      conversationStream.on(ConversationEvents.SpeakerChange, (data) => {
        eventsReceived++;
        assert.containsAllDeepKeys(data, ["type", "previous_speaker_id", "current_speaker_id"]);
        if (eventsReceived === expectedEvents) done();
      });

      conversationStream.on(ConversationEvents.ActionItem, (data) => {
        eventsReceived++;
        assert.containsAllDeepKeys(data, ["type", "action_item"]);
        if (eventsReceived === expectedEvents) done();
      });

      conversationStream.on(ConversationEvents.SentimentChange, (data) => {
        eventsReceived++;
        assert.containsAllDeepKeys(data, ["type", "speaker_id", "current_sentiment"]);
        if (eventsReceived === expectedEvents) done();
      });

      conversationStream.on(ConversationEvents.MetricsUpdate, (data) => {
        eventsReceived++;
        assert.containsAllDeepKeys(data, ["type", "metrics"]);
        if (eventsReceived === expectedEvents) done();
      });

      // Simulate conversation events for testing
      setTimeout(() => {
        conversationStream.emit(ConversationEvents.SpeakerChange, {
          type: "speaker_change",
          previous_speaker_id: 0,
          current_speaker_id: 1,
        });
        conversationStream.emit(ConversationEvents.ActionItem, {
          type: "action_item",
          action_item: { id: "1", text: "Follow up tomorrow", priority: "medium" },
        });
        conversationStream.emit(ConversationEvents.SentimentChange, {
          type: "sentiment_change",
          speaker_id: 1,
          current_sentiment: "positive",
          sentiment_score: 0.8,
        });
        conversationStream.emit(ConversationEvents.MetricsUpdate, {
          type: "metrics_update",
          metrics: { total_speakers: 2, current_engagement: 0.75 },
        });
      }, 100);
    });

    it("should send keepAlive messages", () => {
      const conversationStream = deepgram.conversation.stream();
      
      // Mock the send method
      let sentMessage = "";
      conversationStream.send = (data: any) => {
        sentMessage = data;
      };

      conversationStream.keepAlive();
      
      const parsed = JSON.parse(sentMessage);
      assert.equal(parsed.type, "KeepAlive");
    });

    it("should send requestClose messages", () => {
      const conversationStream = deepgram.conversation.stream();
      
      // Mock the send method
      let sentMessage = "";
      conversationStream.send = (data: any) => {
        sentMessage = data;
      };

      conversationStream.requestClose();
      
      const parsed = JSON.parse(sentMessage);
      assert.equal(parsed.type, "CloseStream");
    });
  });
});