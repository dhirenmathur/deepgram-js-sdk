import { AbstractLiveClient } from "./AbstractLiveClient";
import { AnalyticsEvents } from "../lib/enums";
import type { ConversationAnalysisSchema, DeepgramClientOptions } from "../lib/types";

/**
 * The `AnalyticsLiveClient` class extends the `AbstractLiveClient` class and provides real-time conversation analytics
 * through WebSocket connections. It handles streaming conversation analysis events such as speaker changes,
 * action items, sentiment shifts, and engagement metrics.
 */
export class AnalyticsLiveClient extends AbstractLiveClient {
  public namespace: string = "analytics";

  constructor(
    options: DeepgramClientOptions,
    analysisOptions: ConversationAnalysisSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ) {
    super(options);
    this.connect(analysisOptions, endpoint);
  }

  /**
   * Sets up the WebSocket connection event handlers for conversation analytics.
   * Handles analytics-specific events and emits them appropriately.
   */
  public setupConnection(): void {
    if (this.conn) {
      this.conn.onopen = () => {
        this.emit(AnalyticsEvents.Open, this);
      };

      this.conn.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type) {
            switch (data.type) {
              case "speaker_change":
                this.emit(AnalyticsEvents.SpeakerChange, data);
                break;
              case "action_item":
                this.emit(AnalyticsEvents.ActionItem, data);
                break;
              case "question":
                this.emit(AnalyticsEvents.Question, data);
                break;
              case "interruption":
                this.emit(AnalyticsEvents.Interruption, data);
                break;
              case "sentiment_change":
                this.emit(AnalyticsEvents.SentimentChange, data);
                break;
              case "key_phrase":
                this.emit(AnalyticsEvents.KeyPhrase, data);
                break;
              case "silence":
                this.emit(AnalyticsEvents.Silence, data);
                break;
              case "metrics_update":
                this.emit(AnalyticsEvents.MetricsUpdate, data);
                break;
              default:
                this.emit(AnalyticsEvents.Unhandled, data);
                break;
            }
          } else {
            this.emit(AnalyticsEvents.Unhandled, data);
          }
        } catch (error) {
          this.emit(AnalyticsEvents.Error, {
            type: "parsing_error",
            description: "Failed to parse analytics message",
            message: event.data,
            error,
          });
        }
      };

      this.conn.onerror = (event) => {
        this.emit(AnalyticsEvents.Error, event);
      };

      this.conn.onclose = (event) => {
        this.emit(AnalyticsEvents.Close, event);
      };
    }

    // Process any buffered messages
    this.sendBuffer.forEach((callback) => {
      callback();
    });
    this.sendBuffer = [];
  }

  /**
   * Configures the analytics client with updated options during runtime.
   * This allows dynamic adjustment of analysis parameters without reconnection.
   *
   * @param config - Configuration object containing analytics options to update.
   */
  public configure(config: ConversationAnalysisSchema): void {
    if (this.isConnected()) {
      const configMessage = {
        type: "configure",
        ...config,
      };
      this.send(JSON.stringify(configMessage));
    } else {
      this.emit(AnalyticsEvents.Error, {
        type: "connection_error",
        description: "Cannot configure analytics client while disconnected",
      });
    }
  }

  /**
   * Sends audio data for real-time conversation analysis.
   */
  // Inherits send() method from AbstractLiveClient
}