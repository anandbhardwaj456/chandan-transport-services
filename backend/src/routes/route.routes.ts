import { Router } from 'express';

import { getAllRoutes, getCorporateRates, getLocations, getServices, getVehicles, searchRoute } from '../controllers/route.controller.js';
import { getPublicSettings } from '../controllers/settings.controller.js';

const router = Router();

router.get('/locations', getLocations);
router.get('/routes', getAllRoutes);
router.get('/routes/search', searchRoute);
router.get('/vehicles', getVehicles);
router.get('/services', getServices);
router.get('/fares', getCorporateRates);
router.get('/settings', getPublicSettings);

export default router;
