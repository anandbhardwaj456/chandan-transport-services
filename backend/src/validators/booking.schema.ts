import { z } from 'zod';

export const bookingEstimateSchema = z.object({
  pickupLocation: z.string().min(2),
  destination: z.string().min(2),
  journeyType: z.enum(['one_way', 'round_trip']),
  pickupDate: z.string().min(1),
  pickupTime: z.string().min(1),
  passengers: z.number().min(1).max(8),
  vehicleCategory: z.string().min(1),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
});

export const bookingCreateSchema = bookingEstimateSchema.extend({
  customerName: z.string().min(2),
  customerPhone: z.string().min(10).max(15),
  customerEmail: z.string().email().optional().or(z.literal('')),
  pickupAddress: z.string().optional(),
  destinationAddress: z.string().optional(),
  notes: z.string().optional(),
  consent: z.boolean().refine((v) => v === true, { message: 'Consent is required' }),
});
