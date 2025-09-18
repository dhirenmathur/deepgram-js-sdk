/**
 * Main response interface for conversation analysis
 */
export interface ConversationResponse {
  metadata: ConversationMetadata;
  results: ConversationResults;
}

/**
 * Metadata about the conversation analysis request and processing
 */
export interface ConversationMetadata {
  request_id: string;
  conversation_id: string;
  created: string; // ISO 8601 date string
  duration: number; // duration in seconds
  channels: number;
  num_speakers: number;
  language: string;
  models: string[];
  model_info: Record<string, { name: string; version: string }>;
}

/**
 * Main results container for conversation analysis
 */
export interface ConversationResults {
  speakers: SpeakerAnalysis[];
  dynamics: ConversationDynamics;
  action_items?: ActionItem[];
  summary?: ConversationSummary;
  transcription?: ConversationTranscription;
  questions?: Question[];
  key_phrases?: KeyPhrase[];
  sentiment_analysis?: SentimentAnalysis;
}

/**
 * Analysis results for individual speakers
 */
export interface SpeakerAnalysis {
  speaker_id: number;
  label?: string;
  role?: 'customer' | 'agent' | 'unknown';
  speaking_time: number; // seconds
  speaking_percentage: number; // 0-100
  turn_count: number;
  average_turn_duration: number; // seconds
  interruptions_made: number;
  interruptions_received: number;
  words_per_minute: number;
  silence_periods: SilencePeriod[];
  engagement_score: number; // 0-1
  sentiment_distribution: SentimentDistribution;
}

/**
 * Overall conversation dynamics analysis
 */
export interface ConversationDynamics {
  turn_taking: TurnTakingAnalysis;
  overlap_analysis: OverlapAnalysis;
  pace_analysis: PaceAnalysis;
  balance_score: number; // 0-1, measures how balanced the conversation is
  total_interruptions: number;
  total_silence_time: number; // seconds
}

/**
 * Extracted action items from the conversation
 */
export interface ActionItem {
  item_id: string;
  text: string;
  speaker_id: number;
  timestamp: number; // seconds from start
  confidence: number; // 0-1
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

/**
 * Generated summary of the conversation
 */
export interface ConversationSummary {
  overview: string;
  key_points: string[];
  outcomes: string[];
  next_steps: string[];
  word_count: number;
}

/**
 * Transcription results with speaker attribution
 */
export interface ConversationTranscription {
  utterances: Utterance[];
  paragraphs: Paragraph[];
}

/**
 * Individual utterance with speaker and timing information
 */
export interface Utterance {
  speaker_id: number;
  start: number; // seconds
  end: number; // seconds
  text: string;
  confidence: number; // 0-1
  words: Word[];
}

/**
 * Paragraph-level grouping of related utterances
 */
export interface Paragraph {
  sentences: Utterance[];
  summary: string;
  start: number; // seconds
  end: number; // seconds
}

/**
 * Individual word with timing and confidence
 */
export interface Word {
  word: string;
  start: number; // seconds
  end: number; // seconds
  confidence: number; // 0-1
  speaker_id: number;
}

/**
 * Detected question in the conversation
 */
export interface Question {
  question_id: string;
  text: string;
  speaker_id: number;
  timestamp: number; // seconds
  confidence: number; // 0-1
  question_type?: 'open' | 'closed' | 'leading' | 'rhetorical';
  answered?: boolean;
  answer_speaker_id?: number;
  answer_timestamp?: number;
}

/**
 * Key phrase detection results
 */
export interface KeyPhrase {
  phrase: string;
  frequency: number;
  importance_score: number; // 0-1
  first_occurrence: number; // seconds
  speakers: number[]; // speaker IDs who used this phrase
  context: string[];
}

/**
 * Sentiment analysis throughout the conversation
 */
export interface SentimentAnalysis {
  overall_sentiment: SentimentScore;
  sentiment_timeline: SentimentTimelineItem[];
  sentiment_shifts: SentimentShift[];
}

/**
 * Sentiment score with confidence
 */
export interface SentimentScore {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-1
  polarity: number; // -1 to 1
}

/**
 * Sentiment at a specific point in time
 */
export interface SentimentTimelineItem {
  timestamp: number; // seconds
  speaker_id: number;
  sentiment: SentimentScore;
  text_segment: string;
}

/**
 * Significant sentiment change event
 */
export interface SentimentShift {
  timestamp: number; // seconds
  speaker_id: number;
  from_sentiment: SentimentScore;
  to_sentiment: SentimentScore;
  trigger_phrase?: string;
}

/**
 * Distribution of sentiments for a speaker
 */
export interface SentimentDistribution {
  positive_percentage: number; // 0-100
  negative_percentage: number; // 0-100
  neutral_percentage: number; // 0-100
}

/**
 * Turn-taking analysis
 */
export interface TurnTakingAnalysis {
  average_turn_duration: number; // seconds
  turn_distribution: Record<string, number>; // speaker_id -> turn_count
  smooth_transitions: number;
  abrupt_transitions: number;
}

/**
 * Analysis of speaker overlaps and interruptions
 */
export interface OverlapAnalysis {
  total_overlaps: number;
  overlap_duration: number; // total seconds of overlap
  interruption_patterns: InterruptionPattern[];
}

/**
 * Conversation pace analysis
 */
export interface PaceAnalysis {
  average_words_per_minute: number;
  pace_changes: PaceChange[];
  speaking_rate_distribution: Record<string, number>; // speaker_id -> wpm
}

/**
 * Pattern of interruptions between speakers
 */
export interface InterruptionPattern {
  interrupter_id: number;
  interrupted_id: number;
  frequency: number;
  average_duration: number; // seconds
}

/**
 * Significant pace change in the conversation
 */
export interface PaceChange {
  timestamp: number; // seconds
  from_pace: number; // wpm
  to_pace: number; // wpm
  duration: number; // seconds
  speakers_involved: number[];
}

/**
 * Period of silence in the conversation
 */
export interface SilencePeriod {
  start: number; // seconds
  end: number; // seconds
  duration: number; // seconds
  context: 'natural_pause' | 'awkward_silence' | 'thinking_pause' | 'technical_issue';
}

/**
 * Response type for synchronous conversation analysis
 */
export type SyncConversationResponse = ConversationResponse;

/**
 * Response type for asynchronous conversation analysis
 */
export interface AsyncConversationResponse {
  request_id: string;
  conversation_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  created: string; // ISO 8601 date string
  callback_url?: string;
}