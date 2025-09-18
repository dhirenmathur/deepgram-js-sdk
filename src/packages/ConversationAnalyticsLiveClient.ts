import { AbstractLiveClient } from "./AbstractLiveClient";
import { ConversationAnalyticsEvents } from "../lib/enums";
import type { ConversationAnalyticsSchema, DeepgramClientOptions } from "../lib/types";
import { DeepgramError } from "../lib/errors";

/**
 * The ConversationAnalyticsLiveClient class extends AbstractLiveClient and provides functionality 
 * for setting up and managing a WebSocket connection for live conversation analytics.
 */
export class ConversationAnalyticsLiveClient extends AbstractLiveClient {
  public namespace: string = "conversation";
  private _analyticsOptions: ConversationAnalyticsSchema;

  /**
   * Constructs a new ConversationAnalyticsLiveClient instance.
   *
   * @param options - The DeepgramClientOptions to use for the client connection.
   * @param analyticsOptions - Optional conversation analytics configuration options.
   * @param endpoint - Optional WebSocket endpoint. Defaults to ":version/analyze/conversation/stream".
   */
  constructor(
    options: DeepgramClientOptions,
    analyticsOptions: ConversationAnalyticsSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ) {
    super(options);

    // Validate required parameters for certain features
    if (analyticsOptions.detect_speakers && analyticsOptions.max_speakers && analyticsOptions.max_speakers > 20) {
      throw new DeepgramError("Maximum speakers limit is 20");
    }

    if (analyticsOptions.min_speakers && analyticsOptions.max_speakers && 
        analyticsOptions.min_speakers > analyticsOptions.max_speakers) {
      throw new DeepgramError("Minimum speakers cannot be greater than maximum speakers");
    }

    this._analyticsOptions = analyticsOptions;
    this.connect(analyticsOptions, endpoint);
  }

  /**
   * Sets up the WebSocket connection event handlers for conversation analytics.
   * Handles various conversation-specific events such as speaker changes, action items, 
   * interruptions, sentiment changes, and real-time metrics updates.
   */
  public setupConnection(): void {
    if (this.conn) {
      this.conn.onopen = () => {
        this.emit(ConversationAnalyticsEvents.Open, this);
      };

      this.conn.onclose = (event: any) => {
        this.emit(ConversationAnalyticsEvents.Close, event);
      };

      this.conn.onerror = (event: ErrorEvent) => {
        this.emit(ConversationAnalyticsEvents.Error, event);
      };

      this.conn.onmessage = (event: MessageEvent) => {
        try {
          const data: any = JSON.parse(event.data.toString());

          // Handle different types of conversation analytics events
          switch (data.type) {
            case ConversationAnalyticsEvents.Metadata:
              this.emit(ConversationAnalyticsEvents.Metadata, data);
              break;
            case ConversationAnalyticsEvents.SpeakerChange:
              this.emit(ConversationAnalyticsEvents.SpeakerChange, data);
              break;
            case ConversationAnalyticsEvents.ActionItem:
              this.emit(ConversationAnalyticsEvents.ActionItem, data);
              break;
            case ConversationAnalyticsEvents.Interruption:
              this.emit(ConversationAnalyticsEvents.Interruption, data);
              break;
            case ConversationAnalyticsEvents.SentimentChange:
              this.emit(ConversationAnalyticsEvents.SentimentChange, data);
              break;
            case ConversationAnalyticsEvents.Question:
              this.emit(ConversationAnalyticsEvents.Question, data);
              break;
            case ConversationAnalyticsEvents.KeyPhrase:
              this.emit(ConversationAnalyticsEvents.KeyPhrase, data);
              break;
            case ConversationAnalyticsEvents.EngagementUpdate:
              this.emit(ConversationAnalyticsEvents.EngagementUpdate, data);
              break;
            case ConversationAnalyticsEvents.MetricsUpdate:
              this.emit(ConversationAnalyticsEvents.MetricsUpdate, data);
              break;
            case ConversationAnalyticsEvents.ConversationComplete:
              this.emit(ConversationAnalyticsEvents.ConversationComplete, data);
              break;
            default:
              this.emit(ConversationAnalyticsEvents.Unhandled, data);
          }
        } catch (error) {
          this.emit(ConversationAnalyticsEvents.Error, {
            event,
            message: "Unable to parse data as JSON.",
            error,
          });
        }
      };
    }
  }

  /**
   * Updates conversation analytics configuration during a live session.
   *
   * @param config - The updated analytics configuration options.
   */
  public configure(config: Partial<ConversationAnalyticsSchema>): void {
    // Merge with existing options
    this._analyticsOptions = { ...this._analyticsOptions, ...config };

    this.send(
      JSON.stringify({
        type: "Configure",
        config: config,
      })
    );
  }

  /**
   * Sends a KeepAlive message to maintain the WebSocket connection.
   */
  public keepAlive(): void {
    this.send(
      JSON.stringify({
        type: "KeepAlive",
      })
    );
  }

  /**
   * Finalizes the conversation analysis and flushes any remaining data.
   */
  public finalize(): void {
    this.send(
      JSON.stringify({
        type: "Finalize",
      })
    );
  }

  /**
   * Requests the server to close the WebSocket connection.
   */
  public requestClose(): void {
    this.send(
      JSON.stringify({
        type: "CloseStream",
      })
    );
  }

  /**
   * Gets the current analytics configuration.
   */
  public getAnalyticsOptions(): ConversationAnalyticsSchema {
    return { ...this._analyticsOptions };
  }
}

export { ConversationAnalyticsLiveClient as ConversationLiveClient };