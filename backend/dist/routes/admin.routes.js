import { Router } from 'express';
import { assignDriver, createDriver, createFareRule, createRoute, createService, createVehicle, dashboard, getBookings, getFareRules, getInquiries, getRoutesForAdmin, getServicesForAdmin, getVehiclesForAdmin, listCustomers, listDrivers, updateBookingStatus, updateFareRule, updateInquiryStatus, updateRoute, updateService, updateVehicle } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { z } from 'zod';
import { getAdminSettings, updateAdminSettings } from '../controllers/settings.controller.js';
const router = Router();
router.use(authenticate, authorize('admin', 'booking_manager'));
const corporateRatesSchema = z.object({
    eightHoursEightyKm: z.number().min(0).optional(),
    twelveHoursOneTwentyKm: z.number().min(0).optional(),
    outstationPerKm: z.number().min(0).optional(),
}).optional();
const additionalChargePolicySchema = z.object({
    extraHour: z.number().min(0).optional(),
    extraKmPerKm: z.number().min(0).optional(),
    tolls: z.string().max(200).optional(),
    parking: z.string().max(200).optional(),
    taxes: z.string().max(200).optional(),
    minimumOutstationKmPerDay: z.number().min(0).optional(),
}).optional();
const fareRuleSchema = z.object({
    name: z.string().min(2).max(150),
    pricingModel: z.enum(['fixed_route', 'per_km', 'round_trip', 'custom']),
    vehicleCategory: z.string().min(2).max(100),
    baseFare: z.number().min(0),
    perKmRate: z.number().min(0).optional(),
    minimumDistance: z.number().min(0).optional(),
    driverAllowance: z.number().min(0).optional(),
    additionalCharges: z.number().min(0).optional(),
    taxRate: z.number().min(0).max(100).optional(),
    active: z.boolean().optional(),
    verified: z.boolean().optional(),
    corporateRates: corporateRatesSchema,
    additionalChargePolicy: additionalChargePolicySchema,
});
const inquiryStatusSchema = z.object({ status: z.enum(['new', 'contacted', 'closed']) });
const vehicleSchema = z.object({
    category: z.string().min(2).max(100),
    description: z.string().min(2).max(1000),
    imageUrl: z.string().url().optional().or(z.literal('')),
    passengerCapacity: z.number().int().min(1).max(16),
    luggageCapacity: z.number().int().min(0).max(20).optional(),
    features: z.array(z.string().max(80)).max(30).optional(),
    active: z.boolean().optional(),
    pricingModel: z.enum(['per_km', 'fixed_route', 'round_trip', 'custom']).optional(),
});
const serviceSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(2).max(1000),
    image: z.string().url().optional().or(z.literal('')),
    active: z.boolean().optional(),
    slug: z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.string().min(2).max(80),
});
const routeSchema = z.object({
    origin: z.string().min(2).max(100),
    destination: z.string().min(2).max(100),
    routeType: z.enum(['one_way', 'round_trip', 'local']),
    status: z.enum(['active', 'inactive']),
});
const driverSchema = z.object({
    name: z.string().min(2).max(100),
    phone: z.string().min(10).max(15),
    availabilityStatus: z.enum(['available', 'busy', 'off_duty']).optional(),
    licenseVerified: z.boolean().optional(),
});
const bookingStatusSchema = z.object({
    bookingId: z.string().min(1),
    status: z.enum(['pending_confirmation', 'confirmed', 'driver_assigned', 'in_progress', 'completed', 'cancellation_requested', 'cancelled', 'rejected']),
});
const assignDriverSchema = z.object({ bookingId: z.string().min(1), driverId: z.string().min(1) });
const websiteSettingsSchema = z.object({
    businessName: z.string().min(2).max(150),
    location: z.string().min(2).max(200),
    heroTitle: z.string().max(200),
    heroDescription: z.string().max(1000),
    serviceLocationLabel: z.string().max(300),
    aboutIntroduction: z.string().max(2000),
    phoneNumbers: z.array(z.string().regex(/^[+0-9 ()-]{10,20}$/)).max(10),
    email: z.string().email().or(z.literal('')),
    website: z.string().url().or(z.literal('')),
    whatsappNumber: z.string().regex(/^[0-9]{10,15}$/).or(z.literal('')),
    contactVerified: z.boolean(),
    contentVerified: z.boolean(),
});
router.get('/dashboard', dashboard);
router.get('/bookings', getBookings);
router.patch('/bookings/status', validateRequest(bookingStatusSchema), updateBookingStatus);
router.patch('/bookings/assign-driver', validateRequest(assignDriverSchema), assignDriver);
router.get('/customers', listCustomers);
router.get('/drivers', listDrivers);
router.post('/drivers', validateRequest(driverSchema), createDriver);
router.get('/vehicles', getVehiclesForAdmin);
router.post('/vehicles', validateRequest(vehicleSchema), createVehicle);
router.patch('/vehicles/:id', validateRequest(vehicleSchema.partial()), updateVehicle);
router.get('/services', getServicesForAdmin);
router.post('/services', validateRequest(serviceSchema), createService);
router.patch('/services/:id', validateRequest(serviceSchema.partial()), updateService);
router.get('/routes', getRoutesForAdmin);
router.post('/routes', validateRequest(routeSchema), createRoute);
router.patch('/routes/:id', validateRequest(routeSchema.partial()), updateRoute);
router.get('/fare-rules', getFareRules);
router.post('/fare-rules', validateRequest(fareRuleSchema), createFareRule);
router.patch('/fare-rules/:id', validateRequest(fareRuleSchema.partial()), updateFareRule);
router.get('/inquiries', getInquiries);
router.patch('/inquiries/:id/status', validateRequest(inquiryStatusSchema), updateInquiryStatus);
router.get('/settings', getAdminSettings);
router.put('/settings', validateRequest(websiteSettingsSchema), updateAdminSettings);
export default router;
