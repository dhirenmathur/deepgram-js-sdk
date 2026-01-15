import { AbstractLiveClient } from "./AbstractLiveClient";
import type {
  ConversationStreamingSchema,
  ConversationStreamingResponse,
} from "../lib/types";
import type { DeepgramClientOptions } from "../lib/types";

/**
 * The `ConversationLiveClient` class extends the `AbstractLiveClient` class and provides real-time conversation analytics functionality via WebSocket connection.
 *
 * This client enables:
 * - Real-time streaming conversation analysis
 * - Event-driven updates for conversation insights
 * - Speaker detection and engagement metrics in real-time
 */
export class ConversationLiveClient extends AbstractLiveClient {
  public namespace: string = "conversation";
  
  private _options: ConversationStreamingSchema;
  private _endpoint: string;
  
  constructor(
    options: DeepgramClientOptions,
    streamingOptions: ConversationStreamingSchema = {},
    endpoint = ":version/analyze/conversation/stream"
  ) {
    super(options);
    this._options = streamingOptions;
    this._endpoint = endpoint;
  }

  /**
   * Sets up the WebSocket connection event handlers for conversation analytics streaming.
   */
  public setupConnection(): void {
    if (this.conn) {
      this.conn.onopen = () => {
        this.emit("open", this);
        
        // Flush any buffered audio data
        while (this.sendBuffer.length > 0) {
          const callback = this.sendBuffer.shift();
          if (callback) callback();
        }
      };

      this.conn.onmessage = (event) => {
        try {
          const data: ConversationStreamingResponse = JSON.parse(event.data.toString());
          this.emit("message", data);
          
          // Emit specific event types for targeted handling
          if (data.event && data.event.event_type) {
            this.emit(data.event.event_type, data);
          }
        } catch (error) {
          this.emit("error", error);
        }
      };

      this.conn.onerror = (event) => {
        this.emit("error", event);
      };

      this.conn.onclose = (event) => {
        this.emit("close", event);
      };
    }
  }

  /**
   * Establishes a WebSocket connection to the conversation analytics streaming endpoint.
   */
  public start(): void {
    this.connect(this._options, this._endpoint);
  }

  /**
   * Sends audio data for real-time conversation analysis.
   * 
   * @param data - Audio data as string, Buffer, or ArrayBuffer
   */
  public send(data: string | Buffer | ArrayBuffer): void {
    super.send(data);
  }

  /**
   * Sends a finish signal to complete the conversation analysis session.
   */
  public finish(): void {
    if (this.conn) {
      this.conn.send(JSON.stringify({ type: "FinishConversation" }));
    }
  }

  // Event handler overloads for type safety
  public on(
    event: "open",
    callback: (connection: ConversationLiveClient) => void
  ): void;
  public on(
    event: "message" | "speaker_change" | "action_item" | "question" | 
          "interruption" | "sentiment_change" | "key_phrase" | "silence" | "metrics_update",
    callback: (data: ConversationStreamingResponse) => void
  ): void;
  public on(event: "error", callback: (error: Error) => void): void;
  public on(event: "close", callback: (event: CloseEvent) => void): void;
  public on(event: string, callback: (...args: any[]) => void): void {
    super.on(event, callback);
  }
}