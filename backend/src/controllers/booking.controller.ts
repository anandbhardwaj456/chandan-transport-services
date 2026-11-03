import { NextFunction, Request, Response } from 'express';

import Booking from '../models/Booking.js';
import { estimateFare } from '../services/fare.service.js';
import { createBooking, getBookingByReference, listBookings } from '../services/booking.service.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { AuthRequest } from '../middleware/authenticate.js';
import { ApiError } from '../utils/ApiError.js';

export const estimate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await estimateFare(req.body);
    return sendSuccess(res, 200, 'Fare estimated', result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await createBooking(req.body);
    return sendSuccess(res, 201, 'Booking created successfully', { booking });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bookings = await Booking.find({ customerPhone: req.user.phone }).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, 200, 'Customer bookings retrieved', { bookings });
  } catch (error) {
    next(error);
  }
};

export const getBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reference = req.query.reference as string;
    if (!reference) {
      throw new ApiError(400, 'Booking reference is required');
    }

    const booking = await getBookingByReference(reference);
    return sendSuccess(res, 200, 'Booking status retrieved', { booking });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await Booking.findOne({ bookingReference: req.body.reference });
    if (!booking) throw new ApiError(404, 'Booking not found');
    if (['completed', 'cancelled', 'rejected'].includes(booking.status)) {
      throw new ApiError(400, 'This booking cannot be cancelled in its current state');
    }

    booking.status = 'cancellation_requested';
    booking.cancellationDetails = { reason: req.body.reason ?? 'Customer requested cancellation' };
    await booking.save();

    return sendSuccess(res, 200, 'Cancellation request submitted', { booking });
  } catch (error) {
    next(error);
  }
};

export const listAllBookings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await listBookings({ page: 1, limit: 20 });
    return sendSuccess(res, 200, 'Bookings retrieved', result);
  } catch (error) {
    next(error);
  }
};
