import { Router } from 'express';

import { createCorporateInquiry, createInquiry } from '../controllers/inquiry.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { z } from 'zod';

const inquirySchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().min(10),
});

const corporateInquirySchema = z.object({
  companyName: z.string().min(2).max(150),
  contactPerson: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  email: z.string().email(),
  serviceRequired: z.string().min(2).max(150),
  expectedVehicles: z.number().int().min(1).max(1000),
  contractDuration: z.string().min(1).max(100),
  pickupLocations: z.array(z.string().min(2).max(150)).min(1).max(30),
  additionalRequirements: z.string().max(2000).optional().default(''),
});

const router = Router();
router.post('/', validateRequest(inquirySchema), createInquiry);
router.post('/corporate', validateRequest(corporateInquirySchema), createCorporateInquiry);

export default router;
