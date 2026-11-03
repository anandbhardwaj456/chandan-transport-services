import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { api, isApiError } from '../services/api';

export type AuthUser = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'booking_manager' | 'driver';
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  authError: string;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      const authenticatedUser = (data.data?.user ?? data.data) as AuthUser;
      setUser(authenticatedUser);
      setAuthError('');
      return authenticatedUser;
    } catch (error) {
      setUser(null);
      if (isApiError(error) && error.response?.status === 401) {
        setAuthError('');
        return null;
      }
      setAuthError('Could not verify your session. Some account features may be unavailable.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser().catch(() => undefined);
  }, []);

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    setAuthError('');
  };

  const value = useMemo(() => ({ user, loading, authError, refreshUser, logout }), [user, loading, authError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
