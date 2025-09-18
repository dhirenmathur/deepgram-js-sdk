import { AbstractLiveClient } from "./AbstractLiveClient";
import { ConversationEvents } from "../lib/enums";
import type { ConversationAnalyzeSchema, DeepgramClientOptions } from "../lib/types";

/**
 * The `ConversationLiveClient` class extends the `AbstractLiveClient` class and provides functionality 
 * for setting up and managing a WebSocket connection for real-time conversation analysis.
 *
 * Handles real-time events such as speaker changes, action items, questions, interruptions,
 * sentiment changes, key phrases, and metrics updates.
 */
export class ConversationLiveClient extends AbstractLiveClient {
  public namespace: string = "conversation";

  /**
   * Constructs a new `ConversationLiveClient` instance with the provided options.
   *
   * @param options - The `DeepgramClientOptions` to use for the client connection.
   * @param analysisOptions - Optional conversation analysis configuration.
   * @param endpoint - Optional WebSocket endpoint. Defaults to ":version/analyze/conversation/stream".
   */
  constructor(
    options: DeepgramClientOptions,
    analysisOptions: ConversationAnalyzeSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ) {
    super(options);
    this.connect(analysisOptions, endpoint);
  }

  /**
   * Sets up the WebSocket connection event handlers for conversation analysis.
   * 
   * Handles various conversation-specific events:
   * - Connection lifecycle (open, close, error)
   * - Real-time analysis events (speaker_change, action_item, question, etc.)
   * - Metrics and sentiment updates
   */
  public setupConnection(): void {
    if (this.conn) {
      this.conn.onopen = () => {
        this.emit(ConversationEvents.Open, this);
      };

      this.conn.onclose = (event: any) => {
        this.emit(ConversationEvents.Close, event);
      };

      this.conn.onerror = (event: ErrorEvent) => {
        this.emit(ConversationEvents.Error, event);
      };

      this.conn.onmessage = (event: MessageEvent) => {
        try {
          const data: any = JSON.parse(event.data.toString());

          // Handle conversation-specific events
          switch (data.type) {
            case ConversationEvents.SpeakerChange:
              this.emit(ConversationEvents.SpeakerChange, data);
              break;
            case ConversationEvents.ActionItem:
              this.emit(ConversationEvents.ActionItem, data);
              break;
            case ConversationEvents.Question:
              this.emit(ConversationEvents.Question, data);
              break;
            case ConversationEvents.Interruption:
              this.emit(ConversationEvents.Interruption, data);
              break;
            case ConversationEvents.SentimentChange:
              this.emit(ConversationEvents.SentimentChange, data);
              break;
            case ConversationEvents.KeyPhrase:
              this.emit(ConversationEvents.KeyPhrase, data);
              break;
            case ConversationEvents.Silence:
              this.emit(ConversationEvents.Silence, data);
              break;
            case ConversationEvents.MetricsUpdate:
              this.emit(ConversationEvents.MetricsUpdate, data);
              break;
            default:
              this.emit(ConversationEvents.Unhandled, data);
          }
        } catch (error) {
          this.emit(ConversationEvents.Error, {
            event,
            message: "Unable to parse conversation data as JSON.",
            error,
          });
        }
      };
    }
  }

  /**
   * Sends a "KeepAlive" message to the server to maintain the connection.
   */
  public keepAlive(): void {
    this.send(
      JSON.stringify({
        type: "KeepAlive",
      })
    );
  }

  /**
   * Requests the server to close the conversation analysis stream.
   */
  public requestClose(): void {
    this.send(
      JSON.stringify({
        type: "CloseStream",
      })
    );
  }
}