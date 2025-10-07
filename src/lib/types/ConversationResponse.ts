/**
 * Metadata about the conversation analysis request and processing
 */
interface ConversationMetadata {
  /** Unique identifier for the analysis request */
  request_id: string;
  
  /** Unique identifier for the conversation */
  conversation_id: string;
  
  /** Timestamp when the analysis was created */
  created: string;
  
  /** Duration of the conversation in seconds */
  duration: number;
  
  /** Number of audio channels */
  channels: number;
  
  /** Number of detected speakers */
  num_speakers: number;
  
  /** Language code of the conversation */
  language: string;
  
  /** Models used for analysis */
  models: string[];
  
  /** Additional model information */
  model_info: Record<string, any>;
}

/**
 * Analysis results for a specific speaker
 */
interface SpeakerAnalysis {
  /** Numeric identifier for the speaker */
  speaker_id: number;
  
  /** Optional custom label for the speaker */
  speaker_label?: string;
  
  /** Total time the speaker was talking in seconds */
  talk_time: number;
  
  /** Percentage of total conversation time the speaker was talking */
  talk_percentage: number;
  
  /** Interruption statistics */
  interruptions: {
    /** Number of times this speaker interrupted others */
    initiated: number;
    /** Number of times this speaker was interrupted */
    received: number;
  };
  
  /** Question analysis */
  questions: {
    /** Number of questions asked by this speaker */
    asked: number;
    /** Number of questions answered by this speaker */
    answered: number;
  };
  
  /** Sentiment analysis for the speaker */
  sentiment: {
    /** Average sentiment for the speaker */
    average: "positive" | "negative" | "neutral";
    /** Numeric sentiment score (-1.0 to 1.0) */
    score: number;
    /** Sentiment progression throughout the conversation */
    progression: Array<{
      /** Timestamp in seconds */
      time: number;
      /** Sentiment label */
      sentiment: "positive" | "negative" | "neutral";
      /** Numeric sentiment score */
      score: number;
    }>;
  };
  
  /** Engagement metrics */
  engagement: {
    /** Overall engagement score */
    score: number;
    /** Engagement level classification */
    level: "high" | "medium" | "low";
  };
}

/**
 * Overall conversation dynamics and flow analysis
 */
interface ConversationDynamics {
  /** Overall conversation flow rating */
  flow_score: number;
  
  /** Total number of speaker changes */
  speaker_changes: number;
  
  /** Average time between speaker changes */
  average_speaker_turn: number;
  
  /** Periods of silence detected */
  silence_periods: Array<{
    start: number;
    end: number;
    duration: number;
  }>;
  
  /** Overall conversation pace */
  pace: "fast" | "medium" | "slow";
}

/**
 * Extracted action item from the conversation
 */
interface ActionItem {
  /** Unique identifier for the action item */
  id: string;
  
  /** Description of the action item */
  description: string;
  
  /** Timestamp when mentioned in the conversation */
  timestamp: number;
  
  /** Speaker who mentioned the action item */
  speaker_id: number;
  
  /** Confidence score for the extraction */
  confidence: number;
}

/**
 * Generated conversation summary
 */
interface ConversationSummary {
  /** Brief summary of the conversation */
  summary: string;
  
  /** Key topics discussed */
  key_topics: string[];
  
  /** Important moments with timestamps */
  key_moments: Array<{
    timestamp: number;
    description: string;
    importance: "high" | "medium" | "low";
  }>;
}

/**
 * Complete conversation analysis response
 */
interface ConversationResponse {
  /** Metadata about the analysis */
  metadata: ConversationMetadata;
  
  /** Analysis results */
  results: {
    /** Per-speaker analysis results */
    speakers: SpeakerAnalysis[];
    
    /** Overall conversation dynamics */
    dynamics: ConversationDynamics;
    
    /** Extracted action items (if requested) */
    action_items?: ActionItem[];
    
    /** Conversation summary (if requested) */
    summary?: ConversationSummary;
    
    /** Transcription results (if requested) */
    transcription?: any; // Can reference existing transcription types
  };
}

export type { 
  ConversationMetadata, 
  SpeakerAnalysis, 
  ConversationDynamics, 
  ActionItem, 
  ConversationSummary, 
  ConversationResponse 
};