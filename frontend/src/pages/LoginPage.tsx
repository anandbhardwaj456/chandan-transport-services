import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { api, getApiErrorMessage } from '../services/api';
import logo from '../assets/images/ct-services-logo.jpg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/login', { email: email.trim(), password });
      const user = await refreshUser();
      const redirectPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(redirectPath && redirectPath !== '/login' ? redirectPath : user?.role === 'admin' || user?.role === 'booking_manager' ? '/admin' : '/account', { replace: true });
    } catch (apiError) {
      const message = getApiErrorMessage(apiError, 'Unable to sign in. Please try again.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell flex min-h-[70vh] items-center justify-center py-20">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <img src={logo} alt="CT Services Jamshedpur emblem" className="mb-5 h-20 w-20 rounded-full object-contain" />
        <p className="eyebrow">Customer and administrator access</p>
        <h1 className="mt-4 font-display text-4xl font-bold">Login</h1>
        <p className="mt-3 text-sm text-slate-300">Sign in with the email address associated with your account.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-200">Email</label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-200">Password</label>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="mt-2 text-xs text-amber underline">
              {showPassword ? 'Hide password' : 'Show password'}
            </button>
          </div>

          {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

          <button type="submit" disabled={loading} className="primary-button w-full disabled:opacity-70">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-300">New customer? <Link to="/register" className="text-amber underline">Create an account</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
