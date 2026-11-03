import { NextFunction, Request, Response } from 'express';

import {
  getLocationList,
  getRoutes,
  getServices as getServiceCatalog,
  getVehicles as getVehicleCatalog,
  searchRoutes,
} from '../services/route.service.js';
import FareRule from '../models/FareRule.js';
import { sendSuccess } from '../utils/ApiResponse.js';

export const getLocations = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getLocationList();
    return sendSuccess(res, 200, 'Locations retrieved', data);
  } catch (error) {
    next(error);
  }
};

export const getAllRoutes = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getRoutes();
    return sendSuccess(res, 200, 'Routes retrieved', data);
  } catch (error) {
    next(error);
  }
};

export const searchRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { origin, destination } = req.query;
    const data = await searchRoutes(String(origin ?? ''), String(destination ?? ''));
    return sendSuccess(res, 200, 'Routes found', data);
  } catch (error) {
    next(error);
  }
};

export const getVehicles = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getVehicleCatalog();
    return sendSuccess(res, 200, 'Vehicles retrieved', data);
  } catch (error) {
    next(error);
  }
};

export const getServices = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getServiceCatalog();
    return sendSuccess(res, 200, 'Services retrieved', data);
  } catch (error) {
    next(error);
  }
};

export const getCorporateRates = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rates = await FareRule.find({
      active: true,
      verified: true,
      $or: [
        { 'corporateRates.eightHoursEightyKm': { $gt: 0 } },
        { 'corporateRates.twelveHoursOneTwentyKm': { $gt: 0 } },
        { 'corporateRates.outstationPerKm': { $gt: 0 } },
      ],
    }).sort({ vehicleCategory: 1 }).lean();
    return sendSuccess(res, 200, 'Verified corporate rates retrieved', rates);
  } catch (error) {
    next(error);
  }
};
