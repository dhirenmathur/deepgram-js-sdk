/**
 * Main conversation analysis response
 */
interface ConversationResponse {
  metadata: ConversationMetadata;
  results: ConversationResults;
}

/**
 * Async conversation analysis response
 */
interface AsyncConversationResponse {
  request_id: string;
}

/**
 * Metadata about the conversation analysis
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
  model_info: Record<string, ModelInfo>;
}

/**
 * Model information
 */
interface ModelInfo {
  name: string;
  version: string;
  language: string;
}

/**
 * Main conversation analysis results
 */
interface ConversationResults {
  speakers: SpeakerAnalysis[];
  dynamics: ConversationDynamics;
  action_items?: ActionItem[];
  summary?: ConversationSummary;
  transcription?: ConversationTranscription;
}

/**
 * Analysis for individual speakers
 */
interface SpeakerAnalysis {
  speaker_id: number;
  speaker_label?: string;
  talk_time: number;
  talk_percentage: number;
  interruptions: InterruptionStats;
  questions: QuestionStats;
  sentiment?: SentimentAnalysis;
  longest_monologue: number;
  average_response_time: number;
  key_phrases?: KeyPhrase[];
}

/**
 * Interruption statistics
 */
interface InterruptionStats {
  count: number;
  percentage: number;
  interrupts_given: number;
  interrupts_received: number;
}

/**
 * Question statistics
 */
interface QuestionStats {
  count: number;
  percentage: number;
  questions_asked: number;
}

/**
 * Sentiment analysis data
 */
interface SentimentAnalysis {
  overall: SentimentScore;
  segments: SentimentSegment[];
}

/**
 * Sentiment score
 */
interface SentimentScore {
  positive: number;
  negative: number;
  neutral: number;
}

/**
 * Sentiment for a conversation segment
 */
interface SentimentSegment {
  start: number;
  end: number;
  sentiment: SentimentScore;
}

/**
 * Key phrase extraction
 */
interface KeyPhrase {
  phrase: string;
  confidence: number;
  count: number;
  relevance: number;
}

/**
 * Conversation dynamics analysis
 */
interface ConversationDynamics {
  turn_taking: TurnTakingAnalysis;
  engagement_score: number;
  participation_balance: number;
  silence_analysis: SilenceAnalysis;
  overlap_time: number;
  overlap_percentage: number;
  pace: PaceAnalysis;
}

/**
 * Turn-taking behavior analysis
 */
interface TurnTakingAnalysis {
  turns_total: number;
  turns_per_speaker: Record<string, number>;
  average_turn_length: number;
  turn_distribution: number;
}

/**
 * Silence analysis
 */
interface SilenceAnalysis {
  total_silence_time: number;
  silence_percentage: number;
  silence_segments: SilenceSegment[];
}

/**
 * Silence segment
 */
interface SilenceSegment {
  start: number;
  end: number;
  duration: number;
}

/**
 * Pace analysis
 */
interface PaceAnalysis {
  words_per_minute: number;
  syllables_per_second: number;
  speech_rate_variation: number;
}

/**
 * Action item extracted from conversation
 */
interface ActionItem {
  text: string;
  assigned_to?: number[];
  assigned_by?: number;
  confidence: number;
  timestamp: number;
  due_date?: string;
  priority?: "low" | "medium" | "high";
  status?: "open" | "in_progress" | "completed";
}

/**
 * Conversation summary
 */
interface ConversationSummary {
  brief: string;
  detailed: string;
  key_points: string[];
  decisions_made: string[];
  next_steps: string[];
  participants: ParticipantSummary[];
}

/**
 * Participant summary
 */
interface ParticipantSummary {
  speaker_id: number;
  speaker_label?: string;
  contribution: string;
  main_topics: string[];
}

/**
 * Conversation transcription
 */
interface ConversationTranscription {
  speakers: TranscriptionSpeaker[];
  utterances: TranscriptionUtterance[];
}

/**
 * Transcription speaker
 */
interface TranscriptionSpeaker {
  speaker_id: number;
  speaker_label?: string;
}

/**
 * Transcription utterance
 */
interface TranscriptionUtterance {
  speaker_id: number;
  start: number;
  end: number;
  text: string;
  confidence: number;
  words: TranscriptionWord[];
}

/**
 * Transcription word
 */
interface TranscriptionWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

/**
 * Streaming conversation response
 */
interface StreamingConversationResponse {
  conversation_id: string;
  event: StreamingEvent;
}

/**
 * Streaming event
 */
interface StreamingEvent {
  event_type: "speaker_change" | "action_item" | "question" | "interruption" | 
              "sentiment_change" | "key_phrase" | "silence" | "metrics_update";
  timestamp: number;
  speaker_id?: number;
  data: any;
}

export type {
  ConversationResponse,
  AsyncConversationResponse,
  ConversationMetadata,
  ModelInfo,
  ConversationResults,
  SpeakerAnalysis,
  InterruptionStats,
  QuestionStats,
  SentimentAnalysis,
  SentimentScore,
  SentimentSegment,
  KeyPhrase,
  ConversationDynamics,
  TurnTakingAnalysis,
  SilenceAnalysis,
  SilenceSegment,
  PaceAnalysis,
  ActionItem,
  ConversationSummary,
  ParticipantSummary,
  ConversationTranscription,
  TranscriptionSpeaker,
  TranscriptionUtterance,
  TranscriptionWord,
  StreamingConversationResponse,
  StreamingEvent,
};