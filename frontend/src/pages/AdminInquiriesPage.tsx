import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, getApiErrorMessage } from '../services/api';

type Inquiry = {
  _id: string;
  inquiryType: 'general' | 'corporate';
  name: string;
  companyName?: string;
  phone: string;
  email?: string;
  message: string;
  serviceRequired?: string;
  expectedVehicles?: number;
  contractDuration?: string;
  pickupLocations?: string[];
  additionalRequirements?: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
};

const AdminInquiriesPage = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInquiries = async () => {
    try {
      const { data } = await api.get('/admin/inquiries');
      setInquiries(data.data ?? []);
      setError('');
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to load inquiries.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadInquiries(); }, []);

  const updateStatus = async (id: string, status: Inquiry['status']) => {
    try {
      await api.patch(`/admin/inquiries/${id}/status`, { status });
      setInquiries((current) => current.map((inquiry) => inquiry._id === id ? { ...inquiry, status } : inquiry));
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to update inquiry status.'));
    }
  };

  return (
    <div className="section-shell py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 className="mt-3 font-display text-4xl font-bold">Customer and corporate inquiries</h1>
        </div>
        <Link to="/admin" className="secondary-button">Back to dashboard</Link>
      </div>
      {error && <p role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</p>}
      {loading ? <p className="text-slate-300">Loading inquiries...</p> : inquiries.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">No inquiries have been submitted.</div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <article key={inquiry._id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber">{inquiry.inquiryType} · {new Date(inquiry.createdAt).toLocaleDateString()}</p>
                  <h2 className="mt-2 text-xl font-semibold">{inquiry.companyName || inquiry.name}</h2>
                  {inquiry.companyName && <p className="mt-1 text-slate-300">Contact: {inquiry.name}</p>}
                  <p className="mt-2 text-sm text-slate-300">{inquiry.phone}{inquiry.email ? ` · ${inquiry.email}` : ''}</p>
                </div>
                <label className="text-sm text-slate-300">Status
                  <select value={inquiry.status} onChange={(event) => void updateStatus(inquiry._id, event.target.value as Inquiry['status'])} className="ml-2 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white">
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
              </div>
              {inquiry.inquiryType === 'corporate' ? (
                <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                  <p>Service: {inquiry.serviceRequired}</p>
                  <p>Vehicles: {inquiry.expectedVehicles}</p>
                  <p>Contract duration: {inquiry.contractDuration}</p>
                  <p>Pickup locations: {inquiry.pickupLocations?.join(', ')}</p>
                  {inquiry.additionalRequirements && <p className="sm:col-span-2">Additional requirements: {inquiry.additionalRequirements}</p>}
                </div>
              ) : <p className="mt-4 text-sm text-slate-300">{inquiry.message}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInquiriesPage;
