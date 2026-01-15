/**
 * Complete conversation analysis response
 */
interface ConversationResponse {
  metadata: ConversationMetadata;
  results: ConversationResults;
}

/**
 * Asynchronous conversation analysis response
 */
interface AsyncConversationResponse {
  request_id: string;
  conversation_id: string;
}

/**
 * Streaming conversation analysis response
 */
interface StreamingConversationResponse {
  conversation_id: string;
  event: StreamingEvent;
}

/**
 * Metadata for conversation analysis
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
 * Results from conversation analysis
 */
interface ConversationResults {
  speakers: SpeakerAnalysis[];
  dynamics: ConversationDynamics;
  action_items?: ActionItem[];
  summary?: ConversationSummary;
  transcription?: ConversationTranscription;
  questions?: Question[];
  key_phrases?: KeyPhrase[];
  sentiment?: SentimentAnalysis;
}

/**
 * Analysis of individual speakers
 */
interface SpeakerAnalysis {
  speaker_id: number;
  label?: string;
  talk_time: number;
  talk_time_percentage: number;
  interruptions_given: number;
  interruptions_received: number;
  average_response_time: number;
  longest_monologue: number;
  sentiment_score: number;
  engagement_score: number;
}

/**
 * Conversation dynamics and flow analysis
 */
interface ConversationDynamics {
  total_talk_time: number;
  silence_percentage: number;
  overlap_percentage: number;
  turn_taking_frequency: number;
  interruptions_total: number;
  engagement_score: number;
  dominant_speaker_percentage: number;
}

/**
 * Extracted action items from conversation
 */
interface ActionItem {
  id: string;
  text: string;
  assignee?: string;
  due_date?: string;
  priority?: "low" | "medium" | "high";
  confidence: number;
  start_time: number;
  end_time: number;
  speaker_id: number;
}

/**
 * Conversation summary
 */
interface ConversationSummary {
  short: string;
  detailed: string;
  key_topics: string[];
  outcomes: string[];
  next_steps: string[];
}

/**
 * Transcription data (if requested)
 */
interface ConversationTranscription {
  utterances: Utterance[];
}

/**
 * Individual utterance in transcription
 */
interface Utterance {
  text: string;
  start_time: number;
  end_time: number;
  speaker_id: number;
  confidence: number;
}

/**
 * Detected questions in conversation
 */
interface Question {
  id: string;
  text: string;
  speaker_id: number;
  start_time: number;
  end_time: number;
  confidence: number;
  answered: boolean;
  answer_speaker_id?: number;
}

/**
 * Key phrases extracted from conversation
 */
interface KeyPhrase {
  phrase: string;
  frequency: number;
  importance_score: number;
  first_occurrence: number;
  speakers: number[];
}

/**
 * Sentiment analysis results
 */
interface SentimentAnalysis {
  overall_sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  sentiment_over_time: SentimentPoint[];
}

/**
 * Sentiment at a specific time point
 */
interface SentimentPoint {
  time: number;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  speaker_id: number;
}

/**
 * Streaming event data
 */
interface StreamingEvent {
  type: string;
  timestamp: number;
  data: Record<string, unknown>;
}

export type {
  ConversationResponse,
  AsyncConversationResponse,
  StreamingConversationResponse,
  ConversationMetadata,
  ConversationResults,
  SpeakerAnalysis,
  ConversationDynamics,
  ActionItem,
  ConversationSummary,
  ConversationTranscription,
  Utterance,
  Question,
  KeyPhrase,
  SentimentAnalysis,
  SentimentPoint,
  StreamingEvent
};