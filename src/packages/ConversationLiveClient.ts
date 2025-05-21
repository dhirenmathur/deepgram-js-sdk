import { DeepgramError } from "../lib/errors";
import { AbstractLiveClient } from "./AbstractLiveClient";
import { ConversationSchema } from "../lib/types";

/**
 * Enum for conversation analytics streaming events
 */
export enum ConversationEvents {
  // Socket lifecycle events
  OPEN = "open",
  CLOSE = "close",
  ERROR = "error",
  WARNING = "warning",
  
  // Conversation analytics events
  SPEAKER_CHANGE = "speakerChange",
  ACTION_ITEM = "actionItem",
  QUESTION = "question",
  INTERRUPTION = "interruption",
  SENTIMENT_CHANGE = "sentimentChange",
  KEY_PHRASE = "keyPhrase",
  SILENCE = "silence",
  METRICS_UPDATE = "metricsUpdate"
}

/**
 * The `ConversationLiveClient` class extends the `AbstractLiveClient` class and provides methods for streaming conversation analytics using the Deepgram API.
 *
 * This client establishes a WebSocket connection to the Deepgram API and allows for real-time streaming of audio data
 * for conversation analysis. It handles the WebSocket connection lifecycle and emits events for various conversation analytics.
 */
export class ConversationLiveClient extends AbstractLiveClient {
  public namespace: string = "conversation";
  private conversationOptions: ConversationSchema;

  /**
   * Constructs a new instance of the `ConversationLiveClient` class with the provided options.
   *
   * @param options - The client options to use for this instance.
   * @param conversationOptions - The conversation analytics options to use for this instance.
   * @param endpoint - The endpoint to connect to for streaming conversation analytics.
   */
  constructor(
    options: any,
    conversationOptions: ConversationSchema = {},
    endpoint = ":version/analyze/conversation/stream"
  ) {
    super(options);

    this.conversationOptions = conversationOptions;

    // Validate keyterm usage with model compatibility
    if (
      this.conversationOptions.detect_key_phrases &&
      this.conversationOptions.language &&
      this.conversationOptions.language !== "en" &&
      !this.conversationOptions.language.startsWith("en-")
    ) {
      throw new DeepgramError(
        "Key phrase detection is currently only supported for English language."
      );
    }

    // Connect to the WebSocket
    const url = this.getRequestUrl(endpoint, {}, this.conversationOptions);
    this.connect(url);
    this.setupConnection();
  }

  /**
   * Sets up the WebSocket connection event handlers.
   */
  private setupConnection() {
    if (!this.socket) {
      throw new DeepgramError("WebSocket connection not established");
    }

    this.socket.addEventListener("open", () => {
      this.emit(ConversationEvents.OPEN);
    });

    this.socket.addEventListener("close", (event) => {
      this.emit(ConversationEvents.CLOSE, event);
    });

    this.socket.addEventListener("error", (error) => {
      this.emit(ConversationEvents.ERROR, error);
    });

    this.socket.addEventListener("message", (message) => {
      this.handleMessage(message);
    });
  }

  /**
   * Handles incoming WebSocket messages.
   *
   * @param message - The message received from the WebSocket.
   */
  private handleMessage(message: MessageEvent) {
    try {
      if (typeof message.data === "string") {
        const data = JSON.parse(message.data);
        this.handleTextMessage(data);
      } else if (message.data instanceof ArrayBuffer) {
        // Currently, the streaming conversation analytics API doesn't send binary data
        // This is here for future compatibility
        this.emit(ConversationEvents.ERROR, new DeepgramError("Unexpected binary data received"));
      } else {
        this.emit(ConversationEvents.ERROR, new DeepgramError("Unknown message data type"));
      }
    } catch (error) {
      this.emit(ConversationEvents.ERROR, error);
    }
  }

  /**
   * Handles text messages received from the WebSocket.
   *
   * @param data - The parsed JSON data from the WebSocket message.
   */
  private handleTextMessage(data: any) {
    if (!data.event) {
      this.emit(ConversationEvents.ERROR, new DeepgramError("Invalid message format"));
      return;
    }

    switch (data.event.event_type) {
      case "speaker_change":
        this.emit(ConversationEvents.SPEAKER_CHANGE, data);
        break;
      case "action_item":
        this.emit(ConversationEvents.ACTION_ITEM, data);
        break;
      case "question":
        this.emit(ConversationEvents.QUESTION, data);
        break;
      case "interruption":
        this.emit(ConversationEvents.INTERRUPTION, data);
        break;
      case "sentiment_change":
        this.emit(ConversationEvents.SENTIMENT_CHANGE, data);
        break;
      case "key_phrase":
        this.emit(ConversationEvents.KEY_PHRASE, data);
        break;
      case "silence":
        this.emit(ConversationEvents.SILENCE, data);
        break;
      case "metrics_update":
        this.emit(ConversationEvents.METRICS_UPDATE, data);
        break;
      default:
        this.emit(ConversationEvents.WARNING, {
          message: `Unhandled event type: ${data.event.event_type}`,
          data,
        });
    }
  }

  /**
   * Sends a keep-alive message to the server to maintain the WebSocket connection.
   */
  public keepAlive() {
    this.send(JSON.stringify({ type: "KeepAlive" }));
  }

  /**
   * Requests the server to close the WebSocket connection.
   */
  public requestClose() {
    this.send(JSON.stringify({ type: "CloseStream" }));
  }
}