import { createClient, getApiKey } from "./helpers";
import { assert, expect } from "chai";
import { 
  ConversationAnalyticsResponse, 
  ConversationAnalysisSchema,
  DeepgramResponse,
  FileSource,
  UrlSource 
} from "../src/lib/types";
import { readFileSync } from "fs";

const deepgram = createClient();

describe("AnalyticsRestClient", () => {
  let urlSource: UrlSource;
  let bufferSource: FileSource;

  before(() => {
    urlSource = {
      url: "https://static.deepgram.com/examples/interview_speech-analytics.wav",
    };

    try {
      bufferSource = readFileSync("examples/spacewalk.wav");
    } catch (error) {
      console.warn("Test audio file not found, skipping file-based tests");
      bufferSource = Buffer.from("");
    }
  });

  it("should analyze conversation from URL", async () => {
    if (!getApiKey()) {
      console.log("No API key found, skipping test");
      return;
    }

    const { result, error }: DeepgramResponse<ConversationAnalyticsResponse> = 
      await deepgram.analytics.rest.analyzeUrl(urlSource, {
        detect_speakers: true,
        extract_action_items: true,
        detect_sentiment: true,
      });

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["metadata", "results"]);
    assert.containsAllDeepKeys(result?.metadata, ["request_id", "conversation_id", "created"]);
    assert.containsAllDeepKeys(result?.results, ["speakers", "dynamics"]);
    
    if (result?.results.speakers) {
      expect(result.results.speakers.length).to.be.greaterThan(0);
      result.results.speakers.forEach(speaker => {
        assert.containsAllDeepKeys(speaker, ["speaker_id", "talk_time", "sentiment"]);
      });
    }
  });

  it("should analyze conversation from file buffer", async () => {
    if (!getApiKey() || bufferSource.length === 0) {
      console.log("No API key found or test file unavailable, skipping test");
      return;
    }

    const { result, error }: DeepgramResponse<ConversationAnalyticsResponse> = 
      await deepgram.analytics.rest.analyzeFile(bufferSource, {
        detect_speakers: true,
        measure_engagement: true,
      });

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["metadata", "results"]);
  });

  it("should handle async analysis with callback URL", async () => {
    if (!getApiKey()) {
      console.log("No API key found, skipping test");
      return;
    }

    const callbackUrl = new URL("https://httpbin.org/post");
    const { result, error } = await deepgram.analytics.rest.analyzeUrlCallback(
      urlSource,
      callbackUrl,
      {
        detect_speakers: true,
        conversation_summary: true,
      }
    );

    assert.isNull(error);
    assert.isNotNull(result);
    assert.containsAllDeepKeys(result, ["request_id"]);
    expect(result?.request_id).to.be.a("string");
  });

  it("should retrieve conversation analysis by ID", async () => {
    if (!getApiKey()) {
      console.log("No API key found, skipping test");
      return;
    }

    // First create an analysis
    const { result: analysisResult } = await deepgram.analytics.rest.analyzeUrl(urlSource, {
      detect_speakers: true,
    });

    if (analysisResult?.metadata?.conversation_id) {
      const { result, error } = await deepgram.analytics.rest.getConversationAnalysis(
        analysisResult.metadata.conversation_id
      );

      assert.isNull(error);
      assert.isNotNull(result);
      assert.containsAllDeepKeys(result, ["metadata", "results"]);
      expect(result?.metadata?.conversation_id).to.equal(analysisResult.metadata.conversation_id);
    }
  });

  it("should reject sync analysis with callback option", async () => {
    const optionsWithCallback: ConversationAnalysisSchema = {
      detect_speakers: true,
      callback: "https://httpbin.org/post",
    };

    const { result, error } = await deepgram.analytics.rest.analyzeUrl(
      urlSource, 
      optionsWithCallback
    );

    assert.isNotNull(error);
    assert.isNull(result);
    expect(error?.message).to.include("Callback cannot be provided");
  });

  it("should handle analysis with comprehensive options", async () => {
    if (!getApiKey()) {
      console.log("No API key found, skipping test");
      return;
    }

    const comprehensiveOptions: ConversationAnalysisSchema = {
      detect_speakers: true,
      min_speakers: 2,
      max_speakers: 5,
      detect_interruptions: true,
      extract_action_items: true,
      measure_engagement: true,
      detect_sentiment: true,
      conversation_summary: true,
      speaker_labels: ["Customer", "Agent"],
      include_transcription: true,
      detect_questions: true,
      detect_key_phrases: true,
      language: "en",
    };

    const { result, error } = await deepgram.analytics.rest.analyzeUrl(
      urlSource, 
      comprehensiveOptions
    );

    assert.isNull(error);
    assert.isNotNull(result);
    
    if (result?.results.action_items) {
      expect(result.results.action_items).to.be.an("array");
    }
    
    if (result?.results.summary) {
      assert.containsAllDeepKeys(result.results.summary, ["overview", "key_points"]);
    }
  });
});