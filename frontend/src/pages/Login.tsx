import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { toast } from 'sonner';
import { Shield, Globe, MapPin, MessageSquare, BarChart3, Loader2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

const FEATURES = [
  { icon: MessageSquare, label: 'AI Companion', desc: 'Multilingual voice-first assistance' },
  { icon: MapPin, label: 'File Complaints', desc: 'Geo-tagged civic issue reporting' },
  { icon: BarChart3, label: 'Track & Escalate', desc: 'Real-time status and SLA tracking' },
  { icon: Globe, label: '8 Languages', desc: 'Hindi, Tamil, Telugu & more' },
];

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Register/login with our backend
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
        })
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Welcome, ${user.displayName?.split(' ')[0]}!`, {
          description: 'Logged in via Google'
        });
        onLoginSuccess({
          ...data.user,
          idToken,
          photoURL: user.photoURL,
        });
      } else {
        // Firebase auth succeeded but backend registration failed — still allow login
        // using Firebase user data directly (graceful degradation)
        toast.success(`Welcome, ${user.displayName?.split(' ')[0]}!`);
        onLoginSuccess({
          id: user.uid,
          name: user.displayName || 'Citizen',
          email: user.email,
          phone: '',
          role: 'CITIZEN',
          languagePref: 'en',
          photoURL: user.photoURL,
          idToken,
        });
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        toast.info('Sign-in cancelled');
      } else {
        toast.error('Sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center overflow-hidden relative">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,153,51,0.15) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(19,136,8,0.12) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 px-6 max-w-6xl mx-auto py-16">
        {/* Left — Hero */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-white text-center lg:text-left"
        >
          <div className="flex items-center gap-3 justify-center lg:justify-start mb-8">
              <img src="/nivaran-logo.svg" alt="Nivaran Logo" className="w-16 h-16 bg-white rounded-full shadow-lg" />
            <div>
              <h1 className="text-2xl font-black text-[#FF9933] tracking-wider leading-none">NIVARAN</h1>
              <p className="text-xs text-gray-400 tracking-widest uppercase">AI Civic Companion</p>
            </div>
          </div>

          <h2 className="text-5xl lg:text-6xl font-black leading-[1.05] mb-6">
            Your Voice.<br />
            <span className="text-[#FF9933]">Your City.</span><br />
            <span className="text-[#138808]">Your Rights.</span>
          </h2>

          <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto lg:mx-0">
            India's first AI-powered civic companion. File complaints, access government schemes, and hold officials accountable — in your language.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-3 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-4"
              >
                <div className="w-9 h-9 bg-[#FF9933] bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#FF9933]" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — Login Card */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-3xl p-8 shadow-2xl">
            {/* Tricolor accent line */}
            <div className="flex h-1.5 rounded-full overflow-hidden mb-8">
              <div className="flex-1 bg-[#FF9933]" />
              <div className="flex-1 bg-white bg-opacity-30" />
              <div className="flex-1 bg-[#138808]" />
            </div>

            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#FF9933] to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white text-2xl font-black">Citizen Login</h3>
              <p className="text-gray-400 text-sm mt-2">Access your Nivaran dashboard</p>
            </div>

            {/* Google Sign In */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={loading}
              id="google-signin-btn"
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-bold py-4 px-6 rounded-2xl hover:bg-gray-50 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-base"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {loading ? 'Signing in...' : 'Continue with Google'}
            </motion.button>

            <p className="text-center text-gray-600 text-xs mt-6">
              By signing in, you agree to Nivaran's Terms of Service.<br/>
              Powered by Firebase Authentication & Google Cloud.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
