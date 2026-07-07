import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ListChecks, BarChart3, Shield, Zap, Bell, ArrowRight } from 'lucide-react';
import type { AppUser } from '../App';

interface Props { user: AppUser }

const QUICK_ACTIONS = [
  { icon: MapPin, label: 'Report New Issue', desc: 'File a civic complaint', href: '/report', color: '#FF9933', bg: 'rgba(255,153,51,0.1)' },
  { icon: ListChecks, label: 'My Complaints', desc: 'Track your filed issues', href: '/my-complaints', color: '#138808', bg: 'rgba(19,136,8,0.1)' },
  { icon: BarChart3, label: 'Public Dashboard', desc: 'City-wide issue metrics', href: '/public-dashboard', color: '#0B1F3A', bg: 'rgba(11,31,58,0.08)' },
];

const STATS = [
  { label: 'Issues Filed', value: '2.4M+', color: '#FF9933' },
  { label: 'Resolved This Month', value: '89%', color: '#138808' },
  { label: 'Avg Resolution', value: '3.2 days', color: '#0B1F3A' },
  { label: 'Active Cities', value: '412', color: '#4B5563' },
];

export const DashboardHome: React.FC<Props> = ({ user }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Suprabhat' : hour < 17 ? 'Namaskar' : 'Shubh Sandhya';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-[#0B1F3A] to-[#1a3a6e] rounded-3xl p-8 text-white overflow-hidden shadow-xl"
      >
        {/* Decorative tricolor stripe */}
        <div className="absolute top-0 left-0 right-0 flex h-1.5">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white bg-opacity-40" />
          <div className="flex-1 bg-[#138808]" />
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-32 h-32 bg-[#FF9933] bg-opacity-10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-[#FF9933] font-semibold text-sm mb-1">{greeting}! 🙏</p>
            <h2 className="text-3xl font-black">{user.name}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {user.role === 'CITIZEN' ? 'Verified Citizen Account' : user.role}
              {user.email && ` · ${user.email}`}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#138808] bg-opacity-20 border border-[#138808] border-opacity-30 px-4 py-2 rounded-2xl">
            <Shield className="w-4 h-4 text-[#138808]" />
            <span className="text-[#138808] font-bold text-sm">Verified Citizen</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(({ label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center"
          >
            <p className="text-2xl font-black" style={{ color }}>{value}</p>
            <p className="text-gray-500 text-xs mt-1 font-medium">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-gray-700 font-bold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map(({ icon: Icon, label, desc, href, color, bg }, i) => (
            <motion.a
              key={label}
              href={href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div className="flex-grow">
                <p className="font-bold text-gray-900">{label}</p>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </motion.a>
          ))}
        </div>
      </div>

      {/* AI Companion Promo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-[#0B1F3A] to-[#1a3a6e] rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF9933] flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-black text-lg">AI Companion is Active</p>
            <p className="text-gray-400 text-sm">Ask about PM-KISAN, Ayushman Bharat, PMAY, or report an issue in your language</p>
          </div>
        </div>
        <button className="bg-[#FF9933] text-white font-bold py-3 px-6 rounded-2xl text-sm hover:opacity-90 transition-opacity flex-shrink-0">
          Chat Now →
        </button>
      </motion.div>

      {/* Notice */}
      <div className="bg-amber-50 border-l-4 border-[#FF9933] p-4 rounded-r-2xl flex items-start gap-3">
        <Bell className="w-5 h-5 text-[#FF9933] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900 text-sm">Platform Status: Demo Mode</p>
          <p className="text-amber-800 text-xs mt-1">
            Configure Firebase credentials in <code className="bg-amber-100 px-1 rounded">.env</code> to enable real Google OAuth, Firestore persistence, and Cloud Storage for media uploads.
          </p>
        </div>
      </div>
    </div>
  );
};
