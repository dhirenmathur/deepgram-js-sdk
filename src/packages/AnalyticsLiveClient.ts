import { AbstractLiveClient } from "./AbstractLiveClient";
import { AnalyticsLiveEvents } from "../lib/enums";
import type {
  ConversationAnalyticsSchema,
  LiveConfigOptions,
  DeepgramClientOptions,
  StreamingConversationResponse,
} from "../lib/types";
import { DeepgramError } from "../lib/errors";

/**
 * The `AnalyticsLiveClient` class extends `AbstractLiveClient` and provides real-time conversation analytics
 * functionality over WebSocket connections. It emits various events based on analytics insights received
 * from the Deepgram Conversation Analytics API.
 */
export class AnalyticsLiveClient extends AbstractLiveClient {
  public namespace: string = "analytics";

  constructor(
    options: DeepgramClientOptions,
    analyticsOptions: ConversationAnalyticsSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ) {
    super(options);

    // Validation specific to conversation analytics
    if (analyticsOptions.min_speakers && analyticsOptions.max_speakers) {
      if (analyticsOptions.min_speakers > analyticsOptions.max_speakers) {
        throw new DeepgramError("min_speakers cannot be greater than max_speakers");
      }
    }

    // Validate speaker count ranges
    if (analyticsOptions.min_speakers && (analyticsOptions.min_speakers < 1 || analyticsOptions.min_speakers > 10)) {
      throw new DeepgramError("min_speakers must be between 1 and 10");
    }

    if (analyticsOptions.max_speakers && (analyticsOptions.max_speakers < 1 || analyticsOptions.max_speakers > 20)) {
      throw new DeepgramError("max_speakers must be between 1 and 20");
    }

    // Validate silence threshold
    if (analyticsOptions.silence_threshold && (analyticsOptions.silence_threshold < 0.1 || analyticsOptions.silence_threshold > 5.0)) {
      throw new DeepgramError("silence_threshold must be between 0.1 and 5.0 seconds");
    }

    // Validate metrics interval
    if (analyticsOptions.realtime_metrics_interval && (analyticsOptions.realtime_metrics_interval < 1.0 || analyticsOptions.realtime_metrics_interval > 60.0)) {
      throw new DeepgramError("realtime_metrics_interval must be between 1.0 and 60.0 seconds");
    }

    this.connect(analyticsOptions, endpoint);
  }

  /**
   * Sets up the WebSocket connection event handlers for analytics-specific events.
   */
  public setupConnection(): void {
    if (!this.conn) return;

    this.conn.addEventListener("open", () => {
      this.emit(AnalyticsLiveEvents.Open, this);
    });

    this.conn.addEventListener("close", (event: any) => {
      this.emit(AnalyticsLiveEvents.Close, event);
    });

    this.conn.addEventListener("error", (event: any) => {
      this.emit(AnalyticsLiveEvents.Error, event);
    });

    this.conn.addEventListener("message", (event: any) => {
      try {
        const data: StreamingConversationResponse = JSON.parse(event.data);

        // Handle different event types from the analytics API
        switch (data.event?.event_type) {
          case "speaker_change":
            this.emit(AnalyticsLiveEvents.SpeakerChange, data);
            break;
          case "action_item":
            this.emit(AnalyticsLiveEvents.ActionItem, data);
            break;
          case "question":
            this.emit(AnalyticsLiveEvents.Question, data);
            break;
          case "interruption":
            this.emit(AnalyticsLiveEvents.Interruption, data);
            break;
          case "sentiment_change":
            this.emit(AnalyticsLiveEvents.SentimentChange, data);
            break;
          case "key_phrase":
            this.emit(AnalyticsLiveEvents.KeyPhrase, data);
            break;
          case "silence":
            this.emit(AnalyticsLiveEvents.Silence, data);
            break;
          case "metrics_update":
            this.emit(AnalyticsLiveEvents.MetricsUpdate, data);
            break;
          default:
            // Handle unknown event types gracefully
            this.log("warn", `Unknown analytics event type: ${data.event?.event_type}`, data);
            this.emit(AnalyticsLiveEvents.Unhandled, data);
        }
      } catch (error) {
        this.emit(AnalyticsLiveEvents.Error, {
          error,
          message: "Failed to parse analytics message",
          data: event.data,
        });
      }
    });

    // Process any buffered send operations once connected
    if (this.sendBuffer.length > 0) {
      this.sendBuffer.forEach((fn) => fn());
      this.sendBuffer = [];
    }
  }

  /**
   * Configures the analytics session with additional options.
   * 
   * @param config - Configuration options to apply to the analytics session.
   */
  public configure(config: LiveConfigOptions): void {
    this.send(JSON.stringify({ type: "Configure", ...config }));
  }

  /**
   * Sends keep-alive message to maintain connection.
   */
  public keepAlive(): void {
    this.send(JSON.stringify({ type: "KeepAlive" }));
  }

  /**
   * Requests the server to close the analytics session gracefully.
   */
  public requestClose(): void {
    this.send(JSON.stringify({ type: "CloseStream" }));
  }

  /**
   * Sends analytics-specific control messages.
   * 
   * @param message - The control message to send.
   */
  public sendControlMessage(message: { type: string; [key: string]: any }): void {
    this.send(JSON.stringify(message));
  }
}

export { AnalyticsLiveClient as ConversationAnalyticsLiveClient };