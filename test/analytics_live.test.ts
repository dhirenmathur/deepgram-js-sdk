import { DeepgramClient } from "../src";
import { AnalyticsLiveClient } from "../src/packages";
import { ConversationAnalyticsEvents } from "../src/lib/enums";
import type { ConversationAnalysisSchema } from "../src/lib/types";

const deepgram = new DeepgramClient({
  key: "proxy",
  global: { fetch: { options: { proxy: { url: "http://localhost:8080" } } } },
});

describe("Testing AnalyticsLiveClient", () => {
  let analyticsLive: AnalyticsLiveClient;

  beforeEach(() => {
    const analysisOptions: ConversationAnalysisSchema = {
      detect_speakers: true,
      extract_action_items: true,
      detect_sentiment: true,
    };
    analyticsLive = deepgram.analytics.live(analysisOptions);
  });

  afterEach(() => {
    if (analyticsLive) {
      analyticsLive.finish();
    }
  });

  it("should create AnalyticsLiveClient with correct namespace", () => {
    expect(analyticsLive).toBeInstanceOf(AnalyticsLiveClient);
    expect(analyticsLive.namespace).toBe("analytics");
  });

  it("should have correct analysis options", () => {
    expect(analyticsLive.analysisOptions.detect_speakers).toBe(true);
    expect(analyticsLive.analysisOptions.extract_action_items).toBe(true);
    expect(analyticsLive.analysisOptions.detect_sentiment).toBe(true);
  });

  it("should emit Open event on connection", (done) => {
    analyticsLive.on(ConversationAnalyticsEvents.Open, () => {
      expect(true).toBe(true);
      done();
    });

    // Simulate connection open
    if (analyticsLive.conn) {
      analyticsLive.conn.onopen?.(new Event("open"));
    }
  });

  it("should emit Close event on disconnection", (done) => {
    analyticsLive.on(ConversationAnalyticsEvents.Close, () => {
      expect(true).toBe(true);
      done();
    });

    // Simulate connection close
    if (analyticsLive.conn) {
      analyticsLive.conn.onclose?.(new CloseEvent("close"));
    }
  });

  it("should emit Error event on connection error", (done) => {
    analyticsLive.on(ConversationAnalyticsEvents.Error, (error) => {
      expect(error).toBeDefined();
      done();
    });

    // Simulate connection error
    if (analyticsLive.conn) {
      analyticsLive.conn.onerror?.(new Event("error"));
    }
  });

  it("should handle SpeakerChange event", (done) => {
    analyticsLive.on(ConversationAnalyticsEvents.SpeakerChange, (data) => {
      expect(data.conversation_id).toBe("test-conv-123");
      expect(data.timestamp).toBe(10.5);
      expect(data.speaker_id).toBe(1);
      expect(data.data).toBeDefined();
      done();
    });

    const mockEvent = {
      data: JSON.stringify({
        conversation_id: "test-conv-123",
        event: {
          event_type: "speaker_change",
          timestamp: 10.5,
          speaker_id: 1,
          data: {
            previous_speaker: 0,
            new_speaker: 1,
            confidence: 0.95,
          },
        },
      }),
    };

    // Simulate message event
    if (analyticsLive.conn) {
      analyticsLive.conn.onmessage?.(mockEvent as MessageEvent);
    }
  });

  it("should handle ActionItem event", (done) => {
    analyticsLive.on(ConversationAnalyticsEvents.ActionItem, (data) => {
      expect(data.conversation_id).toBe("test-conv-123");
      expect(data.timestamp).toBe(15.2);
      expect(data.speaker_id).toBe(1);
      expect(data.data.text).toBe("Schedule follow-up meeting");
      done();
    });

    const mockEvent = {
      data: JSON.stringify({
        conversation_id: "test-conv-123",
        event: {
          event_type: "action_item",
          timestamp: 15.2,
          speaker_id: 1,
          data: {
            text: "Schedule follow-up meeting",
            confidence: 0.88,
            assigned_to: 1,
          },
        },
      }),
    };

    // Simulate message event
    if (analyticsLive.conn) {
      analyticsLive.conn.onmessage?.(mockEvent as MessageEvent);
    }
  });

  it("should handle Question event", (done) => {
    analyticsLive.on(ConversationAnalyticsEvents.Question, (data) => {
      expect(data.conversation_id).toBe("test-conv-123");
      expect(data.timestamp).toBe(22.1);
      expect(data.speaker_id).toBe(2);
      expect(data.data.text).toBe("What do you think about this proposal?");
      expect(data.data.question_type).toBe("open");
      done();
    });

    const mockEvent = {
      data: JSON.stringify({
        conversation_id: "test-conv-123",
        event: {
          event_type: "question",
          timestamp: 22.1,
          speaker_id: 2,
          data: {
            text: "What do you think about this proposal?",
            question_type: "open",
            confidence: 0.92,
          },
        },
      }),
    };

    // Simulate message event
    if (analyticsLive.conn) {
      analyticsLive.conn.onmessage?.(mockEvent as MessageEvent);
    }
  });

  it("should handle SentimentChange event", (done) => {
    analyticsLive.on(ConversationAnalyticsEvents.SentimentChange, (data) => {
      expect(data.conversation_id).toBe("test-conv-123");
      expect(data.timestamp).toBe(30.5);
      expect(data.speaker_id).toBe(1);
      expect(data.data.previous_sentiment).toBe("neutral");
      expect(data.data.new_sentiment).toBe("positive");
      done();
    });

    const mockEvent = {
      data: JSON.stringify({
        conversation_id: "test-conv-123",
        event: {
          event_type: "sentiment_change",
          timestamp: 30.5,
          speaker_id: 1,
          data: {
            previous_sentiment: "neutral",
            new_sentiment: "positive",
            confidence: 0.85,
            sentiment_score: 0.7,
          },
        },
      }),
    };

    // Simulate message event
    if (analyticsLive.conn) {
      analyticsLive.conn.onmessage?.(mockEvent as MessageEvent);
    }
  });

  it("should handle MetricsUpdate event", (done) => {
    analyticsLive.on(ConversationAnalyticsEvents.MetricsUpdate, (data) => {
      expect(data.conversation_id).toBe("test-conv-123");
      expect(data.timestamp).toBe(60.0);
      expect(data.data.total_duration).toBe(60.0);
      expect(data.data.engagement_score).toBe(85);
      done();
    });

    const mockEvent = {
      data: JSON.stringify({
        conversation_id: "test-conv-123",
        event: {
          event_type: "metrics_update",
          timestamp: 60.0,
          data: {
            current_speaker: 1,
            speaking_time_by_speaker: { "0": 25.5, "1": 34.5 },
            total_duration: 60.0,
            engagement_score: 85,
            interruption_count: 3,
          },
        },
      }),
    };

    // Simulate message event
    if (analyticsLive.conn) {
      analyticsLive.conn.onmessage?.(mockEvent as MessageEvent);
    }
  });

  it("should handle invalid JSON gracefully", (done) => {
    analyticsLive.on(ConversationAnalyticsEvents.Error, (error) => {
      expect(error.type).toBe("parse_error");
      expect(error.description).toBe("Failed to parse WebSocket message");
      done();
    });

    const mockEvent = {
      data: "invalid json data",
    };

    // Simulate message event with invalid JSON
    if (analyticsLive.conn) {
      analyticsLive.conn.onmessage?.(mockEvent as MessageEvent);
    }
  });

  it("should handle unknown event types", (done) => {
    analyticsLive.on(ConversationAnalyticsEvents.MetricsUpdate, (data) => {
      expect(data.conversation_id).toBe("test-conv-123");
      done();
    });

    const mockEvent = {
      data: JSON.stringify({
        conversation_id: "test-conv-123",
        event: {
          event_type: "unknown_event_type",
          timestamp: 45.0,
          data: { some: "data" },
        },
      }),
    };

    // Simulate message event with unknown event type
    if (analyticsLive.conn) {
      analyticsLive.conn.onmessage?.(mockEvent as MessageEvent);
    }
  });

  it("should return immutable copy of analysis options", () => {
    const options1 = analyticsLive.analysisOptions;
    const options2 = analyticsLive.analysisOptions;
    
    expect(options1).toEqual(options2);
    expect(options1).not.toBe(options2); // Different object references
    
    // Modifying returned options should not affect internal state
    options1.detect_speakers = false;
    expect(analyticsLive.analysisOptions.detect_speakers).toBe(true);
  });
});