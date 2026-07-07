import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { MapPin, Clock, CheckCircle2, TrendingUp, Users, AlertCircle } from 'lucide-react';

const CATEGORY_DATA = [
  { name: 'Roads', count: 1247, color: '#FF9933' },
  { name: 'Water', count: 892, color: '#138808' },
  { name: 'Sanitation', count: 1056, color: '#0B1F3A' },
  { name: 'Electricity', count: 543, color: '#7C3AED' },
  { name: 'Sewage', count: 438, color: '#2563EB' },
  { name: 'Other', count: 271, color: '#6B7280' },
];

const MONTHLY_DATA = [
  { month: 'Jan', filed: 320, resolved: 290 },
  { month: 'Feb', filed: 415, resolved: 380 },
  { month: 'Mar', filed: 380, resolved: 350 },
  { month: 'Apr', filed: 520, resolved: 470 },
  { month: 'May', filed: 620, resolved: 570 },
  { month: 'Jun', filed: 720, resolved: 680 },
  { month: 'Jul', filed: 590, resolved: 540 },
];

const WARD_DATA = [
  { ward: 'Ward 12', count: 245, avgDays: 2.8 },
  { ward: 'Ward 7', count: 198, avgDays: 3.2 },
  { ward: 'Ward 24', count: 312, avgDays: 4.1 },
  { ward: 'Ward 3', count: 167, avgDays: 2.1 },
  { ward: 'Ward 18', count: 289, avgDays: 3.7 },
];

const DEPT_RESOLUTION = [
  { dept: 'PWD', sla: 87, color: '#FF9933' },
  { dept: 'Water Dept', sla: 92, color: '#138808' },
  { dept: 'Muni Corp', sla: 78, color: '#0B1F3A' },
  { dept: 'Electricity', sla: 95, color: '#7C3AED' },
];

const RECENT_COMPLAINTS = [
  { id: 'SB-K9P2', title: 'Pothole on Ring Road', ward: 'Ward 12', status: 'Resolved', category: 'Roads' },
  { id: 'SB-Q7R1', title: 'Water pipeline leakage', ward: 'Ward 7', status: 'In Progress', category: 'Water' },
  { id: 'SB-M4T8', title: 'Street light not working', ward: 'Ward 3', status: 'Acknowledged', category: 'Electricity' },
  { id: 'SB-B2W5', title: 'Garbage overflow near market', ward: 'Ward 24', status: 'Filed', category: 'Sanitation' },
  { id: 'SB-L6N3', title: 'Open drain causing flood risk', ward: 'Ward 18', status: 'Assigned', category: 'Sewage' },
];

const STATUS_COLORS: Record<string, string> = {
  'Filed': '#6B7280',
  'Acknowledged': '#D97706',
  'Assigned': '#2563EB',
  'In Progress': '#7C3AED',
  'Resolved': '#059669',
};

