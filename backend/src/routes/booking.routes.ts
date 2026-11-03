import { Router } from 'express';

import { cancelBooking, create, estimate, getBookingStatus, getMyBookings } from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { bookingCreateSchema, bookingEstimateSchema } from '../validators/booking.schema.js';

const router = Router();

router.post('/estimate', validateRequest(bookingEstimateSchema), estimate);
router.post('/', validateRequest(bookingCreateSchema), create);
router.get('/status', getBookingStatus);
router.post('/cancel', cancelBooking);
router.get('/my-bookings', authenticate, getMyBookings);

export default router;
