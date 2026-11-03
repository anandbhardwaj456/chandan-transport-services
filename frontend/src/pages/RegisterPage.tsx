import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { api, getApiErrorMessage } from '../services/api';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      await refreshUser();
      navigate('/account', { replace: true });
    } catch (apiError) {
      const message = getApiErrorMessage(apiError, 'Unable to create your account. Please try again.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <div className="section-shell flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="eyebrow">Customer account</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Create your account</h1>
        <p className="mt-3 text-sm text-slate-300">Register as a customer to review your bookings.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-slate-200 sm:col-span-2">Full name
            <input required minLength={2} maxLength={100} value={form.name} onChange={(event) => update('name', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" autoComplete="name" />
          </label>
          <label className="text-sm text-slate-200">Mobile number
            <input required minLength={10} maxLength={15} value={form.phone} onChange={(event) => update('phone', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" autoComplete="tel" />
          </label>
          <label className="text-sm text-slate-200">Email
            <input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" autoComplete="email" />
          </label>
          <label className="text-sm text-slate-200">Password
            <input required minLength={6} type="password" value={form.password} onChange={(event) => update('password', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" autoComplete="new-password" />
          </label>
          <label className="text-sm text-slate-200">Confirm password
            <input required minLength={6} type="password" value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" autoComplete="new-password" />
          </label>
          {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200 sm:col-span-2">{error}</p>}
          <button type="submit" disabled={loading} className="primary-button w-full disabled:opacity-70 sm:col-span-2">{loading ? 'Creating account...' : 'Create customer account'}</button>
        </form>
        <p className="mt-5 text-sm text-slate-300">Already registered? <Link to="/login" className="text-amber underline">Log in</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
