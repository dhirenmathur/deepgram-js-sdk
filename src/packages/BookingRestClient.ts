import { AbstractRestClient } from "./AbstractRestClient";
import type { BookingSchema } from "../lib/types/BookingSchema";

/**
 * BookingRestClient provides methods to manage flight bookings.
 * Supports cancellation and retrieval of bookings.
 */
export class BookingRestClient extends AbstractRestClient {
  public namespace: string = "booking";

  /**
   * Cancels a booking by ID, updating its status to 'cancelled'.
   * @param bookingId - The ID of the booking to cancel.
   * @returns Confirmation message and updated booking.
   */
  async cancelBooking(
    bookingId: string,
    endpoint = ":version/bookings/:bookingId/cancel"
  ): Promise<{ result: BookingSchema | null; message: string; error: any }> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { bookingId });
      const result: BookingSchema = await this.patch(requestUrl, JSON.stringify({ status: 'cancelled' }))
        .then((res) => res.json());
      return {
        result,
        message: "Your booking has been cancelled.",
        error: null
      };
    } catch (error) {
      return { result: null, message: "", error };
    }
  }

  /**
   * Retrieves all bookings for a user.
   * @param userId - The ID of the user.
   */
  async getBookings(
    userId: string,
    endpoint = ":version/users/:userId/bookings"
  ): Promise<{ result: BookingSchema[] | null; error: any }> {
    try {
      const requestUrl = this.getRequestUrl(endpoint, { userId });
      const result: BookingSchema[] = await this.get(requestUrl).then((res) => res.json());
      return { result, error: null };
    } catch (error) {
      return { result: null, error };
    }
  }
}

export { BookingRestClient as BookingClient };
