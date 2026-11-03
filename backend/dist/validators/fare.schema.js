import { z } from 'zod';
export const fareRuleSchema = z.object({
    name: z.string().min(2),
    pricingModel: z.enum(['fixed_route', 'per_km', 'round_trip', 'custom']),
    vehicleCategory: z.string().min(1),
    baseFare: z.number().min(0),
    perKmRate: z.number().min(0).optional(),
    minimumDistance: z.number().min(0).optional(),
    driverAllowance: z.number().min(0).optional(),
    additionalCharges: z.number().min(0).optional(),
    taxRate: z.number().min(0).max(100).optional(),
    active: z.boolean().optional(),
});
