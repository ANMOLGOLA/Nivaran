import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { MapPin, Clock, Loader2, ChevronRight, RefreshCw } from 'lucide-react';
import type { AppUser } from '../App';

interface Props { user: AppUser }

interface Complaint {
  id: string;
  title: string;
  category: string;
  status: 'Filed' | 'Acknowledged' | 'Assigned' | 'In Progress' | 'Resolved';
  department: string;
  address: string;
  ward: string;
  createdAt: string;
  slaDeadline: string;
  description: string;
  aiSummary?: string;
}

const STATUS_CONFIG = {
  'Filed': { color: '#6B7280', bg: '#F3F4F6', icon: '📋' },
  'Acknowledged': { color: '#D97706', bg: '#FEF3C7', icon: '👁️' },
  'Assigned': { color: '#2563EB', bg: '#DBEAFE', icon: '👷' },
  'In Progress': { color: '#7C3AED', bg: '#EDE9FE', icon: '🔧' },
  'Resolved': { color: '#059669', bg: '#D1FAE5', icon: '✅' },
};

const TIMELINE_STEPS = ['Filed', 'Acknowledged', 'Assigned', 'In Progress', 'Resolved'] as const;

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'SB-ABC123',
    title: 'Large pothole on MG Road near bus stop',
    category: 'roads',
    status: 'In Progress',
    department: 'PWD Department',
    address: 'MG Road, Connaught Place, New Delhi',
    ward: 'Ward 12, Delhi',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
    description: 'Large pothole approximately 2 feet wide causing accidents.',
    aiSummary: 'Road damage requiring immediate PWD intervention. High priority due to traffic risk.'
  },
  {
    id: 'SB-DEF456',
    title: 'Broken street light on Sector 15',
    category: 'electricity',
    status: 'Resolved',
    department: 'Electricity Board',
    address: 'Sector 15, Gurgaon',
    ward: 'Ward 7, Gurgaon',
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    description: 'Street light not working for 5 days creating safety issues.',
    aiSummary: 'Electrical infrastructure failure. Resolved within SLA.'
  },
  {
    id: 'SB-GHI789',
    title: 'Garbage not collected for 3 days',
    category: 'sanitation',
    status: 'Acknowledged',
    department: 'Municipal Corporation',
    address: 'Defence Colony, South Delhi',
    ward: 'Ward 24, Delhi',
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(),
    description: 'Waste management failure — garbage overflow on the street.',
    aiSummary: 'Municipal sanitation lapse. Escalation recommended if not resolved in 2 days.'
  },
];

