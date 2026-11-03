import Inquiry from '../models/Inquiry.js';
import { sendSuccess } from '../utils/ApiResponse.js';
export const createCorporateInquiry = async (req, res, next) => {
    try {
        const { companyName, contactPerson, phone, email, serviceRequired, expectedVehicles, contractDuration, pickupLocations, additionalRequirements, } = req.body;
        const inquiry = await Inquiry.create({
            name: contactPerson,
            phone,
            email,
            message: `Corporate transportation inquiry: ${serviceRequired}`,
            inquiryType: 'corporate',
            companyName,
            serviceRequired,
            expectedVehicles,
            contractDuration,
            pickupLocations,
            additionalRequirements,
        });
        return sendSuccess(res, 201, 'Corporate inquiry submitted successfully', { inquiry });
    }
    catch (error) {
        next(error);
    }
};
export const createInquiry = async (req, res, next) => {
    try {
        const inquiry = await Inquiry.create(req.body);
        return sendSuccess(res, 201, 'Inquiry submitted successfully', { inquiry });
    }
    catch (error) {
        next(error);
    }
};
