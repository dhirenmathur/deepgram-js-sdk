/**
 * Response types for conversation analytics API
 * @see https://developers.deepgram.com/docs/conversation-analytics
 */

/**
 * Metadata about the conversation analysis request
 */
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

/**
 * Analysis results for individual speakers
 */
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

/**
 * Action items extracted from conversation
 */
interface ActionItem {
  text: string;
  assigned_to: number[];
  assigned_by: number;
  confidence: number;
  timestamp: number;
  due_date?: string;
}

/**
 * Overall conversation dynamics analysis
 */
interface ConversationDynamics {
  turn_taking: {
    total_turns: number;
    average_turn_duration: number;
    turn_distribution: Record<string, number>;
  };
  engagement_score: number;
  participation_balance: number;
  silence_analysis: {
    total_silence: number;
    silence_percentage: number;
    longest_silence: number;
    average_silence_duration: number;
  };
  overlap_time: number;
  overlap_percentage: number;
  pace: {
    words_per_minute: Record<string, number>;
    overall_words_per_minute: number;
  };
}

/**
 * Complete conversation analysis results
 */
interface ConversationResults {
  speakers: SpeakerAnalysis[];
  dynamics: ConversationDynamics;
  action_items?: ActionItem[];
  summary?: {
    text: string;
    key_moments: Array<{
      timestamp: number;
      type: "decision" | "action_item" | "disagreement" | "question" | "important_topic";
      text: string;
      speakers: number[];
    }>;
  };
  transcription?: {
    full_transcript: string;
    by_speaker: Record<string, Array<{
      text: string;
      start_time: number;
      end_time: number;
    }>>;
  };
}

/**
 * Main response interface for conversation analytics
 */
export interface ConversationAnalyticsResponse {
  metadata: ConversationMetadata;
  results: ConversationResults;
}

/**
 * Streaming event types for real-time conversation analysis
 */
export interface ConversationStreamingEvent {
  event_type: "speaker_change" | "action_item" | "question" | "interruption" | 
             "sentiment_change" | "key_phrase" | "silence" | "metrics_update";
  timestamp: number;
  speaker_id?: number;
  data: Record<string, unknown>;
}

/**
 * Streaming response for real-time conversation analysis
 */
export interface ConversationStreamingResponse {
  conversation_id: string;
  event: ConversationStreamingEvent;
}

/**
 * Async conversation analytics response (callback mode)
 */
export interface AsyncConversationAnalyticsResponse {
  request_id: string;
}