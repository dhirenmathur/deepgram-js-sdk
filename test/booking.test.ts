import { BookingManager } from '../src/lib/BookingManager';
import { Booking } from '../src/lib/types/Booking';

describe('BookingManager', () => {
  let manager: BookingManager;
  let booking: Booking;

  beforeEach(() => {
    manager = new BookingManager();
    booking = {
      id: 'b1',
      userId: 'u1',
      flightNumber: 'DG100',
      departure: 'NYC',
      arrival: 'LAX',
      date: '2024-07-01',
      status: 'confirmed'
    };
    manager.addBooking(booking);
  });

  it('should cancel a booking', () => {
    const result = manager.cancelBooking('u1', 'b1');
    expect(result).toBe(true);
    const bookings = manager.getBookingsForUser('u1');
    expect(bookings[0].status).toBe('cancelled');
  });

  it('should not cancel an already cancelled booking', () => {
    manager.cancelBooking('u1', 'b1');
    const result = manager.cancelBooking('u1', 'b1');
    expect(result).toBe(false);
  });

  it('should not cancel a non-existent booking', () => {
    const result = manager.cancelBooking('u1', 'b2');
    expect(result).toBe(false);
  });
});
