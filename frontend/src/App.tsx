import React, { useState, useEffect, Suspense, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Toaster } from 'sonner';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Login } from './pages/Login';
import { LayoutDashboard, MapPin, ListChecks, BarChart3, LogOut, Loader2, Globe, ChevronDown, User, Settings, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AiChatWidget } from './components/AiChatWidget';

// Lazy loaded routes for Code Splitting (Efficiency)
const DashboardHome = React.lazy(() => import('./pages/DashboardHome').then(m => ({ default: m.DashboardHome })));
const ReportIssuePage = React.lazy(() => import('./pages/ReportIssuePage').then(m => ({ default: m.ReportIssuePage })));
const MyComplaintsPage = React.lazy(() => import('./pages/MyComplaintsPage').then(m => ({ default: m.MyComplaintsPage })));
const ComplaintDetailPage = React.lazy(() => import('./pages/ComplaintDetailPage').then(m => ({ default: m.ComplaintDetailPage })));
const YojanaPortal = React.lazy(() => import('./pages/YojanaPortal').then(m => ({ default: m.YojanaPortal })));
const PublicDashboard = React.lazy(() => import('./pages/PublicDashboard').then(m => ({ default: m.PublicDashboard })));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  languagePref: string;
  photoURL: string | null;
  idToken: string;
}

// Map route paths to translation keys
const NAV_LINKS = [
  { path: '/dashboard', labelKey: 'home', icon: LayoutDashboard },
  { path: '/report', labelKey: 'reportIssue', icon: MapPin },
  { path: '/my-complaints', labelKey: 'myComplaints', icon: ListChecks },
  { path: '/schemes', labelKey: 'schemes', icon: Globe },
  { path: '/public-dashboard', labelKey: 'publicDashboard', icon: BarChart3 },
];

