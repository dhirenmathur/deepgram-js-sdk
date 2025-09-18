/**
 * Comprehensive type definitions for Conversation Analytics API responses.
 * Based on the OpenAPI 3.1.0 specification.
 */

// Base metadata for all conversation responses
interface ConversationMetadata {
  request_id: string;
  conversation_id: string;
  created: string;
  duration: number;
  channels: number;
  num_speakers: number;
  language: string;
  models: string[];
  model_info: Record<string, { name: string; version: string }>;
}

// Individual speaker analysis results
interface SpeakerAnalysis {
  speaker_id: number;
  speaker_label?: string;
  talk_time: number;
  talk_percentage: number;
  interruptions: {
    initiated: number;
    received: number;
  };
  questions: {
    asked: number;
    answered: number;
  };
  sentiment: {
    average: string;
    score: number;
    progression: Array<{
      time: number;
      sentiment: string;
      score: number;
    }>;
  };
  longest_monologue: number;
  average_response_time: number;
  key_phrases: Array<{
    phrase: string;
    count: number;
    timestamps: number[];
  }>;
}

// Conversation dynamics and flow analysis
interface ConversationDynamics {
  interruption_rate: number;
  question_response_ratio: number;
  silence_periods: Array<{
    start: number;
    end: number;
    duration: number;
  }>;
  pace_metrics: {
    words_per_minute: number;
    speech_rate_variation: number;
  };
  engagement_score: number;
  conversation_flow: Array<{
    timestamp: number;
    speaker_id: number;
    transition_type: "natural" | "interruption" | "silence";
  }>;
}

// Extracted action items
interface ActionItem {
  id: string;
  text: string;
  assignee?: string;
  due_date?: string;
  priority: "low" | "medium" | "high";
  confidence: number;
  timestamp: number;
  speaker_id: number;
}

// Conversation summary
interface ConversationSummary {
  brief: string;
  key_topics: string[];
  outcomes: string[];
  next_steps: string[];
  confidence: number;
}

// Transcription data (if included)
interface ConversationTranscription {
  segments: Array<{
    start: number;
    end: number;
    text: string;
    speaker_id: number;
    confidence: number;
  }>;
  full_transcript: string;
}

// Main conversation analysis results
interface ConversationResults {
  speakers: SpeakerAnalysis[];
  dynamics: ConversationDynamics;
  action_items?: ActionItem[];
  summary?: ConversationSummary;
  transcription?: ConversationTranscription;
}

// Complete conversation analysis response
interface ConversationAnalysisResponse {
  metadata: ConversationMetadata;
  results: ConversationResults;
}

// Synchronous response type
interface SyncConversationResponse extends ConversationAnalysisResponse {}

// Asynchronous response type
interface AsyncConversationResponse {
  request_id: string;
  conversation_id: string;
  status: "processing" | "completed" | "failed";
  created: string;
  callback?: string;
}

// Real-time streaming event data structures
interface ConversationStreamingEvent {
  type: string;
  timestamp: number;
  conversation_id: string;
}

interface SpeakerChangeEvent extends ConversationStreamingEvent {
  type: "speaker_change";
  previous_speaker_id: number;
  current_speaker_id: number;
}

interface ActionItemEvent extends ConversationStreamingEvent {
  type: "action_item";
  action_item: ActionItem;
}

interface QuestionEvent extends ConversationStreamingEvent {
  type: "question";
  question: {
    text: string;
    speaker_id: number;
    confidence: number;
  };
}

interface InterruptionEvent extends ConversationStreamingEvent {
  type: "interruption";
  interrupting_speaker_id: number;
  interrupted_speaker_id: number;
}

interface SentimentChangeEvent extends ConversationStreamingEvent {
  type: "sentiment_change";
  speaker_id: number;
  previous_sentiment: string;
  current_sentiment: string;
  sentiment_score: number;
}

interface KeyPhraseEvent extends ConversationStreamingEvent {
  type: "key_phrase";
  phrase: string;
  speaker_id: number;
  importance_score: number;
}

interface SilenceEvent extends ConversationStreamingEvent {
  type: "silence";
  duration: number;
}

interface MetricsUpdateEvent extends ConversationStreamingEvent {
  type: "metrics_update";
  metrics: {
    total_speakers: number;
    current_engagement: number;
    interruption_count: number;
    question_count: number;
  };
}

export type {
  ConversationMetadata,
  SpeakerAnalysis,
  ConversationDynamics,
  ActionItem,
  ConversationSummary,
  ConversationTranscription,
  ConversationResults,
  ConversationAnalysisResponse,
  SyncConversationResponse,
  AsyncConversationResponse,
  ConversationStreamingEvent,
  SpeakerChangeEvent,
  ActionItemEvent,
  QuestionEvent,
  InterruptionEvent,
  SentimentChangeEvent,
  KeyPhraseEvent,
  SilenceEvent,
  MetricsUpdateEvent,
};