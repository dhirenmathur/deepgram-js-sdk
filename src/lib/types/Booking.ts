/**
 * Booking model for flight reservations.
 */
export type BookingStatus = 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  date: string;
  status: BookingStatus;
}
