import { AbstractLiveClient } from "./AbstractLiveClient";
import type {
  ConversationAnalyticsSchema,
  DeepgramClientOptions,
  LiveSchema,
  StreamingConversationResponse,
} from "../lib/types";

/**
 * The AnalyticsLiveClient provides real-time conversation analysis capabilities
 * via WebSocket connection to Deepgram's streaming analytics API.
 * 
 * Events emitted:
 * - `speaker_change`: When a different speaker starts talking
 * - `action_item`: When an action item is detected
 * - `question`: When a question is detected
 * - `interruption`: When speaker interruption occurs
 * - `sentiment_change`: When sentiment shifts significantly
 * - `key_phrase`: When important phrases are identified
 * - `silence`: When significant silence periods occur
 * - `metrics_update`: Real-time engagement and participation metrics
 * - `error`: When errors occur during processing
 * - `open`: When connection is established
 * - `close`: When connection is closed
 * 
 * @example
 * ```typescript
 * const live = deepgram.analytics.live({
 *   detect_speakers: true,
 *   measure_engagement: true,
 *   detect_sentiment: true,
 *   realtime_metrics_interval: 5000
 * });
 * 
 * live.on("speaker_change", (event) => {
 *   console.log(`Speaker ${event.speaker_id} started talking`);
 * });
 * 
 * live.on("action_item", (event) => {
 *   console.log("Action item detected:", event.data.text);
 * });
 * 
 * live.on("metrics_update", (event) => {
 *   console.log("Engagement score:", event.data.engagement_score);
 * });
 * 
 * live.start();
 * live.send(audioChunk);
 * live.finish();
 * ```
 */
export class AnalyticsLiveClient extends AbstractLiveClient {
  public namespace: string = "analytics";

  constructor(
    options: DeepgramClientOptions,
    analysisOptions: ConversationAnalyticsSchema = {},
    endpoint: string = ":version/analyze/conversation/stream"
  ) {
    super(options);
    this.connect(analysisOptions as LiveSchema, endpoint);
  }

  /**
   * Sets up the connection event handlers for real-time conversation analysis.
   * This method is called automatically when the connection is established.
   * 
   * @protected
   */
  public setupConnection(): void {
    if (this.conn) {
      this.conn.onopen = () => {
        this.emit("open", this);
        
        // Process any buffered sends
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      };

      this.conn.onmessage = (event) => {
        try {
          const data: StreamingConversationResponse = JSON.parse(event.data);
          
          // Emit specific events based on event type
          if (data.event?.event_type) {
            this.emit(data.event.event_type, data);
          }
          
          // Also emit general message event
          this.emit("message", data);
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
   * Sends audio data for real-time conversation analysis.
   * 
   * @param {string | ArrayBufferLike | Blob} data - The audio data to analyze.
   * @throws Will emit an error event if the connection is not established.
   * 
   * @example
   * ```typescript
   * // Send audio buffer
   * live.send(audioBuffer);
   * 
   * // Send audio blob
   * live.send(audioBlob);
   * 
   * // Send binary string
   * live.send(binaryString);
   * ```
   */
  public send(data: string | ArrayBufferLike | Blob): void {
    super.send(data);
  }

  /**
   * Sends a keep-alive message to maintain the connection.
   * This is useful for long conversations with periods of silence.
   */
  public keepAlive(): void {
    if (this.isConnected()) {
      this.send(JSON.stringify({ type: "KeepAlive" }));
    }
  }

  /**
   * Closes the connection and finishes the analysis session.
   * This will trigger final processing of any remaining audio and
   * emit final metrics.
   */
  public finish(): void {
    if (this.isConnected()) {
      this.send(JSON.stringify({ type: "FinalizeSpeech" }));
    }
  }

  /**
   * Requests immediate metrics update.
   * Useful for getting current engagement and participation metrics
   * outside of the normal interval.
   */
  public requestMetrics(): void {
    if (this.isConnected()) {
      this.send(JSON.stringify({ type: "RequestMetrics" }));
    }
  }
}