import { AbstractLiveClient } from "./AbstractLiveClient";
import { ConversationAnalyticsEvents } from "../lib/enums";
import type {
  ConversationAnalyticsStreamOptions,
  ConversationAnalyticsLiveConfigOptions,
  DeepgramClientOptions,
  StreamingConversationResponse
} from "../lib/types";

/**
 * The `ConversationAnalyticsLiveClient` class extends the `AbstractLiveClient` class and provides real-time conversation analytics capabilities.
 * It establishes a WebSocket connection to stream conversation data and receive real-time analysis events including speaker changes,
 * action items, questions, interruptions, sentiment changes, and engagement metrics.
 */
export class ConversationAnalyticsLiveClient extends AbstractLiveClient {
  public namespace: string = "conversation_analytics";

  constructor(
    options: DeepgramClientOptions,
    streamOptions: ConversationAnalyticsStreamOptions = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ) {
    super(options);
    this.connect(streamOptions, endpoint);
  }

  /**
   * Sets up the WebSocket connection event handlers for conversation analytics events.
   */
  public setupConnection(): void {
    if (this.conn) {
      this.conn.onopen = () => {
        this.emit(ConversationAnalyticsEvents.Open);

        // Send any buffered messages
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      };

      this.conn.onmessage = (event) => {
        try {
          const data: StreamingConversationResponse = JSON.parse(event.data.toString());
          
          switch (data.event?.type) {
            case "speaker_change":
              this.emit(ConversationAnalyticsEvents.SpeakerChange, data);
              break;
            case "action_item":
              this.emit(ConversationAnalyticsEvents.ActionItem, data);
              break;
            case "question":
              this.emit(ConversationAnalyticsEvents.Question, data);
              break;
            case "interruption":
              this.emit(ConversationAnalyticsEvents.Interruption, data);
              break;
            case "sentiment_change":
              this.emit(ConversationAnalyticsEvents.SentimentChange, data);
              break;
            case "key_phrase":
              this.emit(ConversationAnalyticsEvents.KeyPhrase, data);
              break;
            case "silence":
              this.emit(ConversationAnalyticsEvents.Silence, data);
              break;
            case "metrics_update":
              this.emit(ConversationAnalyticsEvents.MetricsUpdate, data);
              break;
            default:
              this.emit(ConversationAnalyticsEvents.Unhandled, data);
              break;
          }
        } catch (error) {
          this.emit(ConversationAnalyticsEvents.Error, {
            error,
            type: "message_parse_error",
            description: "Failed to parse WebSocket message",
          });
        }
      };

      this.conn.onclose = (event) => {
        this.emit(ConversationAnalyticsEvents.Close, event);
      };

      this.conn.onerror = (event) => {
        this.emit(ConversationAnalyticsEvents.Error, event);
      };
    }
  }

  /**
   * Sends a real-time configuration update to the conversation analytics stream.
   * 
   * @param config - The configuration options to update during live analysis.
   */
  public configure(config: ConversationAnalyticsLiveConfigOptions): void {
    this.send(JSON.stringify({
      type: "Configure",
      ...config
    }));
  }

  /**
   * Sends a keep-alive message to maintain the WebSocket connection.
   */
  public keepAlive(): void {
    this.send(JSON.stringify({
      type: "KeepAlive"
    }));
  }

  /**
   * Signals the end of the conversation for final analysis processing.
   */
  public finalize(): void {
    this.send(JSON.stringify({
      type: "Finalize"
    }));
  }
}