import { describe, test, expect, vi, beforeEach } from "vitest";
import { ConversationAnalyticsLiveClient } from "../src/packages/ConversationAnalyticsLiveClient";
import { ConversationAnalyticsEvents } from "../src/lib/enums";
import { DeepgramError } from "../src/lib/errors";

describe("ConversationAnalyticsLiveClient", () => {
  let client: ConversationAnalyticsLiveClient;
  const mockOptions = {
    global: { url: "https://api.deepgram.com" },
    key: "test-key"
  };

  beforeEach(() => {
    // Mock WebSocket
    global.WebSocket = vi.fn().mockImplementation(() => ({
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,
      send: vi.fn(),
      close: vi.fn(),
      readyState: 1
    }));
  });

  describe("constructor", () => {
    test("should create client with default options", () => {
      client = new ConversationAnalyticsLiveClient(mockOptions as any);
      
      expect(client.namespace).toBe("conversation");
      expect(client.getAnalyticsOptions()).toEqual({});
    });

    test("should validate max_speakers limit", () => {
      expect(() => {
        new ConversationAnalyticsLiveClient(mockOptions as any, {
          detect_speakers: true,
          max_speakers: 25
        });
      }).toThrow(DeepgramError);
    });

    test("should validate min/max speakers relationship", () => {
      expect(() => {
        new ConversationAnalyticsLiveClient(mockOptions as any, {
          min_speakers: 5,
          max_speakers: 3
        });
      }).toThrow(DeepgramError);
    });
  });

  describe("event handling", () => {
    beforeEach(() => {
      client = new ConversationAnalyticsLiveClient(mockOptions as any);
    });

    test("should emit speaker_change events", () => {
      const mockEmit = vi.spyOn(client, 'emit');
      const mockConn = {
        onmessage: null,
        send: vi.fn(),
        close: vi.fn()
      };
      client.conn = mockConn as any;
      client.setupConnection();

      const speakerChangeData = {
        type: "SpeakerChange",
        previous_speaker: 0,
        current_speaker: 1,
        timestamp: Date.now()
      };

      const messageEvent = {
        data: JSON.stringify(speakerChangeData)
      } as MessageEvent;

      mockConn.onmessage?.(messageEvent);

      expect(mockEmit).toHaveBeenCalledWith(
        ConversationAnalyticsEvents.SpeakerChange,
        speakerChangeData
      );
    });

    test("should handle malformed JSON gracefully", () => {
      const mockEmit = vi.spyOn(client, 'emit');
      const mockConn = {
        onmessage: null,
        send: vi.fn(),
        close: vi.fn()
      };
      client.conn = mockConn as any;
      client.setupConnection();

      const messageEvent = {
        data: "invalid json"
      } as MessageEvent;

      mockConn.onmessage?.(messageEvent);

      expect(mockEmit).toHaveBeenCalledWith(
        ConversationAnalyticsEvents.Error,
        expect.objectContaining({
          message: "Unable to parse data as JSON."
        })
      );
    });
  });
});