
## Booking Model

The SDK provides a `Booking` model to represent flight reservations and support cancellation logic.

```typescript
import { Booking } from './src/lib/types/Booking';

const booking = new Booking({
  id: 'b1',
  userId: 'u1',
  flightId: 'f1'
});

// Cancel the booking
const confirmation = booking.cancel();
console.log(confirmation); // "Your booking has been cancelled."
```
