import { ReactNode, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, MapPinned, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api, getApiErrorMessage } from '../../services/api';
import logo from '../../assets/images/ct-services-logo.jpg';

type PublicContact = {
  phoneNumbers: string[];
  email: string;
  website: string;
  whatsappNumber: string;
};
type PublicSettings = { businessName: string; location: string; contact: PublicContact | null };

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Services', to: '/services' },
  { label: 'Our Fleet', to: '/fleet' },
  { label: 'Corporate Rates', to: '/corporate' },
  { label: 'Routes', to: '/routes' },
  { label: 'Contact', to: '/contact' },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [settingsError, setSettingsError] = useState('');
  const { user, authError, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => setSettings(data.data ?? null))
      .catch((error) => setSettingsError(getApiErrorMessage(error, 'Contact settings are unavailable.')));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      setNotice('You have been logged out.');
      navigate('/');
    } catch (error) {
      setNotice('Unable to log out. Please try again.');
    }
  };

  const links = (onClick?: () => void) => navItems.map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      onClick={onClick}
      className={({ isActive }) => `transition hover:text-amber ${isActive ? 'text-amber' : 'text-slate-200'}`}
    >
      {item.label}
    </NavLink>
  ));

  return (
    <div className="min-h-screen bg-midnight text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-midnight/80 backdrop-blur-xl">
        <div className="section-shell flex items-center justify-between py-4">
          <Link to="/" className="flex max-w-[230px] items-center gap-2 leading-tight">
            <img src={logo} alt="CT Services emblem" className="h-11 w-11 shrink-0 rounded-full object-contain" />
            <span>
              <span className="block font-display text-xs font-bold sm:text-sm">{settings?.businessName ?? 'Chandan Transportation'}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber">CT Services</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-4 text-sm text-slate-200 lg:flex xl:gap-6">
            {links()}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/account'} className="text-sm text-slate-200 hover:text-amber">
                  {user.role === 'admin' ? 'Admin Dashboard' : 'My account'}
                </Link>
                <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-amber">
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-slate-200 hover:text-amber">Login</Link>
                <Link to="/register" className="text-sm text-slate-200 hover:text-amber">Register</Link>
              </>
            )}
            <Link to="/book-taxi" className="primary-button">Book a Taxi</Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link to="/book-taxi" className="primary-button px-3 py-2 text-xs">Book</Link>
            <button type="button" className="rounded-lg border border-white/10 p-2" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="section-shell flex flex-col gap-4 border-t border-white/10 py-5 text-sm lg:hidden">
            {links(() => setMenuOpen(false))}
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/account'} onClick={() => setMenuOpen(false)} className="text-slate-200">
                  {user.role === 'admin' ? 'Admin Dashboard' : 'My account'}
                </Link>
                <button type="button" onClick={handleLogout} className="flex items-center gap-2 self-start text-slate-200"><LogOut size={15} /> Logout</button>
              </>
            ) : (
              <div className="flex gap-5">
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
              </div>
            )}
          </nav>
        )}
      </header>

      <main>{children}</main>

      {(authError || notice) && (
        <div role="status" className={`section-shell py-3 text-sm ${notice.includes('Unable') || authError ? 'text-red-300' : 'text-emerald-300'}`}>
          {notice || authError}
          {notice && <button type="button" onClick={() => setNotice('')} className="ml-3 underline">Dismiss</button>}
        </div>
      )}

      <footer className="border-t border-white/10 bg-charcoal">
        <div className="section-shell grid gap-8 py-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="CT Services emblem" className="h-14 w-14 rounded-full object-contain" />
              <h3 className="font-display text-xl font-bold">{settings?.businessName ?? 'Chandan Transportation Services'}</h3>
            </div>
            <p className="mt-4 text-sm text-slate-300">Transportation services from Jamshedpur, Jharkhand. Trips and vehicle availability are confirmed for each booking.</p>
          </div>
          <div>
            <h4 className="mb-4 text-sm uppercase tracking-[0.2em] text-amber">Company</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/fleet">Our Fleet</Link></li>
              <li><Link to="/corporate">Corporate Rates</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm uppercase tracking-[0.2em] text-amber">Account</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Customer registration</Link></li>
              <li><Link to="/book-taxi">Book a Taxi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm uppercase tracking-[0.2em] text-amber">Contact</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <p className="flex items-center gap-2"><MapPinned size={14} className="text-amber" /> {settings?.location ?? 'Jamshedpur, Jharkhand, India'}</p>
              {settings?.contact?.phoneNumbers.map((phone) => <a key={phone} className="block hover:text-amber" href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>)}
              {settings?.contact?.email && <a className="block hover:text-amber" href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>}
              {settings?.contact?.website && <a className="block hover:text-amber" href={settings.contact.website} target="_blank" rel="noreferrer">Website</a>}
              {settings?.contact?.whatsappNumber && <a className="inline-flex items-center gap-2 text-amber hover:underline" href={`https://wa.me/${settings.contact.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp inquiry</a>}
              {!settings?.contact && !settingsError && <p>Use the contact form to send an inquiry.</p>}
              {settingsError && <p role="status" className="text-xs text-red-300">{settingsError}</p>}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Chandan Transportation Services. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
