import { Booking } from '../src/lib/types/Booking';

describe('Booking', () => {
  it('should initialize with confirmed status', () => {
    const booking = new Booking({
      id: 'b1',
      userId: 'u1',
      flightId: 'f1'
    });
    expect(booking.status).toBe('confirmed');
    expect(booking.cancelledAt).toBeNull();
  });

  it('should cancel a booking and update status', () => {
    const booking = new Booking({
      id: 'b2',
      userId: 'u2',
      flightId: 'f2'
    });
    const message = booking.cancel();
    expect(booking.status).toBe('cancelled');
    expect(booking.cancelledAt).not.toBeNull();
    expect(message).toBe('Your booking has been cancelled.');
  });

  it('should not cancel an already cancelled booking', () => {
    const booking = new Booking({
      id: 'b3',
      userId: 'u3',
      flightId: 'f3',
      status: 'cancelled'
    });
    const message = booking.cancel();
    expect(message).toBe('Booking is already cancelled.');
  });
});
