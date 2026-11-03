import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { api } from '../services/api';

type BookingStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'driver_assigned'
  | 'in_transit'
  | 'completed'
  | 'cancelled';

type Booking = {
  _id: string;
  bookingReference: string;
  customerName: string;
  pickupLocation: string;
  destination: string;
  status: BookingStatus;
  totalAmount: number;
  createdAt?: string;
};

const STATUS_OPTIONS: BookingStatus[] = [
  'pending_confirmation',
  'confirmed',
  'driver_assigned',
  'in_transit',
  'completed',
  'cancelled',
];

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | BookingStatus>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/bookings');
      setBookings(data.data ?? data);
      setError('');
    } catch (apiError: any) {
      const message = apiError?.response?.data?.message ?? 'Unable to load bookings right now.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    if (filter === 'all') {
      return bookings;
    }

    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  const handleStatusChange = async (bookingId: string, status: BookingStatus) => {
    try {
      setUpdatingId(bookingId);
      await api.patch('/admin/bookings/status', { bookingId, status });
      await fetchBookings();
    } catch (apiError: any) {
      const message = apiError?.response?.data?.message ?? 'Unable to update booking status.';
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="section-shell py-20 text-center text-slate-300">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="section-shell py-20">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Operations</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Manage bookings</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin" className="secondary-button">Back to dashboard</Link>
          <button type="button" onClick={() => void fetchBookings()} className="primary-button">Refresh</button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="booking-status-filter" className="text-sm text-slate-300">
          Filter by status
        </label>
        <select
          id="booking-status-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value as 'all' | BookingStatus)}
          className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
        >
          <option value="all">All bookings</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="border-b border-white/10 bg-slate-950/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="border-b border-white/10 last:border-b-0">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{booking.bookingReference}</p>
                    <p className="text-xs text-slate-400">{new Date(booking.createdAt ?? Date.now()).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p>{booking.customerName}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p>{booking.pickupLocation}</p>
                    <p className="text-xs text-slate-400">to {booking.destination}</p>
                  </td>
                  <td className="px-4 py-4">₹{booking.totalAmount?.toLocaleString() ?? '0'}</td>
                  <td className="px-4 py-4">
                    <select
                      value={booking.status}
                      onChange={(event) => void handleStatusChange(booking._id, event.target.value as BookingStatus)}
                      disabled={updatingId === booking._id}
                      className="rounded-xl border border-white/10 bg-slate-950 px-2 py-2 text-white"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="p-8 text-center text-slate-300">No bookings match this filter.</div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
