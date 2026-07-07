import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, BarChart3, Shield, Zap, ArrowRight, HeartHandshake, Landmark, ChevronRight } from 'lucide-react';
import type { AppUser } from '../App';

interface Props { user: AppUser }

const QUICK_ACTIONS = [
  { icon: MapPin, label: 'Report Issue', desc: 'File civic complaints instantly', href: '/report', color: '#FF9933', bg: 'rgba(255,153,51,0.1)', img: 'https://images.unsplash.com/photo-1588716591825-80f2d48348d2?auto=format&fit=crop&q=80&w=400' },
  { icon: HeartHandshake, label: 'Govt Schemes', desc: 'Find benefits you are eligible for', href: '/schemes', color: '#138808', bg: 'rgba(19,136,8,0.1)', img: 'https://images.unsplash.com/photo-1596414442651-6d7ab7ce6051?auto=format&fit=crop&q=80&w=400' },
  { icon: BarChart3, label: 'City Dashboard', desc: 'Track local resolution metrics', href: '/public-dashboard', color: '#0B1F3A', bg: 'rgba(11,31,58,0.08)', img: 'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&q=80&w=400' },
];

const STATS = [
  { label: 'Citizens Reached', value: '1.2Cr+', color: '#FF9933', trend: '+12% this month' },
  { label: 'Issues Resolved', value: '89%', color: '#138808', trend: 'Fastest in 2 years' },
  { label: 'Schemes Delivered', value: '45L+', color: '#0B1F3A', trend: 'Across 412 districts' },
];

export const DashboardHome: React.FC<Props> = ({ user }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Suprabhat' : hour < 17 ? 'Namaskar' : 'Shubh Sandhya';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-[#0B1F3A] min-h-[360px] flex items-center"
      >
        <img 
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1600" 
          alt="India Heritage" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/90 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        
        <div className="relative z-10 p-8 md:p-12 w-full max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6">
            <Landmark className="w-4 h-4 text-[#FF9933]" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">Digital India Initiative</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            <span className="text-[#FF9933]">{greeting},</span><br />
            {user.name}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl font-light mb-8">
            Empowering every citizen. Access government schemes, report local issues, and track your city's progress all in one secure platform.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <a href="/report" className="bg-[#FF9933] hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-orange-500/30">
              Take Action Now <ArrowRight className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2 bg-[#138808]/20 border border-[#138808]/40 px-6 py-4 rounded-2xl backdrop-blur-sm">
              <Shield className="w-5 h-5 text-[#138808]" />
              <span className="text-white font-semibold">Verified Account</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Services Grid with Images */}
      <div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Essential Services</h2>
            <p className="text-gray-500 font-medium mt-1">What would you like to do today?</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QUICK_ACTIONS.map(({ icon: Icon, label, desc, href, color, img }, i) => (
            <motion.a
              key={label}
              href={href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all cursor-pointer block h-full"
            >
              <div className="h-40 overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-colors z-10" />
                <img src={img} alt={label} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#FF9933] transition-colors flex items-center justify-between">
                  {label}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF9933] transform group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-gray-500 text-sm font-medium">{desc}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Impact Stats */}
      <div>
        <h2 className="text-3xl font-black text-gray-900 mb-6">National Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map(({ label, value, color, trend }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-[100px]" style={{ background: color }} />
              <p className="text-5xl font-black mb-2 tracking-tight" style={{ color }}>{value}</p>
              <p className="text-gray-900 text-lg font-bold">{label}</p>
              <p className="text-gray-500 text-sm font-medium mt-1">{trend}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Companion Promo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl p-8 md:p-10 border border-orange-100 flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#FF9933] to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#0B1F3A] mb-2">AI Assistant Available 24/7</h3>
            <p className="text-gray-600 font-medium">Have questions about PM-KISAN, Ayushman Bharat, or filing a complaint? Chat instantly in your local language.</p>
          </div>
        </div>
        <button className="w-full md:w-auto bg-[#0B1F3A] text-white font-bold py-4 px-8 rounded-2xl hover:bg-gray-800 transition-colors flex-shrink-0 shadow-lg">
          Start Conversation
        </button>
      </motion.div>
    </div>
  );
};
