import { AbstractLiveClient } from "./AbstractLiveClient";
import { ConversationAnalyticsEvents } from "../lib/enums";
import type { 
  ConversationAnalysisSchema, 
  ConversationStreamingResponse,
  DeepgramClientOptions 
} from "../lib/types";

/**
 * The `AnalyticsLiveClient` class extends the `AbstractLiveClient` class and provides real-time conversation analysis functionality.
 * It connects to the Deepgram API via WebSocket to receive streaming conversation analytics data including speaker changes,
 * sentiment analysis, action items, interruptions, and other conversational insights.
 *
 * Events emitted:
 * - `Open`: Connection opened successfully
 * - `Close`: Connection closed
 * - `Error`: Connection or analysis error occurred
 * - `SpeakerChange`: New speaker detected
 * - `ActionItem`: Action item identified in conversation
 * - `Question`: Question detected in conversation
 * - `Interruption`: Speaker interruption detected
 * - `SentimentChange`: Significant sentiment change detected
 * - `KeyPhrase`: Key phrase identified
 * - `Silence`: Period of silence detected
 * - `MetricsUpdate`: Real-time conversation metrics update
 */
export class AnalyticsLiveClient extends AbstractLiveClient {
  public namespace: string = "analytics";
  private _analysisOptions: ConversationAnalysisSchema;

  /**
   * Creates a new AnalyticsLiveClient instance.
   *
   * @param options - Configuration options for the Deepgram client
   * @param analysisOptions - Options for conversation analysis
   * @param endpoint - The WebSocket endpoint for the conversation analysis API
   */
  constructor(
    options: DeepgramClientOptions,
    analysisOptions: ConversationAnalysisSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ) {
    super(options);
    this._analysisOptions = analysisOptions;
    this.connect(analysisOptions, endpoint);
  }

  /**
   * Sets up WebSocket connection event handlers for conversation analytics.
   * Handles incoming streaming events and emits appropriate conversation analytics events.
   */
  public setupConnection(): void {
    if (this.conn) {
      this.conn.binaryType = "arraybuffer";

      this.conn.onopen = () => {
        this.log("debug", "conversation analytics websocket connection opened");
        this.emit(ConversationAnalyticsEvents.Open, this.conn);
        
        // Process any buffered sends
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      };

      this.conn.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.log("debug", "conversation analytics websocket message received", data);

          if (data.type === "Results") {
            this.emit(ConversationAnalyticsEvents.MetricsUpdate, data);
          } else {
            this._handleStreamingEvent(data);
          }
        } catch (error) {
          this.log("error", "failed to parse conversation analytics message", { event, error });
          this.emit(ConversationAnalyticsEvents.Error, {
            error,
            type: "parse_error",
            description: "Failed to parse WebSocket message",
          });
        }
      };

      this.conn.onerror = (event) => {
        this.log("error", "conversation analytics websocket error", event);
        this.emit(ConversationAnalyticsEvents.Error, event);
      };

      this.conn.onclose = (event) => {
        this.log("debug", "conversation analytics websocket connection closed", event);
        this.emit(ConversationAnalyticsEvents.Close, event);
      };
    }
  }

  /**
   * Handles specific streaming conversation analytics events.
   * 
   * @param data - The streaming event data received from the WebSocket
   */
  private _handleStreamingEvent(data: ConversationStreamingResponse): void {
    if (!data.event || !data.event.event_type) {
      this.emit(ConversationAnalyticsEvents.MetricsUpdate, data);
      return;
    }

    const { event } = data;

    switch (event.event_type) {
      case "speaker_change":
        this.emit(ConversationAnalyticsEvents.SpeakerChange, {
          conversation_id: data.conversation_id,
          timestamp: event.timestamp,
          speaker_id: event.speaker_id,
          data: event.data,
        });
        break;

      case "action_item":
        this.emit(ConversationAnalyticsEvents.ActionItem, {
          conversation_id: data.conversation_id,
          timestamp: event.timestamp,
          speaker_id: event.speaker_id,
          data: event.data,
        });
        break;

      case "question":
        this.emit(ConversationAnalyticsEvents.Question, {
          conversation_id: data.conversation_id,
          timestamp: event.timestamp,
          speaker_id: event.speaker_id,
          data: event.data,
        });
        break;

      case "interruption":
        this.emit(ConversationAnalyticsEvents.Interruption, {
          conversation_id: data.conversation_id,
          timestamp: event.timestamp,
          speaker_id: event.speaker_id,
          data: event.data,
        });
        break;

      case "sentiment_change":
        this.emit(ConversationAnalyticsEvents.SentimentChange, {
          conversation_id: data.conversation_id,
          timestamp: event.timestamp,
          speaker_id: event.speaker_id,
          data: event.data,
        });
        break;

      case "key_phrase":
        this.emit(ConversationAnalyticsEvents.KeyPhrase, {
          conversation_id: data.conversation_id,
          timestamp: event.timestamp,
          data: event.data,
        });
        break;

      case "silence":
        this.emit(ConversationAnalyticsEvents.Silence, {
          conversation_id: data.conversation_id,
          timestamp: event.timestamp,
          data: event.data,
        });
        break;

      case "metrics_update":
        this.emit(ConversationAnalyticsEvents.MetricsUpdate, {
          conversation_id: data.conversation_id,
          timestamp: event.timestamp,
          data: event.data,
        });
        break;

      default:
        this.log("warn", "unknown conversation analytics event type", event.event_type);
        this.emit(ConversationAnalyticsEvents.MetricsUpdate, data);
    }
  }

  /**
   * Gets the current analysis options.
   * 
   * @returns The conversation analysis options
   */
  public get analysisOptions(): ConversationAnalysisSchema {
    return { ...this._analysisOptions };
  }
}

export { AnalyticsLiveClient as ConversationAnalyticsLiveClient };