const ProtectedRoute = ({ user, children }: { user: AppUser | null; children: React.ReactNode }) => {
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ── Profile Dropdown Component ────────────────────────────────────────────────
const ProfileDropdown: React.FC<{ user: AppUser; onLogout: () => void }> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-white/10 p-1.5 rounded-xl transition-all"
      >
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.name} 
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full border-2 border-[#FF9933] object-cover" 
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center">
            <span className="text-white font-bold text-xs">{user.name?.[0]?.toUpperCase()}</span>
          </div>
        )}
        <span className="text-sm font-semibold text-white hidden lg:block">{user.name?.split(' ')[0]}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 text-gray-800"
          >
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            
            <div className="p-2">
              <Link to="/profile" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                <User className="w-4 h-4 text-gray-500" />
                {t('profile' as any)}
              </Link>
              <Link to="/settings" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                <Settings className="w-4 h-4 text-gray-500" />
                {t('settings' as any)}
              </Link>
            </div>
            
            <div className="p-2 border-t border-gray-100">
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('logout' as any)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Language Switcher ────────────────────────────────────────────────────────
const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-1.5 rounded-xl transition-all text-gray-300 hover:text-white"
      >
        <Languages className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase">{language}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 p-2"
          >
            <button 
              onClick={() => { setLanguage('en'); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-xl transition-colors ${language === 'en' ? 'bg-[#FF9933]/10 text-[#FF9933]' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              English
            </button>
            <button 
              onClick={() => { setLanguage('hi'); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-xl transition-colors ${language === 'hi' ? 'bg-[#FF9933]/10 text-[#FF9933]' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              हिंदी (Hindi)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main App Shell (authenticated layout) ────────────────────────────────────
const AppShell: React.FC<{ user: AppUser; onLogout: () => void; children: React.ReactNode }> = ({
  user, onLogout, children
}) => {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#0B1F3A] text-white border-b-4 border-[#FF9933] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img src="/nivaran-logo.svg" alt="Nivaran Logo" className="w-10 h-10 bg-white rounded-full p-0.5 shadow-md" />
            <div className="hidden sm:block">
              <p className="font-black tracking-wider text-[#FF9933] text-base leading-none">NIVARAN</p>
              <p className="text-[10px] text-gray-400">{t('civicCompanion' as any)}</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ path, labelKey, icon: Icon }) => (
              <a
                key={path}
                href={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === path
                    ? 'bg-[#FF9933] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t(labelKey as any)}</span>
              </a>
            ))}
          </nav>

          {/* Actions: Language & User */}
          <div className="flex items-center gap-1 sm:gap-3">
            <LanguageSwitcher />
            <div className="w-px h-6 bg-white/10 hidden sm:block mx-1" />
            <ProfileDropdown user={user} onLogout={onLogout} />
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex border-t border-white/10 overflow-x-auto">
          {NAV_LINKS.map(({ path, labelKey, icon: Icon }) => (
            <a
              key={path}
              href={path}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 text-[10px] font-semibold transition-all whitespace-nowrap ${
                location.pathname === path
                  ? 'text-[#FF9933] bg-white/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t(labelKey as any)}
            </a>
          ))}
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-grow bg-[#F4F6FB] relative">
        {/* Subtle Indian motif background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0B1F3A 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 h-full flex flex-col">
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF9933]" />
            </div>
          }>
            {children}
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B1F3A] border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © 2026 Ministry of Electronics & IT, Government of India · Nivaran Platform
      </footer>

      {/* Floating AI Widget */}
      <AiChatWidget />
    </div>
  );
};

// ── Root App Content ─────────────────────────────────────────────────────────
const AppContent: React.FC = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    // Check cached user from login
    const cached = localStorage.getItem('sb_user');
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {}
    }

    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const cached = localStorage.getItem('sb_user');
        if (!cached) {
          const idToken = await firebaseUser.getIdToken();
          const mappedUser: AppUser = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Citizen',
            email: firebaseUser.email || '',
            phone: firebaseUser.phoneNumber || '',
            role: 'CITIZEN',
            languagePref: 'en',
            photoURL: firebaseUser.photoURL,
            idToken,
          };
          setUser(mappedUser);
          localStorage.setItem('sb_user', JSON.stringify(mappedUser));
        }
      } else {
        localStorage.removeItem('sb_user');
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (newUser: AppUser) => {
    localStorage.setItem('sb_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch {}
    localStorage.removeItem('sb_user');
    setUser(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img src="/nivaran-logo.svg" alt="Nivaran Logo" className="w-16 h-16 bg-white rounded-full p-1 shadow-xl animate-pulse" />
          <Loader2 className="w-6 h-6 text-[#FF9933] animate-spin" />
          <p className="text-gray-400 text-sm">{t('loading' as any)}</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public */}
        <Route path="/public-dashboard" element={
          <Suspense fallback={<div />}>
            <PublicDashboard />
          </Suspense>
        } />

        {/* Auth gate */}
        {!user ? (
          <>
            <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={
              <ProtectedRoute user={user}>
                <AppShell user={user} onLogout={handleLogout}><DashboardHome user={user} /></AppShell>
              </ProtectedRoute>
            } />
            <Route path="/report" element={
              <ProtectedRoute user={user}>
                <AppShell user={user} onLogout={handleLogout}><ReportIssuePage user={user} /></AppShell>
              </ProtectedRoute>
            } />
            <Route path="/my-complaints" element={
              <ProtectedRoute user={user}>
                <AppShell user={user} onLogout={handleLogout}><MyComplaintsPage user={user} /></AppShell>
              </ProtectedRoute>
            } />
            <Route path="/schemes" element={
              <ProtectedRoute user={user}>
                <AppShell user={user} onLogout={handleLogout}><YojanaPortal user={user} /></AppShell>
              </ProtectedRoute>
            } />
            <Route path="/complaint/:id" element={
              <ProtectedRoute user={user}>
                <AppShell user={user} onLogout={handleLogout}><ComplaintDetailPage user={user} /></AppShell>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute user={user}>
                <AppShell user={user} onLogout={handleLogout}><ProfilePage user={user} /></AppShell>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute user={user}>
                <AppShell user={user} onLogout={handleLogout}><SettingsPage user={user} /></AppShell>
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

// ── Root App wrapper with Providers ──────────────────────────────────────────
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
