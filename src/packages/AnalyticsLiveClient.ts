import { AbstractLiveClient } from "./AbstractLiveClient";
import { AnalyticsEvents } from "../lib/enums";
import type {
  ConversationAnalysisSchema,
  DeepgramClientOptions,
  AnalyticsLiveEvent,
} from "../lib/types";

/**
 * The `AnalyticsLiveClient` class extends the `AbstractLiveClient` class and provides functionality for setting up and managing a WebSocket connection for real-time conversation analytics.
 */
export class AnalyticsLiveClient extends AbstractLiveClient {
  public namespace: string = "analytics";

  /**
   * Constructs a new `AnalyticsLiveClient` instance with the provided options.
   *
   * @param options - The `DeepgramClientOptions` to use for the client connection.
   * @param analysisOptions - An optional `ConversationAnalysisSchema` object containing additional configuration options for the analytics.
   * @param endpoint - An optional string representing the WebSocket endpoint to connect to. Defaults to `:version/analyze/conversation/stream`.
   */
  constructor(
    options: DeepgramClientOptions,
    analysisOptions: ConversationAnalysisSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ) {
    super(options);
    this.connect(analysisOptions, endpoint);
  }

  /**
   * Sets up the connection event handlers.
   * This method handles various events that can occur on the WebSocket connection for real-time analytics.
   */
  public setupConnection(): void {
    if (this.conn) {
      this.conn.onopen = () => {
        this.emit(AnalyticsEvents.Open, this);

        // Process any buffered sends
        if (this.sendBuffer.length > 0) {
          this.sendBuffer.forEach((callback) => callback());
          this.sendBuffer = [];
        }
      };

      this.conn.onclose = (event: any) => {
        this.emit(AnalyticsEvents.Close, event);
      };

      this.conn.onerror = (event: ErrorEvent) => {
        this.emit(AnalyticsEvents.Error, event);
      };

      this.conn.onmessage = (event: MessageEvent) => {
        try {
          const data: AnalyticsLiveEvent = JSON.parse(event.data.toString());

          switch (data.type) {
            case AnalyticsEvents.SpeakerChange:
              this.emit(AnalyticsEvents.SpeakerChange, data);
              break;
            case AnalyticsEvents.ActionItem:
              this.emit(AnalyticsEvents.ActionItem, data);
              break;
            case AnalyticsEvents.Question:
              this.emit(AnalyticsEvents.Question, data);
              break;
            case AnalyticsEvents.Interruption:
              this.emit(AnalyticsEvents.Interruption, data);
              break;
            case AnalyticsEvents.SentimentChange:
              this.emit(AnalyticsEvents.SentimentChange, data);
              break;
            case AnalyticsEvents.KeyPhrase:
              this.emit(AnalyticsEvents.KeyPhrase, data);
              break;
            case AnalyticsEvents.Silence:
              this.emit(AnalyticsEvents.Silence, data);
              break;
            case AnalyticsEvents.MetricsUpdate:
              this.emit(AnalyticsEvents.MetricsUpdate, data);
              break;
            default:
              this.emit(AnalyticsEvents.Unhandled, data);
              break;
          }
        } catch (error) {
          this.emit(AnalyticsEvents.Error, {
            event,
            message: "Unable to parse `data` as JSON.",
            error,
          });
        }
      };
    }
  }

  /**
   * Sends additional configuration to the connected analytics session.
   *
   * @param config - The configuration options to apply to the analytics session.
   */
  public configure(config: Partial<ConversationAnalysisSchema>): void {
    this.send(
      JSON.stringify({
        type: "Configure",
        config,
      })
    );
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
   * Sends a "Finalize" message to flush any analysis data sitting in the server's buffer.
   */
  public finalize(): void {
    this.send(
      JSON.stringify({
        type: "Finalize",
      })
    );
  }

  /**
   * Requests the server close the connection.
   */
  public requestClose(): void {
    this.send(
      JSON.stringify({
        type: "CloseStream",
      })
    );
  }
}