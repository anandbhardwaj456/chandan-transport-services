import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, getApiErrorMessage } from '../services/api';

type Route = { _id: string; origin: string; destination: string; routeType?: string };

const RoutesPage = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/routes')
      .then(({ data }) => setRoutes(data.data ?? []))
      .catch((apiError) => setError(getApiErrorMessage(apiError, 'Unable to load currently supported routes.')))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section-shell py-16">
      <div className="mb-8 text-center">
        <p className="eyebrow">Routes</p>
        <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Check current route options.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">Only routes configured by the business are listed. For other destinations, send a quote request.</p>
      </div>
      {loading && <p className="text-center text-slate-300">Loading routes...</p>}
      {error && <p role="alert" className="mb-6 text-center text-red-300">{error}</p>}
      {!loading && !error && routes.length === 0 && <p className="text-center text-slate-300">No routes are currently published. Contact us to request a quote.</p>}
      <div className="grid gap-6 md:grid-cols-2">
        {routes.map((route) => (
          <div key={route._id} className="card-surface p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{route.routeType?.replace('_', ' ') ?? 'Route'}</p>
            <h2 className="mt-2 text-2xl font-bold">{route.origin} → {route.destination}</h2>
            <p className="mt-2 text-sm text-slate-300">Trip and vehicle availability are confirmed after you submit a booking request.</p>
            <Link to={`/book-taxi?pickup=${encodeURIComponent(route.origin)}&destination=${encodeURIComponent(route.destination)}`} className="primary-button mt-6 w-full">Request this route</Link>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link to="/corporate#request-quote" className="text-sm text-amber underline">Need an unlisted route? Request a quote.</Link>
      </div>
    </div>
  );
};

export default RoutesPage;
