import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { api, getApiErrorMessage } from '../services/api';

const ContactPage = () => {
  const [settings, setSettings] = useState<{
    location: string;
    contact: { phoneNumbers: string[]; email: string; website: string; whatsappNumber: string } | null;
  } | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => setSettings(data.data ?? null))
      .catch((settingsLoadError) => setSettingsError(getApiErrorMessage(settingsLoadError, 'Verified contact details are unavailable.')));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/inquiries', { ...form, email: form.email || undefined });
      setSubmitted(true);
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Unable to send your inquiry. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <div className="section-shell py-16">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Speak with our travel team.</h1>
          <p className="mt-5 text-slate-300">Send your question or trip requirements. The team will confirm service availability and next steps.</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Business location</p>
            <p className="mt-3 text-lg">{settings?.location ?? 'Jamshedpur, Jharkhand, India'}</p>
            {settings?.contact?.phoneNumbers.map((phone) => <a key={phone} className="mt-2 block text-sm text-amber hover:underline" href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>)}
            {settings?.contact?.email && <a className="mt-2 block text-sm text-amber hover:underline" href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>}
            {settings?.contact?.website && <a className="mt-2 block text-sm text-amber hover:underline" href={settings.contact.website} target="_blank" rel="noreferrer">Business website</a>}
            {settings?.contact?.whatsappNumber && <a className="mt-2 inline-block text-sm text-amber hover:underline" href={`https://wa.me/${settings.contact.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp inquiry</a>}
            {!settings?.contact && !settingsError && <p className="mt-2 text-sm text-slate-400">Phone, email, and WhatsApp details will be published after business verification.</p>}
            {settingsError && <p role="status" className="mt-2 text-sm text-red-300">{settingsError}</p>}
          </div>
          <Link to="/corporate#request-quote" className="mt-6 inline-block text-sm text-amber underline">Corporate transportation inquiry</Link>
        </div>
        {submitted ? (
          <div role="status" className="self-start rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-emerald-100">
            Your inquiry has been submitted. Thank you for contacting Chandan Transportation Services.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="grid gap-4">
              <label htmlFor="contact-name" className="text-sm font-medium text-slate-200">Name
                <input id="contact-name" required minLength={2} value={form.name} onChange={(event) => update('name', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" autoComplete="name" />
              </label>
              <label htmlFor="contact-phone" className="text-sm font-medium text-slate-200">Phone
                <input id="contact-phone" required minLength={10} maxLength={15} value={form.phone} onChange={(event) => update('phone', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" autoComplete="tel" />
              </label>
              <label htmlFor="contact-email" className="text-sm font-medium text-slate-200">Email (optional)
                <input id="contact-email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" autoComplete="email" />
              </label>
              <label htmlFor="contact-message" className="text-sm font-medium text-slate-200">Message
                <textarea id="contact-message" required minLength={10} rows={4} value={form.message} onChange={(event) => update('message', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="How can we help?" />
              </label>
              {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
              <button type="submit" disabled={submitting} className="primary-button w-full">{submitting ? 'Sending...' : 'Send inquiry'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
