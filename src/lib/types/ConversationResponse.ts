/**
 * Metadata information for a conversation analysis
 */
interface ConversationMetadata {
  /**
   * Unique identifier for the API request
   */
  request_id: string;

  /**
   * Unique identifier for the conversation
   */
  conversation_id: string;

  /**
   * Timestamp when the analysis was created
   */
  created: string;

  /**
   * Duration of the conversation in seconds
   */
  duration: number;

  /**
   * Number of audio channels processed
   */
  channels: number;

  /**
   * Number of speakers detected
   */
  num_speakers: number;

  /**
   * Language of the conversation
   */
  language: string;

  /**
   * Models used for analysis
   */
  models: string[];

  /**
   * Detailed model information
   */
  model_info: Record<string, { name: string; version: string }>;
}

/**
 * Analysis data for an individual speaker
 */
interface SpeakerAnalysis {
  /**
   * Unique identifier for the speaker
   */
  speaker_id: number;

  /**
   * Custom label for the speaker
   */
  speaker_label?: string;

  /**
   * Total time the speaker talked (in seconds)
   */
  talk_time: number;

  /**
   * Percentage of total conversation time this speaker talked
   */
  talk_percentage: number;

  /**
   * Interruption statistics for this speaker
   */
  interruptions: {
    /**
     * Number of interruptions initiated by this speaker
     */
    initiated: number;
    /**
     * Number of interruptions received by this speaker
     */
    received: number;
  };

  /**
   * Question statistics for this speaker
   */
  questions: {
    /**
     * Number of questions asked by this speaker
     */
    asked: number;
    /**
     * Number of questions answered by this speaker
     */
    answered: number;
  };

  /**
   * Sentiment analysis for this speaker
   */
  sentiment?: {
    /**
     * Average sentiment (positive, negative, neutral)
     */
    average: string;
    /**
     * Numerical sentiment score
     */
    score: number;
    /**
     * Sentiment progression over time
     */
    progression: Array<{
      time: number;
      sentiment: string;
      score: number;
    }>;
  };

  /**
   * Duration of the longest uninterrupted speech segment (in seconds)
   */
  longest_monologue: number;

  /**
   * Average response time to questions (in seconds)
   */
  average_response_time: number;

  /**
   * Key phrases used by this speaker
   */
  key_phrases?: Array<{
    phrase: string;
    count: number;
    timestamps: number[];
  }>;
}

/**
 * Action item extracted from the conversation
 */
interface ActionItem {
  /**
   * Text content of the action item
   */
  text: string;

  /**
   * Speaker IDs assigned to this action item
   */
  assigned_to?: number[];

  /**
   * Speaker ID who assigned this action item
   */
  assigned_by?: number;

  /**
   * Confidence score for this action item (0-1)
   */
  confidence: number;

  /**
   * Timestamp when the action item was mentioned
   */
  timestamp: number;

  /**
   * Due date for the action item (if mentioned)
   */
  due_date?: string;
}

/**
 * Overall conversation dynamics and patterns
 */
interface ConversationDynamics {
  /**
   * Turn-taking patterns in the conversation
   */
  turn_taking: {
    total_turns: number;
    average_turn_duration: number;
    turn_distribution: Record<string, number>;
  };

  /**
   * Overall engagement score (0-1)
   */
  engagement_score: number;

  /**
   * Balance of participation across speakers (0-1, closer to 1 is more balanced)
   */
  participation_balance: number;

  /**
   * Analysis of silence patterns
   */
  silence_analysis: {
    total_silence: number;
    silence_percentage: number;
    longest_silence: number;
    average_silence_duration: number;
  };

  /**
   * Total time speakers talked over each other (in seconds)
   */
  overlap_time: number;

  /**
   * Percentage of conversation with overlapping speech
   */
  overlap_percentage: number;

  /**
   * Speaking pace analysis
   */
  pace: {
    words_per_minute: Record<string, number>;
    overall_words_per_minute: number;
  };
}

/**
 * Conversation summary and key moments
 */
interface ConversationSummary {
  /**
   * Generated summary text
   */
  text: string;

  /**
   * Key moments and decisions identified in the conversation
   */
  key_moments: Array<{
    timestamp: number;
    type: "decision" | "action_item" | "disagreement" | "question" | "important_topic";
    text: string;
    speakers: number[];
  }>;
}

/**
 * Transcription data organized by speaker
 */
interface ConversationTranscription {
  /**
   * Complete conversation transcript
   */
  full_transcript: string;

  /**
   * Transcription segments organized by speaker
   */
  by_speaker: Record<string, Array<{
    text: string;
    start_time: number;
    end_time: number;
  }>>;
}

/**
 * Complete results from conversation analysis
 */
interface ConversationResults {
  /**
   * Analysis for each detected speaker
   */
  speakers: SpeakerAnalysis[];

  /**
   * Overall conversation dynamics
   */
  dynamics: ConversationDynamics;

  /**
   * Extracted action items (if requested)
   */
  action_items?: ActionItem[];

  /**
   * Conversation summary (if requested)
   */
  summary?: ConversationSummary;

  /**
   * Transcription data (if requested)
   */
  transcription?: ConversationTranscription;
}

/**
 * Complete response from synchronous conversation analysis
 */
interface ConversationResponse {
  /**
   * Metadata about the analysis request
   */
  metadata: ConversationMetadata;

  /**
   * Analysis results
   */
  results: ConversationResults;
}

/**
 * Response from asynchronous conversation analysis (callback mode)
 */
interface AsyncConversationResponse {
  /**
   * Unique identifier for the API request
   */
  request_id: string;

  /**
   * Unique identifier for the conversation
   */
  conversation_id: string;
}

/**
 * Event data for streaming conversation analytics
 */
interface StreamingEvent {
  /**
   * Type of event
   */
  event_type: "speaker_change" | "action_item" | "question" | "interruption" | "sentiment_change" | "key_phrase" | "silence" | "metrics_update";

  /**
   * Timestamp when the event occurred
   */
  timestamp: number;

  /**
   * Speaker ID associated with the event (if applicable)
   */
  speaker_id?: number;

  /**
   * Event-specific data
   */
  data: any;
}

/**
 * Response from streaming conversation analytics
 */
interface StreamingConversationResponse {
  /**
   * Unique identifier for the conversation
   */
  conversation_id: string;

  /**
   * Event data
   */
  event: StreamingEvent;
}

export type {
  ConversationMetadata,
  SpeakerAnalysis,
  ActionItem,
  ConversationDynamics,
  ConversationSummary,
  ConversationTranscription,
  ConversationResults,
  ConversationResponse,
  AsyncConversationResponse,
  StreamingEvent,
  StreamingConversationResponse,
};