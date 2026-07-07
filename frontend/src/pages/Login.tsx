import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Shield, ArrowRight, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();

      if (data.success) {
        setStep('otp');
        // Custom Ashoka-colored mock SMS gateway simulation
        toast.success(`OTP Sent!`, {
          description: `[MOCK SMS] Your OTP is: ${data.mockOtp}`,
          duration: 10000,
        });
      } else {
        toast.error(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Login Successful!', {
          description: `Welcome back, ${data.user.name}`,
        });
        onLoginSuccess(data.token, data.user);
      } else {
        toast.error(data.error || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy to-navy-light flex flex-col justify-between text-white font-sans relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-saffron via-white to-green"></div>
      
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-saffron opacity-5 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green opacity-5 blur-3xl rounded-full"></div>

      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-saffron flex items-center justify-center bg-navy bg-opacity-80">
            <span className="text-saffron font-bold text-lg">SB</span>
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider text-saffron">SMART BHARAT</h1>
            <p className="text-xs text-gray-400">AI-Powered Civic Engagement</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-navy-light rounded-full border border-gray-700 text-xs">
          <span className="w-2 h-2 rounded-full bg-green animate-pulse"></span>
          <span>Digital India Stack</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 z-10">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-navy bg-opacity-70 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            
            {/* Top Card Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-navy-light border border-gray-700 rounded-2xl flex items-center justify-center shadow-inner">
                <Shield className="w-8 h-8 text-saffron" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Citizen Verification</h2>
              <p className="text-gray-400 text-sm mt-1">
                {step === 'phone' 
                  ? 'Enter your mobile number to receive a secure OTP' 
                  : 'Enter the 6-digit OTP code sent to your phone'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === 'phone' ? (
                <motion.form
                  key="phone-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSendOtp}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <span className="text-sm font-semibold pr-2 border-r border-gray-700">+91</span>
                        <Phone className="w-4 h-4 ml-2" />
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-navy-dark border border-gray-800 rounded-2xl py-4 pl-24 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all text-lg font-mono tracking-widest"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phone.length < 10}
                    className="w-full bg-gradient-to-r from-saffron to-orange-500 hover:from-saffron hover:to-saffron text-navy font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-saffron/10 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Get Verification Code</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="otp-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => setStep('phone')}
                        className="text-xs text-saffron hover:underline focus:outline-none"
                      >
                        Change number
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="••••••"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-navy-dark border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-green focus:ring-1 focus:ring-green transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-gradient-to-r from-green to-emerald-600 hover:from-green hover:to-green text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green/10 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Verify & Log In</span>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      Didn't receive code? Resend OTP
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Secure Badge */}
          <div className="mt-8 flex justify-center items-center gap-2 text-xs text-gray-400">
            <Shield className="w-4 h-4 text-green" />
            <span>Secured with standard 256-bit encryption</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-6 text-center text-xs text-gray-500 z-10 border-t border-gray-900 border-opacity-40">
        <p>© 2026 Ministry of Electronics & IT, Government of India. Mock Project.</p>
      </footer>
    </div>
  );
};
