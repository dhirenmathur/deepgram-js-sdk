import { BookingRestClient } from "../src/packages/BookingRestClient";
import type { BookingSchema } from "../src/lib/types/BookingSchema";

describe("BookingRestClient", () => {
  let client: BookingRestClient;

  beforeEach(() => {
    client = new BookingRestClient({ key: "test-key" });
  });

  it("should cancel a booking and return confirmation", async () => {
    // Mock patch and getRequestUrl
    client.patch = jest.fn().mockResolvedValue({
      json: async () => ({
        id: "b123",
        userId: "u1",
        flightId: "f1",
        status: "cancelled",
        createdAt: "2024-06-01T00:00:00Z",
        updatedAt: "2024-06-02T00:00:00Z"
      })
    });
    client.getRequestUrl = jest.fn().mockReturnValue(new URL("http://localhost"));

    const { result, message, error } = await client.cancelBooking("b123");
    expect(error).toBeNull();
    expect(result?.status).toBe("cancelled");
    expect(message).toBe("Your booking has been cancelled.");
  });

  it("should handle errors gracefully", async () => {
    client.patch = jest.fn().mockRejectedValue(new Error("Network error"));
    client.getRequestUrl = jest.fn().mockReturnValue(new URL("http://localhost"));

    const { result, message, error } = await client.cancelBooking("b123");
    expect(result).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(message).toBe("");
  });
});
