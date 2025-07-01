/**
 * Booking model for flight reservations.
 * Allows cancellation and status tracking.
 */

export type BookingStatus = 'confirmed' | 'cancelled';

export interface BookingProps {
  id: string;
  userId: string;
  flightId: string;
  status?: BookingStatus;
  createdAt?: Date;
  cancelledAt?: Date | null;
}

export class Booking {
  id: string;
  userId: string;
  flightId: string;
  status: BookingStatus;
  createdAt: Date;
  cancelledAt: Date | null;

  constructor(props: BookingProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.flightId = props.flightId;
    this.status = props.status || 'confirmed';
    this.createdAt = props.createdAt || new Date();
    this.cancelledAt = props.cancelledAt || null;
  }

  /**
   * Cancels the booking if it is not already cancelled.
   * @returns Confirmation message.
   */
  cancel(): string {
    if (this.status === 'cancelled') {
      return 'Booking is already cancelled.';
    }
    this.status = 'cancelled';
    this.cancelledAt = new Date();
    return 'Your booking has been cancelled.';
  }
}
