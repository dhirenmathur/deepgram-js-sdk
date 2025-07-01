import { Booking, BookingStatus } from './types/Booking';

/**
 * Manages bookings, including cancellation logic.
 */
export class BookingManager {
  private bookings: Booking[] = [];

  /**
   * Add a new booking.
   */
  addBooking(booking: Booking): void {
    this.bookings.push(booking);
  }

  /**
   * Get all bookings for a user.
   */
  getBookingsForUser(userId: string): Booking[] {
    return this.bookings.filter(b => b.userId === userId);
  }

  /**
   * Cancel a booking by ID for a user.
   * Returns true if cancelled, false if not found or already cancelled.
   */
  cancelBooking(userId: string, bookingId: string): boolean {
    const booking = this.bookings.find(b => b.id === bookingId && b.userId === userId);
    if (booking && booking.status !== 'cancelled') {
      booking.status = 'cancelled';
      return true;
    }
    return false;
  }
}
