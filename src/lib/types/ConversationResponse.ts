/**
 * Response types for Conversation Analytics API.
 * These types define the structure of data returned by the analytics endpoints.
 */

/**
 * Metadata about the conversation analysis request and processing.
 */
export interface ConversationMetadata {
  /** Unique identifier for the API request */
  request_id: string;
  
  /** Unique identifier for the conversation */
  conversation_id: string;
  
  /** ISO timestamp when the analysis was created */
  created: string;
  
  /** Duration of the conversation in seconds */
  duration: number;
  
  /** Number of audio channels processed */
  channels: number;
  
  /** Number of unique speakers detected */
  num_speakers: number;
  
  /** Primary language detected in the conversation */
  language: string;
  
  /** List of AI models used for analysis */
  models: string[];
  
  /** Detailed information about each model used */
  model_info: Record<string, { name: string; version: string }>;
}

/**
 * Analysis results for an individual speaker in the conversation.
 */
export interface SpeakerAnalysis {
  /** Unique identifier for the speaker */
  speaker_id: number;
  
  /** Optional custom label for the speaker */
  speaker_label?: string;
  
  /** Total time the speaker was talking (in seconds) */
  talk_time: number;
  
  /** Percentage of total conversation time this speaker talked */
  talk_percentage: number;
  
  /** Interruption statistics */
  interruptions: {
    /** Number of times this speaker interrupted others */
    initiated: number;
    /** Number of times this speaker was interrupted */
    received: number;
  };
  
  /** Question and answer statistics */
  questions: {
    /** Number of questions this speaker asked */
    asked: number;
    /** Number of questions this speaker answered */
    answered: number;
  };
  
  /** Sentiment analysis for the speaker */
  sentiment: {
    /** Overall average sentiment ("positive", "negative", "neutral") */
    average: string;
    /** Numerical sentiment score (-1.0 to 1.0) */
    score: number;
    /** Sentiment progression throughout the conversation */
    progression: Array<{
      /** Time in seconds from start of conversation */
      time: number;
      /** Sentiment at this time point */
      sentiment: string;
      /** Numerical score at this time point */
      score: number;
    }>;
  };
  
  /** Duration of the longest uninterrupted speech segment (in seconds) */
  longest_monologue: number;
  
  /** Average time to respond when addressed (in seconds) */
  average_response_time: number;
  
  /** Key phrases frequently used by this speaker */
  key_phrases: Array<{
    /** The phrase text */
    phrase: string;
    /** Number of times the phrase was used */
    count: number;
    /** Timestamps when the phrase was used */
    timestamps: number[];
  }>;
}

/**
 * Action item extracted from the conversation.
 */
export interface ActionItem {
  /** The action item text/description */
  text: string;
  
  /** Speaker IDs of who the task is assigned to */
  assigned_to: number[];
  
  /** Speaker ID of who assigned the task */
  assigned_by: number;
  
  /** Confidence score for this action item (0.0 to 1.0) */
  confidence: number;
  
  /** Timestamp in seconds when the action item was mentioned */
  timestamp: number;
  
  /** Optional due date if mentioned in conversation */
  due_date?: string;
}

/**
 * Overall conversation dynamics and flow analysis.
 */
export interface ConversationDynamics {
  /** Turn-taking analysis */
  turn_taking: {
    /** Total number of speaking turns */
    total_turns: number;
    /** Average duration of each turn (in seconds) */
    average_turn_duration: number;
    /** Distribution of turns per speaker */
    turn_distribution: Record<string, number>;
  };
  
  /** Overall engagement score (0.0 to 1.0) */
  engagement_score: number;
  
  /** Balance of participation across speakers (0.0 to 1.0, higher = more balanced) */
  participation_balance: number;
  
  /** Silence pattern analysis */
  silence_analysis: {
    /** Total silence time in seconds */
    total_silence: number;
    /** Percentage of conversation that was silent */
    silence_percentage: number;
    /** Longest continuous silence period (in seconds) */
    longest_silence: number;
    /** Average silence duration between speaking turns */
    average_silence_duration: number;
  };
  
  /** Total time when speakers were talking simultaneously (in seconds) */
  overlap_time: number;
  
  /** Percentage of conversation with speaker overlap */
  overlap_percentage: number;
  
  /** Speaking pace analysis */
  pace: {
    /** Words per minute for each speaker */
    words_per_minute: Record<string, number>;
    /** Overall conversation pace */
    overall_words_per_minute: number;
  };
}

/**
 * Complete results of conversation analysis.
 */
export interface ConversationResults {
  /** Analysis for each detected speaker */
  speakers: SpeakerAnalysis[];
  
  /** Overall conversation dynamics */
  dynamics: ConversationDynamics;
  
  /** Action items extracted from the conversation (if requested) */
  action_items?: ActionItem[];
  
  /** Conversation summary (if requested) */
  summary?: {
    /** Generated summary text */
    text: string;
    /** Key moments and decisions in the conversation */
    key_moments: Array<{
      /** Time in seconds when the moment occurred */
      timestamp: number;
      /** Type of key moment */
      type: "decision" | "action_item" | "disagreement" | "question" | "important_topic";
      /** Description of the moment */
      text: string;
      /** Speakers involved in this moment */
      speakers: number[];
    }>;
  };
  
  /** Full transcription (if requested) */
  transcription?: {
    /** Complete conversation transcript */
    full_transcript: string;
    /** Transcript organized by speaker */
    by_speaker: Record<string, Array<{
      /** Transcript text for this segment */
      text: string;
      /** Start time in seconds */
      start_time: number;
      /** End time in seconds */
      end_time: number;
    }>>;
  };
}

/**
 * Complete conversation analysis response.
 */
export interface ConversationResponse {
  /** Request and conversation metadata */
  metadata: ConversationMetadata;
  
  /** Analysis results */
  results: ConversationResults;
}

/**
 * Response type for synchronous conversation analysis.
 */
export type SyncConversationResponse = ConversationResponse;

/**
 * Response type for asynchronous conversation analysis requests.
 */
export interface AsyncConversationResponse {
  /** Unique identifier for the API request */
  request_id: string;
  
  /** Unique identifier for the conversation */
  conversation_id: string;
  
  /** Current status of the analysis */
  status: "processing" | "queued";
}

/**
 * Real-time streaming event from live conversation analysis.
 */
export interface StreamingEvent {
  /** Type of event that occurred */
  event_type: "speaker_change" | "action_item" | "question" | "interruption" | "sentiment_change" | "key_phrase" | "silence" | "metrics_update";
  
  /** Timestamp in seconds when the event occurred */
  timestamp: number;
  
  /** Speaker ID associated with the event (if applicable) */
  speaker_id?: number;
  
  /** Event-specific data payload */
  data: Record<string, unknown>;
}

/**
 * Response type for streaming conversation analysis.
 */
export interface StreamingConversationResponse {
  /** Unique identifier for the conversation */
  conversation_id: string;
  
  /** The streaming event that occurred */
  event: StreamingEvent;
}