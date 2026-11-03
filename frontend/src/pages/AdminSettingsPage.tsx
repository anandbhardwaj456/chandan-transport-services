import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, getApiErrorMessage } from '../services/api';

type SettingsForm = {
  businessName: string;
  location: string;
  heroTitle: string;
  heroDescription: string;
  serviceLocationLabel: string;
  aboutIntroduction: string;
  phoneNumbers: string;
  email: string;
  website: string;
  whatsappNumber: string;
  contactVerified: boolean;
  contentVerified: boolean;
};

const initialForm: SettingsForm = {
  businessName: 'Chandan Transportation Services',
  location: 'Jamshedpur, Jharkhand, India',
  heroTitle: '',
  heroDescription: '',
  serviceLocationLabel: '',
  aboutIntroduction: '',
  phoneNumbers: '',
  email: '',
  website: '',
  whatsappNumber: '',
  contactVerified: false,
  contentVerified: false,
};

const AdminSettingsPage = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    api.get('/admin/settings')
      .then(({ data }) => {
        const settings = data.data ?? {};
        setForm({
          businessName: settings.businessName ?? initialForm.businessName,
          location: settings.location ?? initialForm.location,
          heroTitle: settings.heroTitle ?? '',
          heroDescription: settings.heroDescription ?? '',
          serviceLocationLabel: settings.serviceLocationLabel ?? '',
          aboutIntroduction: settings.aboutIntroduction ?? '',
          phoneNumbers: (settings.phoneNumbers ?? []).join(', '),
          email: settings.email ?? '',
          website: settings.website ?? '',
          whatsappNumber: settings.whatsappNumber ?? '',
          contactVerified: settings.contactVerified ?? false,
          contentVerified: settings.contentVerified ?? false,
        });
      })
      .catch((apiError) => setError(getApiErrorMessage(apiError, 'Unable to load website settings.')))
      .finally(() => setLoading(false));
  }, []);

  const update = (field: keyof SettingsForm, value: string | boolean) =>
    setForm((current) => ({ ...current, [field]: value }));

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await api.put('/admin/settings', {
        ...form,
        phoneNumbers: form.phoneNumbers.split(',').map((phone) => phone.trim()).filter(Boolean),
      });
      setNotice('Website settings saved.');
    } catch (saveError) {
      setError(getApiErrorMessage(saveError, 'Unable to save website settings.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="section-shell py-20 text-center text-slate-300">Loading website settings...</div>;

  return (
    <div className="section-shell py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Administration</p><h1 className="mt-3 font-display text-4xl font-bold">Website and business settings</h1></div>
        <Link to="/admin" className="secondary-button">Back to dashboard</Link>
      </div>
      <p className="mb-6 max-w-3xl text-sm text-slate-300">Contact details and business claims are hidden from public pages until you explicitly mark them verified. Settings changes are recorded in the audit log.</p>
      <form onSubmit={save} className="grid gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
        {([
          ['businessName', 'Business name'],
          ['location', 'Business location'],
          ['heroTitle', 'Homepage headline'],
          ['heroDescription', 'Homepage description'],
          ['serviceLocationLabel', 'Service area label'],
          ['email', 'Business email'],
          ['website', 'Website URL'],
          ['whatsappNumber', 'WhatsApp number (international digits)'],
        ] as const).map(([field, label]) => (
          <label key={field} className="text-sm text-slate-200">{label}
            <input
              required={field === 'businessName' || field === 'location'}
              type={field === 'email' ? 'email' : field === 'website' ? 'url' : 'text'}
              value={form[field]}
              onChange={(event) => update(field, event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            />
          </label>
        ))}
        <label className="text-sm text-slate-200 md:col-span-2">Phone numbers (comma-separated)
          <input value={form.phoneNumbers} onChange={(event) => update('phoneNumbers', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
        </label>
        <label className="text-sm text-slate-200 md:col-span-2">About introduction
          <textarea rows={4} value={form.aboutIntroduction} onChange={(event) => update('aboutIntroduction', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
        </label>
        <label className="text-sm text-slate-200 md:col-span-2">Content and claims verification
          <span className="mt-2 flex items-center gap-2"><input type="checkbox" checked={form.contentVerified} onChange={(event) => update('contentVerified', event.target.checked)} /> Publish verified homepage and About content</span>
        </label>
        <label className="text-sm text-slate-200 md:col-span-2">Contact verification
          <span className="mt-2 flex items-center gap-2"><input type="checkbox" checked={form.contactVerified} onChange={(event) => update('contactVerified', event.target.checked)} /> Publish verified phone, email, website, and WhatsApp details</span>
        </label>
        {error && <p role="alert" className="text-sm text-red-300 md:col-span-2">{error}</p>}
        {notice && <p role="status" className="text-sm text-emerald-300 md:col-span-2">{notice}</p>}
        <button type="submit" disabled={saving} className="primary-button md:col-span-2">{saving ? 'Saving...' : 'Save settings'}</button>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
