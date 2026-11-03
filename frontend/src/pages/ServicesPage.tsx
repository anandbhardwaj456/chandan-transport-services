import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, CarFront, Clock3, MapPinned, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

import { api, getApiErrorMessage } from '../services/api';

type Service = { _id: string; name: string; description: string; image?: string; active: boolean };

const iconFor = (name: string) => {
  const serviceName = name.toLowerCase();
  if (serviceName.includes('airport') || serviceName.includes('transfer')) return Plane;
  if (serviceName.includes('corporate') || serviceName.includes('business') || serviceName.includes('meeting')) return BriefcaseBusiness;
  if (serviceName.includes('round') || serviceName.includes('monthly')) return Clock3;
  if (serviceName.includes('local') || serviceName.includes('route')) return MapPinned;
  return CarFront;
};

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/services')
      .then(({ data }) => setServices(data.data ?? []))
      .catch((apiError) => setError(getApiErrorMessage(apiError, 'Unable to load current services.')))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section-shell py-16">
      <div className="mb-12 text-center">
        <p className="eyebrow">Our services</p>
        <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Transportation for work and everyday travel.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">Service categories shown here are managed by the business. Availability is confirmed for each booking.</p>
      </div>
      {loading && <p className="text-center text-slate-300">Loading services...</p>}
      {error && <p role="alert" className="mb-6 text-center text-red-300">{error}</p>}
      {!loading && !error && services.length === 0 && <p className="text-center text-slate-300">No services are currently published. Contact us to discuss your trip.</p>}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => {
          const Icon = iconFor(service.name);
          return (
            <motion.article key={service._id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} whileHover={{ y: -4 }} className="card-surface overflow-hidden p-6">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber/10 text-amber"><Icon size={22} /></div>
              <h2 className="font-display text-2xl font-bold">{service.name}</h2>
              <p className="mt-3 min-h-12 text-sm text-slate-300">{service.description}</p>
              <Link to="/book-taxi" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber">Ask about this service <ArrowRight size={16} /></Link>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesPage;
