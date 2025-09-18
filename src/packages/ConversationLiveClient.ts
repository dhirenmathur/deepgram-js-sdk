import { AbstractLiveClient } from "./AbstractLiveClient";
import { ConversationEvents } from "../lib/enums";
import type { ConversationSchema, DeepgramClientOptions } from "../lib/types";

/**
 * The `ConversationLiveClient` class extends the `AbstractLiveClient` class and provides real-time conversation analytics functionality.
 * It connects to the Deepgram conversation analytics streaming API and emits events based on conversation analysis results.
 */
export class ConversationLiveClient extends AbstractLiveClient {
  public namespace: string = "conversation";

  /**
   * Constructs a new `ConversationLiveClient` instance.
   * @param {DeepgramClientOptions} options - The client options to use.
   * @param {ConversationSchema} [conversationOptions={}] - The conversation analytics options.
   * @param {string} [endpoint=":version/analyze/conversation/stream"] - The streaming endpoint.
   */
  constructor(
    options: DeepgramClientOptions,
    conversationOptions: ConversationSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ) {
    super(options);
    this.connect(conversationOptions, endpoint);
  }

  /**
   * Sets up the WebSocket connection event handlers for conversation analytics streaming.
   * Handles incoming conversation events and emits appropriate events based on the event type.
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

          if (data.event?.event_type) {
            switch (data.event.event_type) {
              case "speaker_change":
                this.emit(ConversationEvents.SpeakerChange, data);
                break;
              case "action_item":
                this.emit(ConversationEvents.ActionItem, data);
                break;
              case "question":
                this.emit(ConversationEvents.Question, data);
                break;
              case "interruption":
                this.emit(ConversationEvents.Interruption, data);
                break;
              case "sentiment_change":
                this.emit(ConversationEvents.SentimentChange, data);
                break;
              case "key_phrase":
                this.emit(ConversationEvents.KeyPhrase, data);
                break;
              case "silence":
                this.emit(ConversationEvents.Silence, data);
                break;
              case "metrics_update":
                this.emit(ConversationEvents.MetricsUpdate, data);
                break;
              default:
                this.emit(ConversationEvents.Unhandled, data);
            }
          } else {
            // Handle other types of messages (metadata, etc.)
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
}