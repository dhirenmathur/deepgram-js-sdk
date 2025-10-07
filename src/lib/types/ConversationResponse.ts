/**
 * Metadata information about a conversation analysis request.
 */
export interface ConversationMetadata {
  /** Unique identifier for the analysis request */
  request_id: string;
  
  /** Unique identifier for the conversation */
  conversation_id: string;
  
  /** ISO timestamp when the analysis was created */
  created: string;
  
  /** Duration of the conversation in seconds */
  duration: number;
  
  /** Number of audio channels analyzed */
  channels: number;
  
  /** Number of speakers detected in the conversation */
  num_speakers: number;
  
  /** Language detected/used for the analysis */
  language: string;
  
  /** Array of model names used in the analysis */
  models: string[];
  
  /** Detailed information about each model used */
  model_info: Record<string, { name: string; version: string }>;
}

/**
 * Detailed analysis for each speaker in the conversation.
 */
export interface SpeakerAnalysis {
  /** Unique identifier for the speaker */
  speaker_id: number;
  
  /** Optional custom label for the speaker */
  speaker_label?: string;
  
  /** Total speaking time in seconds */
  talk_time: number;
  
  /** Percentage of total conversation time this speaker talked */
  talk_percentage: number;
  
  /** Interruption metrics for this speaker */
  interruptions: {
    /** Number of times this speaker interrupted others */
    initiated: number;
    /** Number of times this speaker was interrupted */
    received: number;
  };
  
  /** Question-related metrics */
  questions: {
    /** Number of questions this speaker asked */
    asked: number;
    /** Number of questions this speaker answered */
    answered: number;
  };
  
  /** Sentiment analysis for this speaker (optional) */
  sentiment?: {
    /** Average sentiment for this speaker */
    average: string;
    /** Numerical sentiment score (-1 to 1) */
    score: number;
    /** Sentiment progression throughout the conversation */
    progression: Array<{
      /** Timestamp in seconds */
      time: number;
      /** Sentiment label (positive/negative/neutral) */
      sentiment: string;
      /** Numerical sentiment score */
      score: number;
    }>;
  };
  
  /** Length of the longest continuous speech segment in seconds */
  longest_monologue: number;
  
  /** Average response time when answering questions in seconds */
  average_response_time: number;
  
  /** Key phrases frequently used by this speaker */
  key_phrases?: Array<{
    /** The key phrase */
    phrase: string;
    /** Number of times used */
    count: number;
    /** Timestamps when the phrase was used */
    timestamps: number[];
  }>;
}

/**
 * Overall conversation dynamics and flow analysis.
 */
export interface ConversationDynamics {
  /** Overall conversation pace (words per minute) */
  pace: number;
  
  /** Total number of speaker changes */
  speaker_changes: number;
  
  /** Average length of speaking turns in seconds */
  average_turn_length: number;
  
  /** Total silence time in seconds */
  total_silence_time: number;
  
  /** Percentage of conversation that was silence */
  silence_percentage: number;
  
  /** Distribution of speaking time among participants */
  speaking_distribution: Array<{
    speaker_id: number;
    percentage: number;
  }>;
  
  /** Engagement score (0-100) indicating overall conversation quality */
  engagement_score: number;
  
  /** Flow quality metrics */
  flow_metrics: {
    /** Smoothness of transitions between speakers */
    transition_smoothness: number;
    /** Overlapping speech percentage */
    overlap_percentage: number;
    /** Conversational balance (how evenly distributed the speaking was) */
    balance_score: number;
  };
}

/**
 * Action items extracted from the conversation.
 */
export interface ActionItem {
  /** Unique identifier for the action item */
  id: string;
  
  /** Text description of the action item */
  text: string;
  
  /** Timestamp when the action item was mentioned */
  timestamp: number;
  
  /** Speaker who mentioned or was assigned the action item */
  speaker_id: number;
  
  /** Confidence score (0-1) for this action item extraction */
  confidence: number;
  
  /** Optional due date if mentioned in conversation */
  due_date?: string;
  
  /** Priority level if determinable from context */
  priority?: "low" | "medium" | "high";
}

/**
 * Generated summary of the conversation.
 */
export interface ConversationSummary {
  /** Brief overview of the conversation */
  overview: string;
  
  /** Key topics discussed */
  key_topics: string[];
  
  /** Main outcomes or decisions made */
  outcomes: string[];
  
  /** Next steps identified */
  next_steps: string[];
  
  /** Confidence score for the summary quality */
  confidence: number;
}

/**
 * Transcription data (if included).
 */
export interface ConversationTranscription {
  /** Full text transcript */
  text: string;
  
  /** Speaker-segmented transcript */
  segments: Array<{
    speaker_id: number;
    start_time: number;
    end_time: number;
    text: string;
  }>;
}

/**
 * Complete response structure for conversation analysis.
 */
export interface ConversationResponse {
  /** Request and conversation metadata */
  metadata: ConversationMetadata;
  
  /** Analysis results */
  results: {
    /** Per-speaker analysis */
    speakers: SpeakerAnalysis[];
    /** Overall conversation dynamics */
    dynamics: ConversationDynamics;
    /** Extracted action items (optional) */
    action_items?: ActionItem[];
    /** Conversation summary (optional) */
    summary?: ConversationSummary;
    /** Transcription data (optional) */
    transcription?: ConversationTranscription;
  };
}

/**
 * Synchronous conversation analysis response (immediate results).
 */
export type SyncConversationResponse = ConversationResponse;

/**
 * Asynchronous conversation analysis response (callback-based).
 */
export interface AsyncConversationResponse {
  /** Unique identifier for the analysis request */
  request_id: string;
  
  /** Status of the asynchronous processing */
  status: "processing" | "completed" | "failed";
  
  /** Callback URL where results will be sent */
  callback_url?: string;
  
  /** Estimated completion time */
  estimated_completion?: string;
  
  /** Progress percentage (0-100) */
  progress?: number;
}