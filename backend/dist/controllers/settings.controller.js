import WebsiteSettings from '../models/WebsiteSettings.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess } from '../utils/ApiResponse.js';
export const getPublicSettings = async (_req, res, next) => {
    try {
        const settings = await WebsiteSettings.findOne({ key: 'primary' }).lean();
        const contentVerified = Boolean(settings?.contentVerified);
        const contactVerified = Boolean(settings?.contactVerified);
        return sendSuccess(res, 200, 'Website settings retrieved', {
            businessName: settings?.businessName || 'Chandan Transportation Services',
            location: settings?.location || 'Jamshedpur, Jharkhand, India',
            heroTitle: contentVerified && settings?.heroTitle ? settings.heroTitle : 'Reliable Corporate & Personal Cab Services',
            heroDescription: contentVerified && settings?.heroDescription
                ? settings.heroDescription
                : 'Safe, comfortable, and dependable transportation for your journeys across Jharkhand.',
            serviceLocationLabel: contentVerified && settings?.serviceLocationLabel
                ? settings.serviceLocationLabel
                : 'Serving Jamshedpur and supported locations; route availability is confirmed when you book.',
            aboutIntroduction: contentVerified ? settings?.aboutIntroduction ?? '' : '',
            contact: contactVerified ? {
                phoneNumbers: settings?.phoneNumbers ?? [],
                email: settings?.email ?? '',
                website: settings?.website ?? '',
                whatsappNumber: settings?.whatsappNumber ?? '',
            } : null,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getAdminSettings = async (_req, res, next) => {
    try {
        const settings = await WebsiteSettings.findOne({ key: 'primary' }).lean();
        return sendSuccess(res, 200, 'Admin settings retrieved', settings ?? {
            businessName: 'Chandan Transportation Services',
            location: 'Jamshedpur, Jharkhand, India',
            heroTitle: '',
            heroDescription: '',
            serviceLocationLabel: '',
            aboutIntroduction: '',
            phoneNumbers: [],
            email: '',
            website: '',
            whatsappNumber: '',
            contactVerified: false,
            contentVerified: false,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateAdminSettings = async (req, res, next) => {
    try {
        const settings = await WebsiteSettings.findOneAndUpdate({ key: 'primary' }, { $set: req.body, $setOnInsert: { key: 'primary' } }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
        await AuditLog.create({
            action: 'website_settings_updated',
            user: req.user?._id?.toString(),
            resource: settings._id.toString(),
            details: {
                contactVerified: settings.contactVerified,
                contentVerified: settings.contentVerified,
            },
        });
        return sendSuccess(res, 200, 'Website settings updated', { settings });
    }
    catch (error) {
        next(error);
    }
};
