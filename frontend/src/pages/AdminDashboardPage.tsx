import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../services/api';

const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setDashboard(data.data ?? data);
      } catch (apiError: any) {
        const message = apiError?.response?.data?.message ?? 'Please sign in as an admin to view this page.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="section-shell py-20 text-center text-slate-300">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-shell flex min-h-[60vh] items-center justify-center py-20">
        <div className="w-full max-w-xl rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <p className="eyebrow text-red-300">Access required</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Admin dashboard unavailable</h1>
          <p className="mt-4 text-slate-200">{error}</p>
          <Link to="/login" className="primary-button mt-6 inline-flex">Go to admin login</Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total bookings', value: dashboard?.totalBookings ?? 0 },
    { label: 'Pending', value: dashboard?.pending ?? 0 },
    { label: 'Confirmed', value: dashboard?.confirmed ?? 0 },
    { label: 'Completed', value: dashboard?.completed ?? 0 },
  ];

  return (
    <div className="section-shell py-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Operations board</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Admin dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/bookings" className="primary-button">Manage bookings</Link>
          <Link to="/admin/catalog" className="secondary-button">Fleet & pricing</Link>
          <Link to="/admin/services" className="secondary-button">Manage services</Link>
          <Link to="/admin/settings" className="secondary-button">Website settings</Link>
          <Link to="/admin/inquiries" className="secondary-button">Review inquiries</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
            <p className="mt-4 text-4xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-2xl font-bold">Recent bookings</h2>
          <div className="mt-6 space-y-3">
            {(dashboard?.recentBookings ?? []).map((booking: any) => (
              <div key={booking._id ?? booking.bookingReference} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div>
                  <p className="font-semibold">{booking.customerName}</p>
                  <p className="text-sm text-slate-300">{booking.pickupLocation} → {booking.destination}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber">{booking.status}</p>
                  <p className="text-xs text-slate-400">{booking.bookingReference}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-2xl font-bold">Operations snapshot</h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-200">
            <li>Users: {dashboard?.usersCount ?? 0}</li>
            <li>Vehicles: {dashboard?.vehiclesCount ?? 0}</li>
            <li>Cancelled: {dashboard?.cancelled ?? 0}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
