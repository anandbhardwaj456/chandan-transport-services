import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, getApiErrorMessage } from '../services/api';

type Service = { _id: string; name: string; slug: string; description: string; category: string; active: boolean };

const AdminServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({ name: '', slug: '', category: 'transport', description: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/admin/services');
      setServices(data.data ?? []);
      setError('');
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load services.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const updateName = (name: string) => setForm((current) => ({
    ...current,
    name,
    slug: name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  }));

  const createService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      await api.post('/admin/services', { ...form, active: true });
      setForm({ name: '', slug: '', category: 'transport', description: '' });
      setNotice('Service added.');
      await load();
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Unable to add service.'));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleService = async (service: Service) => {
    setError('');
    setNotice('');
    try {
      await api.patch(`/admin/services/${service._id}`, { active: !service.active });
      setNotice(`${service.name} is now ${service.active ? 'disabled' : 'enabled'}.`);
      await load();
    } catch (toggleError) {
      setError(getApiErrorMessage(toggleError, 'Unable to update service availability.'));
    }
  };

  return (
    <div className="section-shell py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Administration</p><h1 className="mt-3 font-display text-4xl font-bold">Manage services</h1></div>
        <Link to="/admin" className="secondary-button">Back to dashboard</Link>
      </div>
      <form onSubmit={createService} className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
        <label className="text-sm text-slate-200">Service name
          <input required minLength={2} maxLength={100} value={form.name} onChange={(event) => updateName(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
        </label>
        <label className="text-sm text-slate-200">Category
          <input required minLength={2} maxLength={80} value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
        </label>
        <label className="text-sm text-slate-200 md:col-span-2">Description
          <textarea required minLength={2} maxLength={1000} rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
        </label>
        <p className="text-xs text-slate-400 md:col-span-2">Service URL key: {form.slug || 'generated from service name'}</p>
        <button type="submit" disabled={submitting} className="primary-button md:col-span-2">{submitting ? 'Saving...' : 'Add service'}</button>
      </form>
      {error && <p role="alert" className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</p>}
      {notice && <p role="status" className="mb-4 text-emerald-300">{notice}</p>}
      {loading ? <p className="text-slate-300">Loading services...</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <article key={service._id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber">{service.category} · {service.slug}</p>
                  <h2 className="mt-2 text-xl font-semibold">{service.name}</h2>
                </div>
                <button type="button" onClick={() => void toggleService(service)} className={service.active ? 'secondary-button px-3 py-2 text-xs' : 'primary-button px-3 py-2 text-xs'}>
                  {service.active ? 'Disable' : 'Enable'}
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-300">{service.description}</p>
              <p className="mt-3 text-xs text-slate-400">Public status: {service.active ? 'Enabled' : 'Disabled'}</p>
            </article>
          ))}
          {services.length === 0 && <p className="text-slate-300">No services configured.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminServicesPage;
