import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, getApiErrorMessage } from '../services/api';

type Vehicle = {
  _id: string;
  category: string;
  description: string;
  imageUrl?: string;
  passengerCapacity: number;
  luggageCapacity: number;
  features: string[];
};
type Rate = { vehicleCategory: string; corporateRates?: { outstationPerKm?: number } };

const FleetPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/vehicles'), api.get('/fares')])
      .then(([vehiclesResponse, ratesResponse]) => {
        setVehicles(vehiclesResponse.data?.data ?? []);
        setRates(ratesResponse.data?.data ?? []);
      })
      .catch((apiError) => setError(getApiErrorMessage(apiError, 'Unable to load current fleet information.')))
      .finally(() => setLoading(false));
  }, []);

  const publishedRate = (category: string) => rates.find((rate) => rate.vehicleCategory === category)?.corporateRates?.outstationPerKm;

  return (
    <div className="section-shell py-16">
      <div className="mb-12 text-center">
        <p className="eyebrow">Our fleet</p>
        <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Vehicle categories for your journey.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">Examples listed in the fleet are configurable categories, not a guarantee of a specific vehicle. Vehicle assignment is confirmed for your trip.</p>
      </div>
      {loading && <p className="text-center text-slate-300">Loading fleet...</p>}
      {error && <p role="alert" className="mb-6 text-center text-red-300">{error}</p>}
      {!loading && !error && vehicles.length === 0 && <p className="text-center text-slate-300">No vehicle categories are currently published.</p>}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle) => {
          const rate = publishedRate(vehicle.category);
          return (
            <article key={vehicle._id} className="card-surface overflow-hidden p-5">
              <img src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'} alt={`${vehicle.category} vehicle category`} className="h-52 w-full rounded-2xl object-cover" />
              <h2 className="mt-5 font-display text-2xl font-bold">{vehicle.category}</h2>
              <p className="mt-2 text-sm text-slate-300">{vehicle.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                <span>{vehicle.passengerCapacity} passengers</span><span>{vehicle.luggageCapacity} luggage</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {vehicle.features.map((feature) => <li key={feature}>• {feature}</li>)}
              </ul>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <p className="text-sm text-amber">{rate === undefined ? 'Pricing on request' : `From ₹${rate}/km (verified)`}</p>
                <Link to={`/book-taxi?vehicle=${encodeURIComponent(vehicle.category)}`} className="primary-button px-4 py-2 text-sm">Request this category</Link>
              </div>
              <p className="mt-3 text-xs text-slate-400">Final availability and fare depend on the requested trip and are confirmed by the backend.</p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default FleetPage;
