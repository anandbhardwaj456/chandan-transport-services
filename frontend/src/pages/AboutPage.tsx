import { useEffect, useState } from 'react';

import { api, getApiErrorMessage } from '../services/api';

const AboutPage = () => {
  const [aboutIntroduction, setAboutIntroduction] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => setAboutIntroduction(data.data?.aboutIntroduction ?? ''))
      .catch((apiError) => setError(getApiErrorMessage(apiError, 'Unable to load additional company information.')));
  }, []);

  return (
    <div className="section-shell py-20">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">About us</p>
          <h1 className="mt-4 font-display text-5xl font-bold">Trusted transportation for Jharkhand journeys.</h1>
          <p className="mt-6 text-lg text-slate-300">
            {aboutIntroduction || 'Chandan Transportation Services (CT Services) is a transportation provider based in Jamshedpur, Jharkhand. Trips and services are offered subject to business availability.'}
          </p>
          <p className="mt-4 text-slate-300">
            Our team can discuss personal travel, business transportation, and recurring service requirements. Vehicle category, route coverage, and journey arrangements are confirmed for each booking.
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <img
            src="https://images.unsplash.com/photo-1533106478329-188b0a5f4d0e?auto=format&fit=crop&w=1200&q=80"
            alt="Chandan transportation service"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <section className="mt-16">
        <p className="eyebrow">How we work</p>
        <h2 className="mt-3 font-display text-3xl font-bold">Clear trip planning, with details confirmed upfront.</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ['Corporate transportation', 'Discuss travel needs and recurring arrangements with our team.'],
            ['Customer coordination', 'Share pickup, destination, and timing requirements for confirmation.'],
            ['Vehicle categories', 'Choose from the categories currently configured in the fleet.'],
            ['Driver details', 'Trip-specific driver assignment is handled as part of booking coordination.'],
            ['Safety planning', 'Ask the team about arrangements and requirements for your journey.'],
            ['Reliability', 'Booking confirmation depends on route and vehicle availability for the requested trip.'],
          ].map(([title, description]) => (
            <article key={title} className="card-surface p-5">
              <h3 className="text-lg font-semibold text-amber">{title}</h3>
              <p className="mt-2 text-sm text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </section>
      {error && <p role="status" className="mt-4 text-sm text-red-300">{error}</p>}
    </div>
  );
};

export default AboutPage;
