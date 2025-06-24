import { ConversationMetadata } from "./ConversationMetadata";
import { ConversationResults } from "./ConversationResults";

export interface ConversationResponse {
  metadata: ConversationMetadata;
  results: ConversationResults;
}
