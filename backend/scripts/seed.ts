import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import Location from '../src/models/Location.js';
import Route from '../src/models/Route.js';
import Service from '../src/models/Service.js';
import Vehicle from '../src/models/Vehicle.js';
import FareRule from '../src/models/FareRule.js';

const seed = async () => {
  await connectDatabase();

  await Promise.all([
    Location.deleteMany({}),
    Route.deleteMany({}),
    Service.deleteMany({}),
    Vehicle.deleteMany({}),
    FareRule.deleteMany({}),
  ]);

  const locations = [
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Dumka', 'Ramgarh', 'Chaibasa', 'Palamu', 'Netarhat',
  ];

  const locationDocs = await Location.insertMany(
    locations.map((name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-'), state: 'Jharkhand', active: true })),
  );

  await Route.insertMany([
    { origin: 'Ranchi', destination: 'Jamshedpur', routeType: 'one_way', status: 'active', metadata: { distanceKm: 170 } },
    { origin: 'Ranchi', destination: 'Dhanbad', routeType: 'one_way', status: 'active', metadata: { distanceKm: 145 } },
    { origin: 'Jamshedpur', destination: 'Bokaro', routeType: 'one_way', status: 'active', metadata: { distanceKm: 118 } },
    { origin: 'Dhanbad', destination: 'Deoghar', routeType: 'one_way', status: 'active', metadata: { distanceKm: 110 } },
    { origin: 'Ranchi', destination: 'Hazaribagh', routeType: 'one_way', status: 'active', metadata: { distanceKm: 92 } },
    { origin: 'Jamshedpur', destination: 'Ranchi', routeType: 'round_trip', status: 'active', metadata: { distanceKm: 170 } },
    { origin: 'Bokaro', destination: 'Dumka', routeType: 'one_way', status: 'active', metadata: { distanceKm: 160 } },
  ]);

  await Vehicle.insertMany([
    {
      category: 'Hatchback',
      description: 'Comfortable compact ride for short city and intercity trips.',
      imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      passengerCapacity: 4,
      luggageCapacity: 2,
      features: ['AC', 'Music', 'Daily service'],
      active: true,
      pricingModel: 'per_km',
    },
    {
      category: 'Sedan',
      description: 'Premium sedan for business and family travel.',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      passengerCapacity: 4,
      luggageCapacity: 3,
      features: ['AC', 'Wi-Fi', 'Airport transfer'],
      active: true,
      pricingModel: 'per_km',
    },
    {
      category: 'SUV',
      description: 'Spacious vehicle for family trips and luggage-heavy journeys.',
      imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
      passengerCapacity: 6,
      luggageCapacity: 4,
      features: ['AC', 'Extra luggage', 'Family travel'],
      active: true,
      pricingModel: 'per_km',
    },
    {
      category: 'Premium',
      description: 'Luxury-class comfort for premium itineraries and executive transport.',
      imageUrl: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
      passengerCapacity: 4,
      luggageCapacity: 3,
      features: ['Leather seats', 'Daily travel', 'Executive comfort'],
      active: true,
      pricingModel: 'fixed_route',
    },
  ]);

  await Service.insertMany([
    {
      name: 'One-way taxi',
      description: 'Point-to-point taxi bookings for intercity and local trips.',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      active: true,
      slug: 'one-way-taxi',
      category: 'travel',
    },
    {
      name: 'Round trip',
      description: 'Flexible return bookings for family, office, and tourism travel.',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
      active: true,
      slug: 'round-trip',
      category: 'travel',
    },
    {
      name: 'Airport transfer',
      description: 'On-time airport pickup and drop-off across Jharkhand.',
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
      active: true,
      slug: 'airport-transfer',
      category: 'travel',
    },
  ]);

  await FareRule.insertMany([
    {
      name: 'Sedan base fare',
      pricingModel: 'per_km',
      vehicleCategory: 'Sedan',
      baseFare: 1200,
      perKmRate: 18,
      minimumDistance: 25,
      driverAllowance: 250,
      additionalCharges: 0,
      taxRate: 5,
      active: true,
    },
    {
      name: 'SUV base fare',
      pricingModel: 'per_km',
      vehicleCategory: 'SUV',
      baseFare: 1800,
      perKmRate: 22,
      minimumDistance: 30,
      driverAllowance: 350,
      additionalCharges: 0,
      taxRate: 5,
      active: true,
    },
  ]);

  console.log('Database seed complete. Added', locationDocs.length, 'locations.');
  await disconnectDatabase();
};

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
