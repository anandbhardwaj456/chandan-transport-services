import Location from '../models/Location.js';
import Route from '../models/Route.js';
import Service from '../models/Service.js';
import Vehicle from '../models/Vehicle.js';

export const getLocationList = async () => {
  return Location.find({ active: true }).lean();
};

export const getRoutes = async () => {
  return Route.find({ status: 'active' }).lean();
};

export const searchRoutes = async (origin: string, destination: string) => {
  const query: any = { status: 'active' };

  if (origin) query.origin = { $regex: new RegExp(origin, 'i') };
  if (destination) query.destination = { $regex: new RegExp(destination, 'i') };

  return Route.find(query).lean();
};

export const getVehicles = async () => {
  return Vehicle.find({ active: true }).lean();
};

export const getServices = async () => {
  return Service.find({ active: true }).lean();
};
