/**
 * BookingSchema defines the structure for a flight booking.
 */
export interface BookingSchema {
  id: string;
  userId: string;
  flightId: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
