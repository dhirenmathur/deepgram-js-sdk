export interface ConversationDynamics {
  turn_taking?: {
    total_turns?: number;
    average_turn_duration?: number;
    turn_distribution?: Record<string, number>;
  };
  engagement_score?: number;
  participation_balance?: number;
  silence_analysis?: {
    total_silence?: number;
    silence_percentage?: number;
    longest_silence?: number;
    average_silence_duration?: number;
  };
  overlap_time?: number;
  overlap_percentage?: number;
  pace?: {
    words_per_minute?: Record<string, number>;
    overall_words_per_minute?: number;
  };
}
