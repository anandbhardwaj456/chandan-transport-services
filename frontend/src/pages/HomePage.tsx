import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, CarFront, Clock3, MapPinned, Plane, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, getApiErrorMessage } from '../services/api';
import logo from '../assets/images/ct-services-logo.jpg';

type Service = { _id: string; name: string; description: string; active: boolean };
type Vehicle = {
  _id: string;
  category: string;
  description: string;
  imageUrl?: string;
  passengerCapacity: number;
  luggageCapacity: number;
  features: string[];
};
type Route = { _id: string; origin: string; destination: string };
type PublicSettings = {
  heroTitle: string;
  heroDescription: string;
  serviceLocationLabel: string;
};

const HomePage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [catalogError, setCatalogError] = useState('');
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/services'), api.get('/vehicles'), api.get('/routes'), api.get('/settings')])
      .then(([servicesResponse, vehiclesResponse, routesResponse, settingsResponse]) => {
        setServices(servicesResponse.data?.data ?? []);
        setFleet(vehiclesResponse.data?.data ?? []);
        setRoutes(routesResponse.data?.data ?? []);
        setSettings(settingsResponse.data?.data ?? null);
      })
      .catch((error) => {
        setCatalogError(getApiErrorMessage(error, 'Unable to load current services, fleet, and routes.'));
      })
      .finally(() => setCatalogLoading(false));
  }, []);

  const iconFor = (name: string) => {
    const title = name.toLowerCase();
    if (title.includes('airport')) return Plane;
    if (title.includes('corporate') || title.includes('business') || title.includes('meeting')) return BriefcaseBusiness;
    if (title.includes('round') || title.includes('monthly')) return Clock3;
    if (title.includes('route') || title.includes('local')) return MapPinned;
    return CarFront;
  };

  return (
    <>
      <section className="relative overflow-hidden bg-midnight">
        <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=2000&q=85" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/90 to-midnight/50" />
        <div className="section-shell relative grid min-h-[780px] items-center gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <img src={logo} alt="CT Services Jamshedpur emblem" className="mb-5 h-20 w-20 rounded-full object-contain sm:h-24 sm:w-24" />
            <p className="eyebrow mb-3">CT Services · Jamshedpur, Jharkhand</p>
            <p className="mb-5 text-sm font-semibold tracking-wide text-amber">Every Journey Begins with Trust.</p>
            <h1 className="max-w-2xl font-display text-5xl font-bold leading-[1.02] text-white md:text-6xl">{settings?.heroTitle ?? 'Reliable Corporate & Personal Cab Services'}</h1>
            <p className="mt-6 max-w-lg text-lg text-slate-300">{settings?.heroDescription ?? 'Safe, comfortable, and dependable transportation for your journeys across Jharkhand.'}</p>
            <p className="mt-3 text-sm text-slate-400">{settings?.serviceLocationLabel ?? 'Serving Jamshedpur and supported locations; route availability is confirmed when you book.'}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/book-taxi" className="primary-button">Book Your Ride <ArrowRight className="ml-2" size={18} /></Link>
              <Link to="/services" className="secondary-button">Explore Our Services</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2"><ShieldCheck size={17} className="text-amber" /> Booking details confirmed by our team</div>
              <div className="flex items-center gap-2"><Star size={17} className="text-amber" /> Customer-focused travel</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
            <div className="card-surface relative overflow-hidden p-4 shadow-glow">
              <img
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
                alt="Premium taxi vehicle"
                className="h-[420px] w-full rounded-2xl object-cover"
              />
              <div className="absolute left-8 top-8 rounded-full border border-amber/60 bg-slate-950/70 px-3 py-2 text-xs uppercase tracking-[0.2em] text-amber">Vehicle shown for illustration</div>
            </div>

            <div className="card-surface absolute -bottom-8 left-6 right-6 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Business travel</p>
                  <p className="mt-2 font-display text-xl font-bold">Plan a route with our team</p>
                </div>
                <Link to="/routes" className="primary-button px-4 py-2 text-sm">View route</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-shell py-20">
        <div className="mb-12 text-center">
          <p className="eyebrow">Why Chandan Transportation</p>
          <h2 className="mt-4 font-display text-4xl font-bold">Transport built around reliability.</h2>
        </div>
        {catalogLoading && <p className="mb-6 text-center text-slate-300">Loading current services...</p>}
        {catalogError && <p role="alert" className="mb-6 text-center text-red-300">{catalogError}</p>}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map(({ _id, name, description }) => {
            const Icon = iconFor(name);
            return <motion.div key={_id} whileHover={{ y: -4 }} className="card-surface p-6">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber/10 text-amber">
                <Icon size={22} />
              </div>
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="mt-3 text-sm text-slate-300">{description}</p>
              <Link to="/book-taxi" className="mt-5 inline-block text-sm text-amber underline">Ask about this service</Link>
            </motion.div>
          })}
          {!catalogLoading && !catalogError && services.length === 0 && <p className="text-slate-300 md:col-span-2">Services are being updated. Contact the team to check current availability.</p>}
        </div>
      </section>

      <section className="bg-charcoal py-16">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">What to expect</p>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">Clear trip details before you travel.</h2>
            <p className="mt-4 text-slate-300">Review configured routes and vehicle categories, submit your request, and wait for confirmation of trip availability and fare.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              'Choose from currently published routes',
              'Review active vehicle categories',
              'Get fare estimates validated by the backend',
              'Receive a booking reference for follow-up',
            ].map((item) => (
              <motion.div key={item} whileHover={{ y: -3 }} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-5">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-amber" />
                <p className="text-sm text-slate-200">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] py-20 text-slate-900">
        <div className="section-shell">
          <div className="mb-12 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-amber">Fleet overview</p>
              <h2 className="mt-4 font-display text-4xl font-bold">Choose the right ride.</h2>
            </div>
            <Link to="/fleet" className="text-sm font-semibold text-slate-900 underline">View all vehicles</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {fleet.map((vehicle) => (
              <div key={vehicle._id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <img src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'} alt={vehicle.category} className="h-52 w-full rounded-2xl object-cover" />
                <h3 className="mt-5 text-2xl font-bold">{vehicle.category}</h3>
                <p className="mt-2 text-sm text-slate-600">{vehicle.description}</p>
                <div className="mt-3 flex gap-4 text-sm text-slate-600">
                  <span>{vehicle.passengerCapacity} passengers</span>
                  <span>{vehicle.luggageCapacity} luggage</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {vehicle.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Availability confirmed per trip</span>
                  <Link to={`/book-taxi?vehicle=${encodeURIComponent(vehicle.category)}`} className="primary-button px-4 py-2 text-sm">Select</Link>
                </div>
              </div>
            ))}
            {!catalogLoading && !catalogError && fleet.length === 0 && <p className="text-slate-600">No vehicle categories are currently published.</p>}
          </div>
        </div>
      </section>

      <section className="section-shell py-20">
        <div className="mb-8 text-center">
          <p className="eyebrow">Popular routes</p>
          <h2 className="mt-4 font-display text-4xl font-bold">Explore Jharkhand by road.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {routes.map((route) => (
            <div key={route._id} className="card-surface p-5">
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">{route.origin} → {route.destination}</p>
                <MapPinned size={18} className="text-amber" />
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
                <span>Route option</span>
                <Link to="/routes" className="text-amber underline">Book</Link>
              </div>
            </div>
          ))}
          {!catalogLoading && !catalogError && routes.length === 0 && <p className="text-slate-300">No routes are currently published.</p>}
        </div>
      </section>
    </>
  );
};

export default HomePage;
