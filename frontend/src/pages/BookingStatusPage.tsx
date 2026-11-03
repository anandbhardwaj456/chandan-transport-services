import { useState } from 'react';
import { api } from '../services/api';

const BookingStatusPage = () => {
  const [reference, setReference] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!reference.trim()) {
      setError('Please enter a booking reference.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/bookings/status', { params: { reference: reference.trim() } });
      setBooking(data.data?.booking ?? data.data ?? null);
    } catch (apiError: any) {
      const message = apiError?.response?.data?.message ?? 'Unable to find this booking reference.';
      setError(message);
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell py-20">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="eyebrow">Booking status</p>
        <h1 className="mt-4 font-display text-4xl font-bold">Check your trip</h1>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-200">Booking reference</label>
          <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="CTS-ABC123" className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
        </div>

        <button onClick={handleCheck} disabled={loading} className="primary-button mt-6 w-full disabled:opacity-70">
          {loading ? 'Checking...' : 'Check booking status'}
        </button>

        {error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

        {booking && (
          <div className="mt-6 rounded-2xl border border-amber/20 bg-slate-950/60 p-4 text-slate-100">
            <p className="text-xs uppercase tracking-[0.2em] text-amber">Trip record</p>
            <p className="mt-2 text-xl font-bold">Reference: {booking.bookingReference}</p>
            <p className="mt-2 text-sm">Customer: {booking.customerName}</p>
            <p className="text-sm">Route: {booking.pickupLocation} → {booking.destination}</p>
            <p className="text-sm">Status: {booking.status}</p>
            <p className="text-sm">Vehicle: {booking.vehicleCategory}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatusPage;
