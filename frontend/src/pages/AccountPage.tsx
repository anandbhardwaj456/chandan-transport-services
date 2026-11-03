import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { api, getApiErrorMessage } from '../services/api';

type Booking = {
  _id: string;
  bookingReference: string;
  pickupLocation: string;
  destination: string;
  status: string;
  pickupDate: string;
};

const AccountPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my-bookings')
      .then(({ data }) => setBookings(data.data?.bookings ?? []))
      .catch((apiError) => {
        setError(getApiErrorMessage(apiError, 'Unable to load booking history.'));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section-shell py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Customer account</p>
          <h1 className="mt-3 font-display text-4xl font-bold">Welcome, {user?.name}</h1>
          <p className="mt-2 text-slate-300">{user?.email}</p>
        </div>
        <Link to="/book-taxi" className="primary-button">Book a ride</Link>
      </div>
      <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-display text-2xl font-bold">Your booking history</h2>
        {loading && <p className="mt-5 text-slate-300">Loading bookings...</p>}
        {error && <p role="alert" className="mt-5 text-red-300">{error}</p>}
        {!loading && !error && bookings.length === 0 && <p className="mt-5 text-slate-300">No bookings are linked to your account yet.</p>}
        <div className="mt-5 space-y-3">
          {bookings.map((booking) => (
            <div key={booking._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div>
                <p className="font-semibold">{booking.pickupLocation} → {booking.destination}</p>
                <p className="mt-1 text-sm text-slate-400">{booking.bookingReference} · {booking.pickupDate}</p>
              </div>
              <span className="text-sm text-amber">{booking.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AccountPage;
