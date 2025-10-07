import { DeepgramClient } from "../src";
import { DeepgramError } from "../src/lib/errors";
import type { 
  ConversationAnalysisSchema, 
  ConversationResponse,
  SyncConversationResponse,
  AsyncConversationResponse,
  UrlSource,
  FileSource 
} from "../src/lib/types";

const deepgram = new DeepgramClient({
  key: "proxy",
  global: { fetch: { options: { proxy: { url: "http://localhost:8080" } } } },
});

describe("Testing AnalyticsRestClient", () => {
  let analytics: any;

  beforeEach(() => {
    analytics = deepgram.analytics.prerecorded;
  });

  describe("analyzeUrl", () => {
    const urlSource: UrlSource = {
      url: "https://static.deepgram.com/examples/interview_speech-analytics.wav",
    };

    it("should analyze conversation from URL with basic options", async () => {
      const analysisOptions: ConversationAnalysisSchema = {
        detect_speakers: true,
        extract_action_items: true,
        detect_sentiment: true,
      };

      const result = await analytics.analyzeUrl(urlSource, analysisOptions);
      
      expect(result.error).toBeNull();
      expect(result.result).toBeDefined();
      expect(result.result.metadata).toBeDefined();
      expect(result.result.results).toBeDefined();
    });

    it("should analyze conversation from URL with all options", async () => {
      const analysisOptions: ConversationAnalysisSchema = {
        detect_speakers: true,
        min_speakers: 2,
        max_speakers: 4,
        detect_interruptions: true,
        extract_action_items: true,
        measure_engagement: true,
        detect_sentiment: true,
        conversation_summary: true,
        speaker_labels: ["Interviewer", "Candidate"],
        include_transcription: true,
        detect_questions: true,
        detect_key_phrases: true,
        silence_threshold: 2.0,
        language: "en",
      };

      const result = await analytics.analyzeUrl(urlSource, analysisOptions);
      
      expect(result.error).toBeNull();
      expect(result.result).toBeDefined();
    });

    it("should handle invalid URL source", async () => {
      const invalidSource = { url: "" };
      const result = await analytics.analyzeUrl(invalidSource);
      
      expect(result.error).toBeInstanceOf(DeepgramError);
      expect(result.result).toBeNull();
    });

    it("should reject callback in synchronous analysis", async () => {
      const analysisOptions: ConversationAnalysisSchema = {
        detect_speakers: true,
        callback: "https://example.com/callback",
      };

      const result = await analytics.analyzeUrl(urlSource, analysisOptions);
      
      expect(result.error).toBeInstanceOf(DeepgramError);
      expect(result.error.message).toContain("Callback cannot be provided");
      expect(result.result).toBeNull();
    });

    it("should validate speaker count parameters", async () => {
      const analysisOptions: ConversationAnalysisSchema = {
        detect_speakers: true,
        min_speakers: 5,
        max_speakers: 2, // Invalid: min > max
      };

      const result = await analytics.analyzeUrl(urlSource, analysisOptions);
      
      expect(result.error).toBeInstanceOf(DeepgramError);
      expect(result.error.message).toContain("min_speakers cannot be greater than max_speakers");
      expect(result.result).toBeNull();
    });
  });

  describe("analyzeFile", () => {
    const mockFileSource: FileSource = Buffer.from("mock audio data");

    it("should analyze conversation from file", async () => {
      const analysisOptions: ConversationAnalysisSchema = {
        detect_speakers: true,
        extract_action_items: true,
      };

      const result = await analytics.analyzeFile(mockFileSource, analysisOptions);
      
      expect(result.error).toBeNull();
      expect(result.result).toBeDefined();
    });

    it("should reject callback in synchronous file analysis", async () => {
      const analysisOptions: ConversationAnalysisSchema = {
        detect_speakers: true,
        callback: "https://example.com/callback",
      };

      const result = await analytics.analyzeFile(mockFileSource, analysisOptions);
      
      expect(result.error).toBeInstanceOf(DeepgramError);
      expect(result.error.message).toContain("Callback cannot be provided");
      expect(result.result).toBeNull();
    });
  });

  describe("analyzeUrlCallback", () => {
    const urlSource: UrlSource = {
      url: "https://static.deepgram.com/examples/interview_speech-analytics.wav",
    };
    const callbackUrl = new URL("https://example.com/callback");

    it("should initiate asynchronous URL analysis with callback", async () => {
      const analysisOptions: ConversationAnalysisSchema = {
        detect_speakers: true,
        extract_action_items: true,
      };

      const result = await analytics.analyzeUrlCallback(urlSource, callbackUrl, analysisOptions);
      
      expect(result.error).toBeNull();
      expect(result.result).toBeDefined();
      expect(result.result.request_id).toBeDefined();
      expect(result.result.status).toBe("processing");
    });

    it("should handle invalid callback URL", async () => {
      const invalidCallback = null as any;
      const result = await analytics.analyzeUrlCallback(urlSource, invalidCallback);
      
      expect(result.error).toBeInstanceOf(DeepgramError);
      expect(result.result).toBeNull();
    });
  });

  describe("analyzeFileCallback", () => {
    const mockFileSource: FileSource = Buffer.from("mock audio data");
    const callbackUrl = new URL("https://example.com/callback");

    it("should initiate asynchronous file analysis with callback", async () => {
      const analysisOptions: ConversationAnalysisSchema = {
        detect_speakers: true,
        extract_action_items: true,
      };

      const result = await analytics.analyzeFileCallback(mockFileSource, callbackUrl, analysisOptions);
      
      expect(result.error).toBeNull();
      expect(result.result).toBeDefined();
      expect(result.result.request_id).toBeDefined();
      expect(result.result.status).toBe("processing");
    });

    it("should handle invalid source", async () => {
      const invalidSource = null as any;
      const result = await analytics.analyzeFileCallback(invalidSource, callbackUrl);
      
      expect(result.error).toBeInstanceOf(DeepgramError);
      expect(result.result).toBeNull();
    });
  });

  describe("getAnalysis", () => {
    it("should retrieve conversation analysis by ID", async () => {
      const conversationId = "test-conversation-id-123";
      const result = await analytics.getAnalysis(conversationId);
      
      expect(result.error).toBeNull();
      expect(result.result).toBeDefined();
    });

    it("should handle empty conversation ID", async () => {
      const result = await analytics.getAnalysis("");
      
      expect(result.error).toBeInstanceOf(DeepgramError);
      expect(result.error.message).toContain("Conversation ID is required");
      expect(result.result).toBeNull();
    });

    it("should handle undefined conversation ID", async () => {
      const result = await analytics.getAnalysis(undefined as any);
      
      expect(result.error).toBeInstanceOf(DeepgramError);
      expect(result.result).toBeNull();
    });
  });
});