export const MyComplaintsPage: React.FC<Props> = ({ user }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/complaints/my?uid=${user.id}`, {
        headers: { 'Authorization': `Bearer ${user.idToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || MOCK_COMPLAINTS);
      } else {
        setComplaints(MOCK_COMPLAINTS);
      }
    } catch {
      setComplaints(MOCK_COMPLAINTS);
    }
    setLoading(false);
  };

  useEffect(() => { loadComplaints(); }, []);

  const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

  const getDaysLeft = (sla: string) => {
    const diff = (new Date(sla).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return Math.ceil(diff);
  };

  const handleEscalate = async (complaint: Complaint) => {
    toast.loading('Generating escalation letter...', { id: 'escalate' });
    try {
      const res = await fetch(`/api/complaints/${complaint.id}/escalate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.idToken}`
        },
        body: JSON.stringify({ complaint })
      });
      const data = await res.json();
      toast.success('Escalation letter generated!', {
        id: 'escalate',
        description: data.letter ? 'Letter ready to download' : 'Ready to send to department'
      });
    } catch {
      toast.success('Escalation letter generated! (Demo)', { id: 'escalate' });
    }
  };

  const handleRate = async (_complaint: Complaint, rating: number) => {
    toast.success(`Thank you! You rated this resolution ${rating}/5 ⭐`, {
      description: 'Your feedback helps improve civic services'
    });
  };

  if (selected) {
    const statusIdx = TIMELINE_STEPS.indexOf(selected.status as any);
    const cfg = STATUS_CONFIG[selected.status];
    const daysLeft = getDaysLeft(selected.slaDeadline);
    const isOverdue = daysLeft < 0 && selected.status !== 'Resolved';

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => setSelected(null)} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-6 font-semibold">
          ← Back to My Complaints
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#0B1F3A] p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[#FF9933] text-xs font-mono font-bold mb-1">#{selected.id}</p>
                <h2 className="text-xl font-black">{selected.title}</h2>
                <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {selected.address}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold flex-shrink-0"
                style={{ background: cfg.bg, color: cfg.color }}>
                {cfg.icon} {selected.status}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Timeline */}
            <div>
              <h3 className="font-bold text-gray-800 text-sm mb-4">Status Timeline</h3>
              <div className="flex items-center">
                {TIMELINE_STEPS.map((step, i) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        i <= statusIdx ? 'bg-[#138808] text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {i < statusIdx ? '✓' : i === statusIdx ? '●' : i + 1}
                      </div>
                      <span className="text-[9px] text-gray-500 text-center hidden sm:block w-16">{step}</span>
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div className={`flex-1 h-1 mx-1 rounded ${i < statusIdx ? 'bg-[#138808]' : 'bg-gray-200'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* SLA Info */}
            <div className={`p-4 rounded-2xl border ${isOverdue ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${isOverdue ? 'text-red-600' : 'text-blue-600'}`} />
                <p className={`text-sm font-bold ${isOverdue ? 'text-red-800' : 'text-blue-800'}`}>
                  {selected.status === 'Resolved'
                    ? '✅ Resolved successfully'
                    : isOverdue
                    ? `⚠️ Overdue by ${Math.abs(daysLeft)} days — escalation recommended`
                    : `SLA Deadline: ${daysLeft} days remaining`}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Department: {selected.department}</p>
            </div>

            {/* AI Summary */}
            {selected.aiSummary && (
              <div className="bg-[#0B1F3A] bg-opacity-5 border border-[#0B1F3A] border-opacity-15 rounded-2xl p-4">
                <p className="text-xs font-bold text-[#0B1F3A] mb-2">🤖 AI Analysis</p>
                <p className="text-sm text-gray-700">{selected.aiSummary}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {isOverdue && (
                <button
                  onClick={() => handleEscalate(selected)}
                  className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded-2xl text-sm hover:opacity-90 transition"
                >
                  📜 Generate Escalation Letter
                </button>
              )}
              {selected.status === 'Resolved' && (
                <div className="flex-1 bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-sm font-bold text-green-800 mb-2">Rate this resolution:</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => handleRate(selected, n)}
                        className="w-9 h-9 rounded-xl bg-white border-2 border-green-200 hover:border-green-500 hover:bg-green-50 text-lg transition">
                        {'⭐'.slice(0, 2)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">My Complaints</h2>
          <p className="text-gray-500 text-sm mt-1">{complaints.length} complaints filed</p>
        </div>
        <button onClick={loadComplaints} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {['All', ...Object.keys(STATUS_CONFIG)].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
              filter === s ? 'bg-[#0B1F3A] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#FF9933] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-gray-700 font-bold text-lg">No complaints yet</h3>
          <p className="text-gray-400 text-sm mt-2 mb-6">Report your first civic issue to get started</p>
          <a href="/report" className="bg-[#0B1F3A] text-white font-bold py-3 px-6 rounded-2xl inline-block hover:opacity-90 transition">
            Report an Issue →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c, i) => {
            const cfg = STATUS_CONFIG[c.status];
            const daysLeft = getDaysLeft(c.slaDeadline);
            const isOverdue = daysLeft < 0 && c.status !== 'Resolved';

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setSelected(c)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-400">#{c.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.icon} {c.status}
                      </span>
                      {isOverdue && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">⚠️ Overdue</span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 truncate">{c.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 flex-shrink-0" /> {c.address}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {c.department} · Filed {new Date(c.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-1 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
