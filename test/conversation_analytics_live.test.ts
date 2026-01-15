import { ConversationAnalyticsLiveClient } from "../src/packages/ConversationAnalyticsLiveClient";
import { ConversationAnalyticsEvents } from "../src/lib/enums";
import type { ConversationAnalyticsStreamOptions } from "../src/lib/types";

describe("ConversationAnalyticsLiveClient", () => {
  let client: ConversationAnalyticsLiveClient;
  let mockWebSocket: any;

  beforeEach(() => {
    mockWebSocket = {
      send: jest.fn(),
      close: jest.fn(),
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
      readyState: 1
    };

    // Mock WebSocket constructor
    global.WebSocket = jest.fn().mockImplementation(() => mockWebSocket);

    client = new ConversationAnalyticsLiveClient({
      key: "test-api-key",
    });

    // Mock the connection
    (client as any).conn = mockWebSocket;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("connection", () => {
    it("should establish WebSocket connection", () => {
      expect(client).toBeDefined();
      expect(client.namespace).toBe("conversation_analytics");
    });

    it("should handle connection open event", () => {
      const openSpy = jest.spyOn(client, "emit");
      
      client.setupConnection();
      mockWebSocket.onopen();
      
      expect(openSpy).toHaveBeenCalledWith(ConversationAnalyticsEvents.Open);
    });

    it("should handle connection close event", () => {
      const closeSpy = jest.spyOn(client, "emit");
      const closeEvent = { code: 1000, reason: "Normal closure" };
      
      client.setupConnection();
      mockWebSocket.onclose(closeEvent);
      
      expect(closeSpy).toHaveBeenCalledWith(ConversationAnalyticsEvents.Close, closeEvent);
    });

    it("should handle connection error event", () => {
      const errorSpy = jest.spyOn(client, "emit");
      const errorEvent = { error: "Connection failed" };
      
      client.setupConnection();
      mockWebSocket.onerror(errorEvent);
      
      expect(errorSpy).toHaveBeenCalledWith(ConversationAnalyticsEvents.Error, errorEvent);
    });
  });

  describe("events", () => {
    beforeEach(() => {
      client.setupConnection();
    });

    it("should emit SpeakerChange events", () => {
      const eventSpy = jest.spyOn(client, "emit");
      const messageData = {
        conversation_id: "test-id",
        event: { type: "speaker_change", timestamp: Date.now(), data: {} }
      };
      
      mockWebSocket.onmessage({ data: JSON.stringify(messageData) });
      
      expect(eventSpy).toHaveBeenCalledWith(ConversationAnalyticsEvents.SpeakerChange, messageData);
    });

    it("should emit ActionItem events", () => {
      const eventSpy = jest.spyOn(client, "emit");
      const messageData = {
        conversation_id: "test-id",
        event: { type: "action_item", timestamp: Date.now(), data: { text: "Follow up with client" } }
      };
      
      mockWebSocket.onmessage({ data: JSON.stringify(messageData) });
      
      expect(eventSpy).toHaveBeenCalledWith(ConversationAnalyticsEvents.ActionItem, messageData);
    });

    it("should emit MetricsUpdate events", () => {
      const eventSpy = jest.spyOn(client, "emit");
      const messageData = {
        conversation_id: "test-id",
        event: { type: "metrics_update", timestamp: Date.now(), data: { engagement_score: 0.85 } }
      };
      
      mockWebSocket.onmessage({ data: JSON.stringify(messageData) });
      
      expect(eventSpy).toHaveBeenCalledWith(ConversationAnalyticsEvents.MetricsUpdate, messageData);
    });

    it("should handle unhandled event types", () => {
      const eventSpy = jest.spyOn(client, "emit");
      const messageData = {
        conversation_id: "test-id",
        event: { type: "unknown_event", timestamp: Date.now(), data: {} }
      };
      
      mockWebSocket.onmessage({ data: JSON.stringify(messageData) });
      
      expect(eventSpy).toHaveBeenCalledWith(ConversationAnalyticsEvents.Unhandled, messageData);
    });

    it("should handle message parsing errors", () => {
      const eventSpy = jest.spyOn(client, "emit");
      
      mockWebSocket.onmessage({ data: "invalid json" });
      
      expect(eventSpy).toHaveBeenCalledWith(ConversationAnalyticsEvents.Error, expect.objectContaining({
        type: "message_parse_error"
      }));
    });
  });

  describe("configuration", () => {
    it("should send live configuration updates", () => {
      const config = {
        detect_speakers: true,
        extract_action_items: false,
        realtime_metrics_interval: 5000
      };
      
      client.configure(config);
      
      expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({
        type: "Configure",
        ...config
      }));
    });

    it("should handle keep-alive messages", () => {
      client.keepAlive();
      
      expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({
        type: "KeepAlive"
      }));
    });

    it("should handle finalize messages", () => {
      client.finalize();
      
      expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({
        type: "Finalize"
      }));
    });
  });
});