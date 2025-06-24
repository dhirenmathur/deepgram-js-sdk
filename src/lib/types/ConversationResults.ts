import { SpeakerAnalysis } from "./SpeakerAnalysis";
import { ConversationDynamics } from "./ConversationDynamics";
import { ActionItem } from "./ActionItem";

export interface ConversationResults {
  speakers: SpeakerAnalysis[];
  dynamics: ConversationDynamics;
  action_items?: ActionItem[];
  summary?: {
    text: string;
    key_moments?: Array<{
      timestamp: number;
      type: string;
      text: string;
      speakers?: number[];
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
