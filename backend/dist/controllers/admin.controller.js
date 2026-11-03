import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Service from '../models/Service.js';
import Route from '../models/Route.js';
import FareRule from '../models/FareRule.js';
import Driver from '../models/Driver.js';
import Inquiry from '../models/Inquiry.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess } from '../utils/ApiResponse.js';
const recordAdminChange = (req, action, resource, details) => AuditLog.create({
    action,
    user: req.user?._id?.toString(),
    resource,
    details,
});
export const dashboard = async (_req, res, next) => {
    try {
        const [totalBookings, pending, confirmed, completed, cancelled, usersCount, vehiclesCount] = await Promise.all([
            Booking.countDocuments(),
            Booking.countDocuments({ status: 'pending_confirmation' }),
            Booking.countDocuments({ status: 'confirmed' }),
            Booking.countDocuments({ status: 'completed' }),
            Booking.countDocuments({ status: 'cancelled' }),
            User.countDocuments(),
            Vehicle.countDocuments(),
        ]);
        const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(8).lean();
        return sendSuccess(res, 200, 'Dashboard data retrieved', {
            totalBookings,
            pending,
            confirmed,
            completed,
            cancelled,
            usersCount,
            vehiclesCount,
            recentBookings,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getBookings = async (_req, res, next) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 }).limit(50).lean();
        return sendSuccess(res, 200, 'Bookings retrieved', bookings);
    }
    catch (error) {
        next(error);
    }
};
export const updateBookingStatus = async (req, res, next) => {
    try {
        const { bookingId, status } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        booking.status = status;
        await booking.save();
        await recordAdminChange(req, 'booking_status_updated', booking._id.toString(), { status });
        return sendSuccess(res, 200, 'Booking status updated', { booking });
    }
    catch (error) {
        next(error);
    }
};
export const assignDriver = async (req, res, next) => {
    try {
        const { bookingId, driverId } = req.body;
        const booking = await Booking.findById(bookingId);
        const driver = await Driver.findById(driverId);
        if (!booking || !driver) {
            return res.status(404).json({ success: false, message: 'Booking or driver not found' });
        }
        booking.status = 'driver_assigned';
        await booking.save();
        await recordAdminChange(req, 'booking_driver_assigned', booking._id.toString(), { driverId: driver._id.toString() });
        return sendSuccess(res, 200, 'Driver assigned', { booking, driver });
    }
    catch (error) {
        next(error);
    }
};
export const listCustomers = async (_req, res, next) => {
    try {
        const users = await User.find({ role: 'customer' }).select('-passwordHash').sort({ createdAt: -1 }).lean();
        return sendSuccess(res, 200, 'Customers retrieved', users);
    }
    catch (error) {
        next(error);
    }
};
export const listDrivers = async (_req, res, next) => {
    try {
        const drivers = await Driver.find().sort({ createdAt: -1 }).lean();
        return sendSuccess(res, 200, 'Drivers retrieved', drivers);
    }
    catch (error) {
        next(error);
    }
};
export const createDriver = async (req, res, next) => {
    try {
        const driver = await Driver.create(req.body);
        await recordAdminChange(req, 'driver_created', driver._id.toString(), { name: driver.name });
        return sendSuccess(res, 201, 'Driver created', { driver });
    }
    catch (error) {
        next(error);
    }
};
export const getVehiclesForAdmin = async (_req, res, next) => {
    try {
        const data = await Vehicle.find().sort({ createdAt: -1 }).lean();
        return sendSuccess(res, 200, 'Vehicles retrieved', data);
    }
    catch (error) {
        next(error);
    }
};
export const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        await recordAdminChange(req, 'vehicle_created', vehicle._id.toString(), { category: vehicle.category });
        return sendSuccess(res, 201, 'Vehicle created', { vehicle });
    }
    catch (error) {
        next(error);
    }
};
export const updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!vehicle)
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        await AuditLog.create({
            action: 'vehicle_updated',
            user: req.user?._id?.toString(),
            resource: vehicle._id.toString(),
            details: { category: vehicle.category, active: vehicle.active },
        });
        return sendSuccess(res, 200, 'Vehicle updated', { vehicle });
    }
    catch (error) {
        next(error);
    }
};
export const getServicesForAdmin = async (_req, res, next) => {
    try {
        const data = await Service.find().sort({ createdAt: -1 }).lean();
        return sendSuccess(res, 200, 'Services retrieved', data);
    }
    catch (error) {
        next(error);
    }
};
export const createService = async (req, res, next) => {
    try {
        const service = await Service.create(req.body);
        await recordAdminChange(req, 'service_created', service._id.toString(), { name: service.name });
        return sendSuccess(res, 201, 'Service created', { service });
    }
    catch (error) {
        next(error);
    }
};
export const updateService = async (req, res, next) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!service)
            return res.status(404).json({ success: false, message: 'Service not found' });
        await AuditLog.create({
            action: 'service_updated',
            user: req.user?._id?.toString(),
            resource: service._id.toString(),
            details: { name: service.name, active: service.active },
        });
        return sendSuccess(res, 200, 'Service updated', { service });
    }
    catch (error) {
        next(error);
    }
};
export const getRoutesForAdmin = async (_req, res, next) => {
    try {
        const data = await Route.find().sort({ createdAt: -1 }).lean();
        return sendSuccess(res, 200, 'Routes retrieved', data);
    }
    catch (error) {
        next(error);
    }
};
export const createRoute = async (req, res, next) => {
    try {
        const route = await Route.create(req.body);
        await recordAdminChange(req, 'route_created', route._id.toString(), { origin: route.origin, destination: route.destination });
        return sendSuccess(res, 201, 'Route created', { route });
    }
    catch (error) {
        next(error);
    }
};
export const updateRoute = async (req, res, next) => {
    try {
        const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!route)
            return res.status(404).json({ success: false, message: 'Route not found' });
        await AuditLog.create({
            action: 'route_updated',
            user: req.user?._id?.toString(),
            resource: route._id.toString(),
            details: { origin: route.origin, destination: route.destination, status: route.status },
        });
        return sendSuccess(res, 200, 'Route updated', { route });
    }
    catch (error) {
        next(error);
    }
};
export const getFareRules = async (_req, res, next) => {
    try {
        const rules = await FareRule.find().sort({ createdAt: -1 }).lean();
        return sendSuccess(res, 200, 'Fare rules retrieved', rules);
    }
    catch (error) {
        next(error);
    }
};
export const createFareRule = async (req, res, next) => {
    try {
        const rule = await FareRule.create(req.body);
        await recordAdminChange(req, 'fare_rule_created', rule._id.toString(), { name: rule.name, verified: rule.verified });
        return sendSuccess(res, 201, 'Fare rule created', { rule });
    }
    catch (error) {
        next(error);
    }
};
export const updateFareRule = async (req, res, next) => {
    try {
        const rule = await FareRule.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!rule) {
            return res.status(404).json({ success: false, message: 'Fare rule not found' });
        }
        await AuditLog.create({
            action: 'fare_rule_updated',
            user: req.user?._id?.toString(),
            resource: rule._id.toString(),
            details: { name: rule.name, verified: rule.verified },
        });
        return sendSuccess(res, 200, 'Fare rule updated', { rule });
    }
    catch (error) {
        next(error);
    }
};
export const getInquiries = async (_req, res, next) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(100).lean();
        return sendSuccess(res, 200, 'Inquiries retrieved', inquiries);
    }
    catch (error) {
        next(error);
    }
};
export const updateInquiryStatus = async (req, res, next) => {
    try {
        const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
        if (!inquiry) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }
        await AuditLog.create({
            action: 'inquiry_status_updated',
            user: req.user?._id?.toString(),
            resource: inquiry._id.toString(),
            details: { status: inquiry.status },
        });
        return sendSuccess(res, 200, 'Inquiry status updated', { inquiry });
    }
    catch (error) {
        next(error);
    }
};
