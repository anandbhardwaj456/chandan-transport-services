import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, getApiErrorMessage } from '../services/api';

type CorporateRate = {
  _id: string;
  name: string;
  vehicleCategory: string;
  corporateRates?: {
    eightHoursEightyKm?: number;
    twelveHoursOneTwentyKm?: number;
    outstationPerKm?: number;
  };
  additionalChargePolicy?: {
    extraHour?: number;
    extraKmPerKm?: number;
    tolls?: string;
    parking?: string;
    taxes?: string;
    minimumOutstationKmPerDay?: number;
  };
};

const currency = (amount?: number, suffix = '') =>
  amount === undefined || amount <= 0 ? 'Not configured' : `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)}${suffix}`;

const CorporatePage = () => {
  const [rates, setRates] = useState<CorporateRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRate, setSelectedRate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    serviceRequired: '',
    expectedVehicles: 1,
    contractDuration: '',
    pickupLocations: '',
    additionalRequirements: '',
  });

  useEffect(() => {
    api.get('/fares')
      .then(({ data }) => setRates(data.data ?? []))
      .catch((apiError) => {
        setError(getApiErrorMessage(apiError, 'Unable to load current corporate rates.'));
      })
      .finally(() => setLoading(false));
  }, []);

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await api.post('/inquiries/corporate', {
        ...form,
        expectedVehicles: Number(form.expectedVehicles),
        pickupLocations: form.pickupLocations.split(',').map((item) => item.trim()).filter(Boolean),
      });
      setSubmitted(true);
    } catch (apiError) {
      setFormError(getApiErrorMessage(apiError, 'Unable to submit your request. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: keyof typeof form, value: string | number) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <div>
      <section className="bg-charcoal py-16">
        <div className="section-shell">
          <p className="eyebrow">Corporate transportation</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold md:text-5xl">Business travel, coordinated around your needs.</h1>
          <p className="mt-5 max-w-2xl text-slate-300">Discuss employee transport, recurring bookings, or business travel arrangements with Chandan Transportation Services. Availability and terms are confirmed for each inquiry.</p>
          <a href="#request-quote" className="primary-button mt-7">Request a corporate quote</a>
        </div>
      </section>

      <section className="section-shell py-16">
        <div>
          <p className="eyebrow">Verified pricing</p>
          <h2 className="mt-3 font-display text-3xl font-bold">Corporate rate card</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">Only administrator-verified and active prices are displayed. Rates and vehicle availability are subject to confirmation before booking.</p>
        </div>
        {loading && <p className="mt-6 text-slate-300">Loading current rates...</p>}
        {error && <p role="alert" className="mt-6 text-red-300">{error}</p>}
        {!loading && !error && rates.length === 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">
            Corporate prices have not been verified for publication. Request a quote for current availability and pricing.
          </div>
        )}
        {rates.length > 0 && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-[700px] w-full border-collapse text-left">
              <thead className="bg-charcoal text-sm text-amber">
                <tr>
                  <th className="p-4">Vehicle category</th>
                  <th className="p-4">8 hours / 80 km</th>
                  <th className="p-4">12 hours / 120 km</th>
                  <th className="p-4">Outstation</th>
                  <th className="p-4">Booking</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate) => (
                  <tr key={rate._id} onClick={() => setSelectedRate(rate._id)} className={`cursor-pointer border-t border-white/10 ${selectedRate === rate._id ? 'bg-amber/10' : 'bg-white/5'}`}>
                    <td className="p-4 font-semibold">{rate.vehicleCategory}</td>
                    <td className="p-4">{currency(rate.corporateRates?.eightHoursEightyKm)}</td>
                    <td className="p-4">{currency(rate.corporateRates?.twelveHoursOneTwentyKm)}</td>
                    <td className="p-4">{currency(rate.corporateRates?.outstationPerKm, '/ km')}</td>
                    <td className="p-4"><Link to={`/book-taxi?vehicle=${encodeURIComponent(rate.vehicleCategory)}`} onClick={(event) => event.stopPropagation()} className="text-sm text-amber underline">Book this vehicle</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {rates.some((rate) => rate.additionalChargePolicy) && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-display text-xl font-bold">Additional charges and conditions</h3>
            <ul className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-3">
              {rates.flatMap((rate) => {
                const policy = rate.additionalChargePolicy;
                if (!policy) return [];
                return [
                  policy.extraHour !== undefined ? `${rate.vehicleCategory}: extra hour ${currency(policy.extraHour)}` : '',
                  policy.extraKmPerKm !== undefined ? `${rate.vehicleCategory}: extra km ${currency(policy.extraKmPerKm, '/ km')}` : '',
                  policy.tolls ? `Tolls: ${policy.tolls}` : '',
                  policy.parking ? `Parking: ${policy.parking}` : '',
                  policy.taxes ? `Taxes: ${policy.taxes}` : '',
                  policy.minimumOutstationKmPerDay !== undefined ? `Minimum outstation billing: ${policy.minimumOutstationKmPerDay} km/day` : '',
                ].filter(Boolean);
              }).map((line) => <li key={line}>• {line}</li>)}
            </ul>
            <p className="mt-4 text-xs text-slate-400">Final fare and applicable charges are confirmed by the business. The booking fare is calculated or validated by the backend.</p>
          </div>
        )}
        <div className="mt-6">
          <a href="#request-quote" className="secondary-button">Request Corporate Quote</a>
        </div>
      </section>

      <section id="request-quote" className="bg-charcoal py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Tell us what you need</p>
            <h2 className="mt-3 font-display text-3xl font-bold">Request a corporate quote</h2>
            <p className="mt-4 text-slate-300">Share your requirements and the team can follow up to confirm service availability and terms.</p>
          </div>
          {submitted ? (
            <div role="status" className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-emerald-100">
              Your corporate inquiry was submitted. The team will review your request.
            </div>
          ) : (
            <form onSubmit={submitInquiry} className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-6 sm:grid-cols-2">
              {([
                ['companyName', 'Company name', 'text'],
                ['contactPerson', 'Contact person', 'text'],
                ['phone', 'Phone number', 'tel'],
                ['email', 'Email', 'email'],
                ['serviceRequired', 'Required service', 'text'],
                ['contractDuration', 'Contract duration', 'text'],
              ] as const).map(([field, label, type]) => (
                <label key={field} className="text-sm text-slate-200">{label}
                  <input required type={type} value={form[field]} onChange={(event) => update(field, event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" />
                </label>
              ))}
              <label className="text-sm text-slate-200">Expected number of vehicles
                <input required type="number" min={1} max={1000} value={form.expectedVehicles} onChange={(event) => update('expectedVehicles', Number(event.target.value))} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" />
              </label>
              <label className="text-sm text-slate-200">Pickup locations (comma-separated)
                <input required value={form.pickupLocations} onChange={(event) => update('pickupLocations', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" />
              </label>
              <label className="text-sm text-slate-200 sm:col-span-2">Additional requirements
                <textarea rows={4} value={form.additionalRequirements} onChange={(event) => update('additionalRequirements', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white" />
              </label>
              {formError && <p role="alert" className="text-sm text-red-300 sm:col-span-2">{formError}</p>}
              <button type="submit" disabled={submitting} className="primary-button sm:col-span-2">{submitting ? 'Submitting...' : 'Send quote request'}</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default CorporatePage;
