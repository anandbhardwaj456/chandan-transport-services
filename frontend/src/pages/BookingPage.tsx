import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, getApiErrorMessage } from '../services/api';

type VehicleOption = {
  _id: string;
  category: string;
  passengerCapacity: number;
  luggageCapacity: number;
  description: string;
};
type LocationOption = { _id: string; name: string };

const defaultForm = {
  pickupLocation: 'Ranchi',
  destination: 'Jamshedpur',
  journeyType: 'one_way' as 'one_way' | 'round_trip',
  pickupDate: '',
  pickupTime: '',
  passengers: 2,
  vehicleCategory: 'Sedan',
  returnDate: '',
  returnTime: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  notes: '',
  consent: false,
};

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(defaultForm);
  const [vehicleOptions, setVehicleOptions] = useState<VehicleOption[]>([]);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [quote, setQuote] = useState<any>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const requestedCategory = searchParams.get('vehicle');
    setForm((current) => ({
      ...current,
      pickupLocation: searchParams.get('pickup') ?? current.pickupLocation,
      destination: searchParams.get('destination') ?? current.destination,
      vehicleCategory: requestedCategory ?? current.vehicleCategory,
    }));

    Promise.all([api.get('/vehicles'), api.get('/locations')])
      .then(([vehiclesResponse, locationsResponse]) => {
        const vehicles = (vehiclesResponse.data.data ?? []) as VehicleOption[];
        const supportedLocations = (locationsResponse.data.data ?? []) as LocationOption[];
        setVehicleOptions(vehicles);
        setLocations(supportedLocations);
        setForm((current) => {
          const pickupLocation = searchParams.get('pickup') ?? current.pickupLocation;
          const destination = searchParams.get('destination') ?? current.destination;
          return {
          ...current,
          pickupLocation: supportedLocations.some((location) => location.name === pickupLocation)
            ? pickupLocation
            : supportedLocations[0]?.name ?? '',
          destination: supportedLocations.some((location) => location.name === destination)
            ? destination
            : supportedLocations[1]?.name ?? supportedLocations[0]?.name ?? '',
          vehicleCategory: vehicles.some((vehicle) => vehicle.category === current.vehicleCategory)
            ? current.vehicleCategory
            : vehicles[0]?.category ?? '',
          };
        });
      })
      .catch((apiError) => setCatalogError(getApiErrorMessage(apiError, 'Unable to load current vehicle categories.')))
      .finally(() => setCatalogLoading(false));
  }, [searchParams]);

  const estimatedTotal = useMemo(() => {
    if (!quote?.estimatedFare) return null;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(quote.estimatedFare);
  }, [quote]);

  const updateField = (field: keyof typeof defaultForm, value: string | number | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleEstimate = async () => {
    setError('');
    setQuote(null);

    try {
      const payload = {
        pickupLocation: form.pickupLocation,
        destination: form.destination,
        journeyType: form.journeyType,
        pickupDate: form.pickupDate,
        pickupTime: form.pickupTime,
        passengers: Number(form.passengers),
        vehicleCategory: form.vehicleCategory,
        returnDate: form.returnDate || undefined,
        returnTime: form.returnTime || undefined,
      };

      const { data } = await api.post('/bookings/estimate', payload);
      setQuote(data.data ?? data);
    } catch (apiError: any) {
      const message = getApiErrorMessage(apiError, 'Unable to estimate this route right now.');
      setError(message);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        passengers: Number(form.passengers),
      };

      const { data } = await api.post('/bookings', payload);
      setBookingResult(data.data?.booking ?? data.data ?? null);
      setQuote(null);
    } catch (apiError: any) {
      const message = getApiErrorMessage(apiError, 'Unable to create booking. Please try again.');
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section-shell py-20">
      <div className="mb-8 text-center">
        <p className="eyebrow">Book a taxi</p>
        <h1 className="mt-4 font-display text-5xl font-bold">Plan your ride</h1>
      </div>

      <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="mb-8 flex flex-wrap gap-3">
          {['Journey details', 'Vehicle', 'Customer', 'Summary'].map((step, index) => (
            <div key={step} className={`rounded-full px-4 py-2 text-sm ${index === 0 ? 'bg-amber text-slate-950' : 'bg-slate-800 text-slate-200'}`}>
              {step}
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Pickup location</label>
            <select value={form.pickupLocation} onChange={(e) => updateField('pickupLocation', e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white">
              {locations.map((location) => <option key={location._id} value={location.name}>{location.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Destination</label>
            <select value={form.destination} onChange={(e) => updateField('destination', e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white">
              {locations.map((location) => <option key={location._id} value={location.name}>{location.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Journey type</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => updateField('journeyType', 'one_way')} className={`flex-1 rounded-xl px-4 py-3 ${form.journeyType === 'one_way' ? 'bg-amber text-slate-950' : 'bg-slate-900 text-white'}`}>
                One-way
              </button>
              <button type="button" onClick={() => updateField('journeyType', 'round_trip')} className={`flex-1 rounded-xl px-4 py-3 ${form.journeyType === 'round_trip' ? 'bg-amber text-slate-950' : 'bg-slate-900 text-white'}`}>
                Round trip
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Passengers</label>
            <input type="number" min={1} max={8} value={form.passengers} onChange={(e) => updateField('passengers', Number(e.target.value))} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Pickup date</label>
            <input type="date" value={form.pickupDate} onChange={(e) => updateField('pickupDate', e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Pickup time</label>
            <input type="time" value={form.pickupTime} onChange={(e) => updateField('pickupTime', e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
          </div>
          {form.journeyType === 'round_trip' && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Return date</label>
                <input type="date" value={form.returnDate} onChange={(e) => updateField('returnDate', e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Return time</label>
                <input type="time" value={form.returnTime} onChange={(e) => updateField('returnTime', e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
              </div>
            </>
          )}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {catalogLoading && <p className="text-sm text-slate-300 md:col-span-3">Loading active vehicle categories...</p>}
          {catalogError && <p role="alert" className="text-sm text-red-300 md:col-span-3">{catalogError}</p>}
          {vehicleOptions.map((vehicle) => (
            <div key={vehicle._id} className={`rounded-2xl border p-5 ${form.vehicleCategory === vehicle.category ? 'border-amber bg-amber/10' : 'border-white/10 bg-slate-950'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{vehicle.category}</h3>
                <span className="rounded-full bg-amber/10 px-2 py-1 text-[10px] uppercase text-amber">Active category</span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{vehicle.passengerCapacity} passengers · {vehicle.luggageCapacity} luggage</p>
              <p className="mt-2 text-sm text-slate-400">{vehicle.description}</p>
              <button
                type="button"
                className={`mt-5 w-full ${form.vehicleCategory === vehicle.category ? 'primary-button' : 'secondary-button'}`}
                onClick={() => updateField('vehicleCategory', vehicle.category)}
              >
                {form.vehicleCategory === vehicle.category ? 'Selected category' : 'Choose category'}
              </button>
            </div>
          ))}
          {!catalogLoading && !catalogError && vehicleOptions.length === 0 && <p className="text-sm text-slate-300 md:col-span-3">No vehicle categories are currently available for booking.</p>}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Customer name</label>
              <input value={form.customerName} onChange={(e) => updateField('customerName', e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Your full name" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Phone</label>
              <input value={form.customerPhone} onChange={(e) => updateField('customerPhone', e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
              <input type="email" value={form.customerEmail} onChange={(e) => updateField('customerEmail', e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="name@example.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Booking reference</label>
              <input value={bookingResult?.bookingReference ?? ''} readOnly className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-300" placeholder="Generated after booking" />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-200">Special notes</label>
            <textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)} rows={3} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Flight number, pickup instructions, or special requests" />
          </div>

          <label className="mt-4 flex items-center gap-3 text-sm text-slate-300">
            <input type="checkbox" checked={form.consent} onChange={(e) => updateField('consent', e.target.checked)} className="h-4 w-4" />
            I agree to receive booking updates and confirmation calls.
          </label>

          <div className="mt-6 flex flex-wrap gap-4">
            <button type="button" onClick={handleEstimate} disabled={!form.vehicleCategory || catalogLoading} className="secondary-button disabled:opacity-60">Estimate fare</button>
            <button type="button" onClick={handleSubmit} disabled={submitting || !form.vehicleCategory || catalogLoading} className="primary-button disabled:opacity-60">
              {submitting ? 'Booking...' : 'Confirm booking'}
            </button>
          </div>

          {error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

          {quote && (
            <div className="mt-6 rounded-2xl border border-amber/20 bg-amber/10 p-4 text-slate-100">
              <p className="text-xs uppercase tracking-[0.2em] text-amber">Fare estimate</p>
              <p className="mt-2 text-3xl font-bold">{estimatedTotal}</p>
              <p className="mt-2 text-sm text-slate-200">{quote.message ?? 'Estimated fare based on current route and vehicle data.'}</p>
              {quote.breakdown?.distanceKm && <p className="mt-1 text-xs text-slate-300">Distance: {quote.breakdown.distanceKm} km</p>}
            </div>
          )}

          {bookingResult && (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Booking confirmed</p>
              <p className="mt-2 text-xl font-bold">Reference: {bookingResult.bookingReference}</p>
              <p className="mt-1 text-sm">Status: {bookingResult.status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
