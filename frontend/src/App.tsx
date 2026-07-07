import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Login } from './pages/Login';
import { DashboardHome } from './pages/DashboardHome';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';
import { PublicDashboard } from './pages/PublicDashboard';
import { AiChatWidget } from './components/AiChatWidget';
import { LayoutDashboard, MapPin, ListChecks, BarChart3, LogOut, Loader2 } from 'lucide-react';

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

const NAV_LINKS = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/report', label: 'Report Issue', icon: MapPin },
  { path: '/my-complaints', label: 'My Complaints', icon: ListChecks },
  { path: '/public-dashboard', label: 'Public Dashboard', icon: BarChart3 },
];

// ── Main App Shell (authenticated layout) ────────────────────────────────────
const AppShell: React.FC<{ user: AppUser; onLogout: () => void; children: React.ReactNode }> = ({
  user, onLogout, children
}) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#0B1F3A] text-white border-b-4 border-[#FF9933] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF9933] to-orange-600 flex items-center justify-center shadow">
              <span className="text-white font-black text-sm">SB</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-black tracking-wider text-[#FF9933] text-base leading-none">SMART BHARAT</p>
              <p className="text-[10px] text-gray-400">AI Civic Companion</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ path, label, icon: Icon }) => (
              <a
                key={path}
                href={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === path
                    ? 'bg-[#FF9933] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </a>
            ))}
          </nav>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full border-2 border-[#FF9933]" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{user.name?.[0]?.toUpperCase()}</span>
                </div>
              )}
              <span className="text-sm font-semibold text-white hidden lg:block">{user.name?.split(' ')[0]}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-xl text-xs transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex border-t border-white border-opacity-10 overflow-x-auto">
          {NAV_LINKS.map(({ path, label, icon: Icon }) => (
            <a
              key={path}
              href={path}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 text-[10px] font-semibold transition-all whitespace-nowrap ${
                location.pathname === path
                  ? 'text-[#FF9933] bg-white bg-opacity-5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </a>
          ))}
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0B1F3A] border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © 2026 Ministry of Electronics & IT, Government of India · Smart Bharat Platform
      </footer>

      {/* Floating AI Widget */}
      <AiChatWidget />
    </div>
  );
};

// ── Root App ─────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Check cached user from demo login
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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF9933] to-orange-600 flex items-center justify-center">
            <span className="text-white font-black text-2xl">SB</span>
          </div>
          <Loader2 className="w-6 h-6 text-[#FF9933] animate-spin" />
          <p className="text-gray-400 text-sm">Loading Smart Bharat...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public */}
        <Route path="/public-dashboard" element={<PublicDashboard />} />

        {/* Auth gate */}
        {!user ? (
          <>
            <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <AppShell user={user} onLogout={handleLogout}>
                  <DashboardHome user={user} />
                </AppShell>
              }
            />
            <Route
              path="/report"
              element={
                <AppShell user={user} onLogout={handleLogout}>
                  <ReportIssuePage user={user} />
                </AppShell>
              }
            />
            <Route
              path="/my-complaints"
              element={
                <AppShell user={user} onLogout={handleLogout}>
                  <MyComplaintsPage user={user} />
                </AppShell>
              }
            />
            <Route
              path="/complaint/:id"
              element={
                <AppShell user={user} onLogout={handleLogout}>
                  <ComplaintDetailPage user={user} />
                </AppShell>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
