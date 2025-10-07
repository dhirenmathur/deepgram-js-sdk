import { DeepgramClient } from "../src";
import { AnalyticsClient, AnalyticsRestClient, AnalyticsLiveClient } from "../src/packages";
import type { ConversationAnalysisSchema } from "../src/lib/types";

const deepgram = new DeepgramClient({
  key: "proxy",
  global: { fetch: { options: { proxy: { url: "http://localhost:8080" } } } },
});

describe("Testing AnalyticsClient", () => {
  it("should create an AnalyticsClient", () => {
    const analytics = deepgram.analytics;
    expect(analytics).toBeInstanceOf(AnalyticsClient);
    expect(analytics.namespace).toBe("analytics");
  });

  it("should have correct namespace", () => {
    const analytics = deepgram.analytics;
    expect(analytics.namespace).toBe("analytics");
  });

  it("should create AnalyticsRestClient from prerecorded getter", () => {
    const analytics = deepgram.analytics;
    const prerecorded = analytics.prerecorded;
    expect(prerecorded).toBeInstanceOf(AnalyticsRestClient);
    expect(prerecorded.namespace).toBe("analytics");
  });

  it("should create AnalyticsLiveClient from live method", () => {
    const analytics = deepgram.analytics;
    const analysisOptions: ConversationAnalysisSchema = {
      detect_speakers: true,
      extract_action_items: true,
      detect_sentiment: true,
    };
    
    const live = analytics.live(analysisOptions);
    expect(live).toBeInstanceOf(AnalyticsLiveClient);
    expect(live.namespace).toBe("analytics");
    expect(live.analysisOptions.detect_speakers).toBe(true);
    expect(live.analysisOptions.extract_action_items).toBe(true);
    expect(live.analysisOptions.detect_sentiment).toBe(true);
  });

  it("should create AnalyticsLiveClient with default options", () => {
    const analytics = deepgram.analytics;
    const live = analytics.live();
    expect(live).toBeInstanceOf(AnalyticsLiveClient);
    expect(live.namespace).toBe("analytics");
    expect(Object.keys(live.analysisOptions)).toHaveLength(0);
  });

  it("should create AnalyticsLiveClient with custom endpoint", () => {
    const analytics = deepgram.analytics;
    const customEndpoint = ":version/custom/conversation/stream";
    const live = analytics.live({}, customEndpoint);
    expect(live).toBeInstanceOf(AnalyticsLiveClient);
    expect(live.namespace).toBe("analytics");
  });

  it("should validate analysis options", () => {
    const analytics = deepgram.analytics;
    const analysisOptions: ConversationAnalysisSchema = {
      detect_speakers: true,
      min_speakers: 2,
      max_speakers: 5,
      extract_action_items: true,
      measure_engagement: true,
      detect_sentiment: true,
      conversation_summary: true,
      include_transcription: false,
      detect_questions: true,
      detect_key_phrases: true,
      silence_threshold: 2.0,
      realtime_metrics_interval: 5,
      language: "en",
    };
    
    const live = analytics.live(analysisOptions);
    expect(live.analysisOptions).toEqual(analysisOptions);
  });
});