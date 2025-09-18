import { AbstractLiveClient } from "./AbstractLiveClient";
import { ConversationAnalyticsEvents } from "../lib/enums";
import type { ConversationStreamSchema, DeepgramClientOptions } from "../lib/types";

/**
 * The `AnalyzeLiveClient` class extends the `AbstractLiveClient` class and provides functionality for setting up and managing a WebSocket connection for real-time conversation analytics.
 *
 * The constructor takes in `DeepgramClientOptions` and an optional `ConversationStreamSchema` object, as well as an optional `endpoint` string. It then calls the `connect` method of the parent `AbstractLiveClient` class to establish the WebSocket connection.
 *
 * The `setupConnection` method is responsible for handling the various events that can occur on the WebSocket connection, such as opening, closing, and receiving analytics messages. It sets up event handlers for these events and emits the appropriate events based on the message type.
 *
 * The `configure` method allows you to send additional configuration options to the connected session.
 *
 * The `keepAlive` method sends a "KeepAlive" message to the server to maintain the connection.
 *
 * The `requestClose` method requests the server to close the connection.
 */
export class AnalyzeLiveClient extends AbstractLiveClient {
  public namespace: string = "analyze";

  /**
   * Constructs a new `AnalyzeLiveClient` instance with the provided options.
   *
   * @param options - The `DeepgramClientOptions` to use for the client connection.
   * @param analysisOptions - An optional `ConversationStreamSchema` object containing additional configuration options for the conversation analytics.
   * @param endpoint - An optional string representing the WebSocket endpoint to connect to. Defaults to `:version/analyze/conversation/stream`.
   */
  constructor(
    options: DeepgramClientOptions,
    analysisOptions: ConversationStreamSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ) {
    super(options);
    this.connect(analysisOptions, endpoint);
  }

  /**
   * Sets up the connection event handlers.
   * This method is responsible for handling the various events that can occur on the WebSocket connection, such as opening, closing, and receiving messages.
   * - When the connection is opened, it emits the `ConversationAnalyticsEvents.Open` event.
   * - When the connection is closed, it emits the `ConversationAnalyticsEvents.Close` event.
   * - When an error occurs on the connection, it emits the `ConversationAnalyticsEvents.Error` event.
   * - When a message is received, it parses the message and emits the appropriate event based on the message type.
   */
  protected setupConnection(): void {
    if (this.conn) {
      this.conn.onopen = () => {
        this.emit(ConversationAnalyticsEvents.Open, this.conn);
      };

      this.conn.onclose = (event) => {
        this.emit(ConversationAnalyticsEvents.Close, event);
      };

      this.conn.onerror = (event) => {
        this.emit(ConversationAnalyticsEvents.Error, event);
      };

      this.conn.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data.toString());

          if (data.event) {
            const eventType = data.event.event_type;
            
            switch (eventType) {
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
            }
          } else {
            this.emit(ConversationAnalyticsEvents.Unhandled, data);
          }
        } catch (error) {
          this.emit(ConversationAnalyticsEvents.Error, {
            event,
            message: "Unable to parse response JSON",
            error,
          });
        }
      };

      this.sendBuffer.forEach((chunk) => chunk());
      this.sendBuffer = [];
    }
  }

  /**
   * Sends additional configuration to the connected session.
   *
   * @param options - The configuration options to apply to the conversation analytics stream.
   */
  public configure(options: ConversationStreamSchema): void {
    if (this.conn && this.conn.readyState === this.conn.OPEN) {
      this.conn.send(
        JSON.stringify({
          type: "Configure",
          ...options,
        })
      );
    }
  }

  /**
   * Sends a "KeepAlive" message to the server to maintain the connection.
   */
  public keepAlive(): void {
    if (this.conn && this.conn.readyState === this.conn.OPEN) {
      this.conn.send(
        JSON.stringify({
          type: "KeepAlive",
        })
      );
    }
  }

  /**
   * Requests the server close the connection.
   */
  public requestClose(): void {
    if (this.conn && this.conn.readyState === this.conn.OPEN) {
      this.conn.send(JSON.stringify({ type: "CloseStream" }));
    }
  }
}