const STAT_CARDS = [
  { icon: AlertCircle, label: 'Total Complaints', value: '4,447', sub: '+12% this month', color: '#FF9933' },
  { icon: CheckCircle2, label: 'Resolved', value: '3,956', sub: '89% resolution rate', color: '#138808' },
  { icon: Clock, label: 'Avg Resolution', value: '3.2 days', sub: 'Down from 4.1 days', color: '#0B1F3A' },
  { icon: Users, label: 'Active Citizens', value: '12,841', sub: 'Across 412 wards', color: '#7C3AED' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-xs">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PublicDashboard: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Header */}
      <div className="bg-[#0B1F3A] border-b-4 border-[#FF9933] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9933] to-orange-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">SB</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Smart Bharat</h1>
              <p className="text-[#FF9933] text-sm font-semibold">Public Accountability Dashboard</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Real-time civic data · Transparent governance · Powered by AI
          </p>
          <div className="flex gap-3 mt-4">
            <span className="bg-[#138808] bg-opacity-20 text-[#4ade80] text-xs font-bold px-3 py-1 rounded-full border border-[#138808] border-opacity-30">
              🟢 Live Data
            </span>
            <span className="bg-white bg-opacity-10 text-gray-300 text-xs font-bold px-3 py-1 rounded-full border border-white border-opacity-10">
              Last updated: Today 12:30 PM
            </span>
            <a href="/dashboard" className="bg-[#FF9933] text-white text-xs font-bold px-3 py-1 rounded-full hover:opacity-90 transition">
              Citizen Login →
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ icon: Icon, label, value, sub, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
              <p className="text-xs font-semibold mt-1" style={{ color }}>{sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-800 mb-1">Monthly Complaints Trend</h3>
            <p className="text-xs text-gray-400 mb-5">Filed vs Resolved by month</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY_DATA}>
                <defs>
                  <linearGradient id="colorFiled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF9933" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FF9933" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#138808" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#138808" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="filed" name="Filed" stroke="#FF9933" fill="url(#colorFiled)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#138808" fill="url(#colorResolved)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-800 mb-1">Issues by Category</h3>
            <p className="text-xs text-gray-400 mb-5">Distribution across civic departments</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="count"
                  nameKey="name"
                  paddingAngle={3}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {CATEGORY_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => [v, 'Complaints']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ward Heatmap as Bar */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-800 mb-1">Top Wards by Complaints</h3>
            <p className="text-xs text-gray-400 mb-5">High-density civic issue zones</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={WARD_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="ward" tick={{ fontSize: 11 }} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Complaints" radius={[0, 6, 6, 0]}>
                  {WARD_DATA.map((_, i) => (
                    <Cell key={i} fill={`hsl(${220 + i * 15}, 65%, ${45 + i * 5}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department SLA */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-800 mb-1">Department SLA Performance</h3>
            <p className="text-xs text-gray-400 mb-5">% complaints resolved within deadline</p>
            <div className="space-y-4">
              {DEPT_RESOLUTION.map(({ dept, sla, color }) => (
                <div key={dept}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-gray-700">{dept}</span>
                    <span className="font-black" style={{ color }}>{sla}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sla}%` }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="h-3 rounded-full"
                      style={{ background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 mb-5">Recent Complaints Feed</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Ticket</th>
                  <th className="pb-3 pr-4">Issue</th>
                  <th className="pb-3 pr-4">Ward</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RECENT_COMPLAINTS.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4 font-mono text-xs text-gray-400">#{c.id}</td>
                    <td className="py-3 pr-4 font-semibold text-gray-800">{c.title}</td>
                    <td className="py-3 pr-4 text-gray-500 text-xs">{c.ward}</td>
                    <td className="py-3 pr-4 text-gray-500 text-xs">{c.category}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold"
                        style={{ background: STATUS_COLORS[c.status] + '20', color: STATUS_COLORS[c.status] }}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 mb-1">Complaint Heatmap</h3>
          <p className="text-xs text-gray-400 mb-4">Geographic distribution of civic issues across the city</p>
          <div className="w-full h-64 bg-gradient-to-br from-[#0B1F3A] to-[#1a3a6e] rounded-2xl flex items-center justify-center relative overflow-hidden">
            {/* Simulated heatmap dots */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
                transition={{ delay: i * 0.3, duration: 2 + i * 0.2, repeat: Infinity }}
                className="absolute rounded-full"
                style={{
                  left: `${10 + (i * 17) % 80}%`,
                  top: `${15 + (i * 23) % 65}%`,
                  width: `${20 + (i % 4) * 15}px`,
                  height: `${20 + (i % 4) * 15}px`,
                  background: i % 3 === 0 ? 'rgba(255,153,51,0.6)' : i % 3 === 1 ? 'rgba(19,136,8,0.5)' : 'rgba(255,255,255,0.25)',
                  filter: 'blur(6px)',
                }}
              />
            ))}
            <div className="relative z-10 text-center">
              <MapPin className="w-8 h-8 text-[#FF9933] mx-auto mb-2" />
              <p className="text-white font-bold text-sm">Google Maps Integration</p>
              <p className="text-gray-400 text-xs mt-1">Add VITE_MAPS_API_KEY to enable live heatmap</p>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 pb-4">
          Smart Bharat · Public Accountability Dashboard · Data updated every 15 minutes
          <br />Powered by Gemini AI · Firebase · Google Cloud
        </div>
      </div>
    </div>
  );
};
