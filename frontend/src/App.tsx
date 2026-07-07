import React, { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Toaster } from 'sonner';
import { ShieldAlert, LogOut, User as UserIcon, LayoutDashboard, Globe, AlertCircle } from 'lucide-react';
import { AiChatWidget } from './components/AiChatWidget';

interface User {
  id: string;
  phone: string;
  name: string;
  role: string;
  languagePref: string;
}

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const cachedToken = localStorage.getItem('sb_auth_token');
    const cachedUser = localStorage.getItem('sb_auth_user');
    if (cachedToken && cachedUser) {
      setToken(cachedToken);
      setUser(JSON.parse(cachedUser));
    }
  }, []);

  const handleLoginSuccess = (newToken: string, newUser: any) => {
    localStorage.setItem('sb_auth_token', newToken);
    localStorage.setItem('sb_auth_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('sb_auth_token');
    localStorage.removeItem('sb_auth_user');
    setToken(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Toaster position="top-right" richColors />
      
      {!token || !user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="flex-grow flex flex-col">
          {/* Dashboard Header */}
          <header className="bg-[#0B1F3A] text-white border-b-4 border-[#FF9933]">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-saffron flex items-center justify-center bg-navy bg-opacity-80">
                  <span className="text-saffron font-bold text-lg">SB</span>
                </div>
                <div>
                  <h1 className="font-extrabold tracking-wider text-saffron text-lg">SMART BHARAT</h1>
                  <p className="text-xs text-gray-300">AI-Powered Civic Engagement</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-navy-light rounded-full border border-gray-700 text-xs">
                  <Globe className="w-4 h-4 text-saffron" />
                  <span>Language: {user.languagePref.toUpperCase()}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center gap-2 text-sm transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-grow container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Alert Notification */}
              <div className="bg-amber-50 border-l-4 border-[#FF9933] p-4 rounded-r-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#FF9933] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 text-sm">System Status: Demo/Hackathon Mode</h4>
                  <p className="text-xs text-amber-900 mt-1">
                    Your OTP authentication is currently operating in mock mode using SQLite. Subsequent phases (AI Assistant, Geolocation Issue Reporting, Track Complaint, and Dashboard) will be initialized sequentially.
                  </p>
                </div>
              </div>

              {/* Welcome Panel */}
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">Namaste, {user.name}!</h2>
                  <p className="text-gray-500 text-sm mt-1">Welcome to your Smart Bharat citizen dashboard.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-green bg-opacity-10 text-green-800 rounded-2xl border border-green border-opacity-25 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Verified Citizen Account</span>
                </div>
              </div>

              {/* Citizen Details Card */}
              <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-[#0B1F3A]" />
                  <h3 className="font-bold text-gray-800">Your Identity & Profile</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <UserIcon className="w-8 h-8 text-[#0B1F3A] bg-gray-200 p-1.5 rounded-full" />
                    <div>
                      <span className="text-xs text-gray-400 block font-semibold uppercase">Name</span>
                      <span className="font-bold text-gray-800">{user.name}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <UserIcon className="w-8 h-8 text-[#0B1F3A] bg-gray-200 p-1.5 rounded-full" />
                    <div>
                      <span className="text-xs text-gray-400 block font-semibold uppercase">Phone Number</span>
                      <span className="font-bold text-gray-800 font-mono">+91 {user.phone}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <UserIcon className="w-8 h-8 text-[#0B1F3A] bg-gray-200 p-1.5 rounded-full" />
                    <div>
                      <span className="text-xs text-gray-400 block font-semibold uppercase">Role</span>
                      <span className="font-bold text-[#138808]">{user.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-gray-100 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
            <p>© 2026 Ministry of Electronics & IT, Government of India. Powered by Smart Bharat.</p>
          </footer>
          
          {/* AI Companion Widget */}
          <AiChatWidget />
        </div>
      )}
    </div>
  );
};

export default App;
