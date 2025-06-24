export interface SpeakerAnalysis {
  speaker_id: number;
  speaker_label?: string;
  talk_time?: number;
  talk_percentage?: number;
  interruptions?: {
    initiated?: number;
    received?: number;
  };
  questions?: {
    asked?: number;
    answered?: number;
  };
  sentiment?: {
    average?: string;
    score?: number;
    progression?: Array<{
      time: number;
      sentiment: string;
      score: number;
    }>;
  };
  longest_monologue?: number;
  average_response_time?: number;
  key_phrases?: Array<{
    phrase: string;
    count: number;
    timestamps: number[];
  }>;
}
