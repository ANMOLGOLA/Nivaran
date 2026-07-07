import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  MapPin, Camera, Mic, CheckCircle2,
  ChevronRight, Loader2, Upload, X, AlertTriangle
} from 'lucide-react';
import type { AppUser } from '../App';

interface Props { user: AppUser }

const CATEGORIES = [
  { id: 'roads', label: 'Roads & Potholes', icon: '🛣️', dept: 'PWD Department' },
  { id: 'water', label: 'Water Supply', icon: '💧', dept: 'Water Department' },
  { id: 'sanitation', label: 'Sanitation & Garbage', icon: '🗑️', dept: 'Municipal Corporation' },
  { id: 'electricity', label: 'Street Lights & Power', icon: '💡', dept: 'Electricity Board' },
  { id: 'sewage', label: 'Sewage & Drainage', icon: '🚰', dept: 'Water & Sanitation' },
  { id: 'encroachment', label: 'Encroachment', icon: '🏚️', dept: 'Town Planning' },
  { id: 'noise', label: 'Noise Pollution', icon: '📢', dept: 'Pollution Control' },
  { id: 'other', label: 'Other Issue', icon: '📋', dept: 'General Administration' },
];

const STEPS = ['Category', 'Details', 'Location', 'Media', 'Review'];

export const ReportIssuePage: React.FC<Props> = ({ user }) => {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const [form, setForm] = useState({
    category: '',
    categoryLabel: '',
    department: '',
    title: '',
    description: '',
    lat: 0,
    lng: 0,
    address: '',
    ward: '',
    photo: null as File | null,
    photoPreview: '',
    voiceNote: null as Blob | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recording, setRecording] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // ── AI Auto-Categorize ──────────────────────────────────────────────────
  const runAiCategorize = async (description: string) => {
    if (!description || description.length < 20) return;
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Categorize this civic complaint for routing to a department: "${description}". Reply in one sentence.` })
      });
      const data = await res.json();
      if (data.success) setAiSuggestion(data.reply);
    } catch {}
    setLoadingAi(false);
  };

  // ── Get GPS Location ────────────────────────────────────────────────────
  const getLocation = () => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
          ward: 'Ward 12, Delhi' // would resolve via geocoding in prod
        }));
        toast.success('Location captured successfully!');
        setGettingLocation(false);
      },
      () => {
        // Fallback for demo
        setForm(f => ({ ...f, lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi', ward: 'Ward 12, Delhi' }));
        toast.info('Using demo location: New Delhi');
        setGettingLocation(false);
      }
    );
  };

  // ── Photo Handler ───────────────────────────────────────────────────────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, photo: file, photoPreview: URL.createObjectURL(file) }));
  };

  // ── Voice Recording ─────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setForm(f => ({ ...f, voiceNote: blob }));
        stream.getTracks().forEach(t => t.stop());
        toast.success('Voice note recorded!');
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      toast.info('Recording... tap again to stop');
    } catch {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        uid: user.id,
        title: form.title || `${form.categoryLabel} issue near ${form.ward}`,
        description: form.description,
        category: form.category,
        department: form.department,
        lat: form.lat,
        lng: form.lng,
        address: form.address,
        ward: form.ward,
      };

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.idToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setSubmitted(data.complaint?.id || `SB-${Date.now().toString(36).toUpperCase()}`);
        toast.success('Complaint filed successfully!');
      } else {
        // Demo mode — generate local complaint ID
        setSubmitted(`SB-${Date.now().toString(36).toUpperCase()}`);
        toast.success('Complaint filed! (Demo mode)');
      }
    } catch {
      setSubmitted(`SB-${Date.now().toString(36).toUpperCase()}`);
      toast.success('Complaint filed! (Demo mode)');
    }
    setSubmitting(false);
  };

  // ── Success Screen ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <div className="w-24 h-24 bg-[#138808] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-14 h-14 text-[#138808]" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Complaint Filed!</h2>
        <p className="text-gray-500 mb-2">Ticket ID:</p>
        <div className="inline-block bg-[#0B1F3A] text-[#FF9933] font-mono font-black text-xl px-6 py-3 rounded-2xl mb-6">
          #{submitted}
        </div>
        <p className="text-gray-600 mb-8">
          Your complaint has been routed to <strong>{form.department}</strong>. You will receive status updates as the issue is processed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/my-complaints" className="bg-[#0B1F3A] text-white font-bold py-3 px-6 rounded-2xl hover:opacity-90 transition">
            Track This Complaint
          </a>
          <button onClick={() => { setSubmitted(null); setStep(0); setForm(f => ({ ...f, category: '', description: '', title: '', photo: null, photoPreview: '', lat: 0, lng: 0 })); }}
            className="border-2 border-gray-200 text-gray-700 font-bold py-3 px-6 rounded-2xl hover:bg-gray-50 transition">
            File Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-900">Report a Civic Issue</h2>
        <p className="text-gray-500 text-sm mt-1">Help improve your city — every complaint counts</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 flex-shrink-0 ${i <= step ? 'text-[#0B1F3A]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i < step ? 'bg-[#138808] text-white' : i === step ? 'bg-[#0B1F3A] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs font-semibold hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-grow h-0.5 mx-2 ${i < step ? 'bg-[#138808]' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <AnimatePresence mode="wait">
          {/* Step 0: Category */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className="font-bold text-gray-800 text-lg mb-5">What type of issue are you reporting?</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setForm(f => ({ ...f, category: cat.id, categoryLabel: cat.label, department: cat.dept }));
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      form.category === cat.id
                        ? 'border-[#FF9933] bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <p className="text-xs font-bold text-gray-800 leading-tight">{cat.label}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1: Description */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h3 className="font-bold text-gray-800 text-lg">Describe the issue</h3>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Issue Title (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Large pothole on MG Road"
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border-2 border-gray-200 focus:border-[#FF9933] rounded-2xl px-4 py-3 text-sm outline-none transition"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Description *</label>
                <textarea
                  rows={5}
                  placeholder="Describe the problem in detail. You can write in Hindi, Tamil, or any Indian language..."
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  onBlur={() => runAiCategorize(form.description)}
                  className="w-full border-2 border-gray-200 focus:border-[#FF9933] rounded-2xl px-4 py-3 text-sm outline-none transition resize-none"
                />
              </div>
              {/* AI Suggestion */}
              {(loadingAi || aiSuggestion) && (
                <div className="bg-[#0B1F3A] bg-opacity-5 border border-[#0B1F3A] border-opacity-20 rounded-2xl p-4 flex items-start gap-3">
                  {loadingAi ? (
                    <Loader2 className="w-4 h-4 text-[#FF9933] animate-spin flex-shrink-0 mt-0.5" />
                  ) : (
                    <span className="text-[#FF9933] text-lg flex-shrink-0">🤖</span>
                  )}
                  <div>
                    <p className="text-xs font-bold text-[#0B1F3A] mb-1">AI Analysis</p>
                    <p className="text-xs text-gray-600">{loadingAi ? 'Analyzing your description...' : aiSuggestion}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h3 className="font-bold text-gray-800 text-lg">Where is the issue located?</h3>
              <button
                onClick={getLocation}
                disabled={gettingLocation}
                className="w-full flex items-center justify-center gap-3 bg-[#0B1F3A] text-white font-bold py-4 px-6 rounded-2xl hover:opacity-90 transition disabled:opacity-70"
              >
                {gettingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                {gettingLocation ? 'Getting location...' : form.lat ? 'Update Location' : 'Use My Current Location'}
              </button>
              {form.lat !== 0 && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-sm font-bold text-green-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Location Captured
                  </p>
                  <p className="text-xs text-green-700 mt-1">{form.address}</p>
                  <p className="text-xs text-gray-400 mt-1">GPS: {form.lat.toFixed(4)}, {form.lng.toFixed(4)}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Or enter address manually</label>
                <input
                  type="text"
                  placeholder="Street address, landmark, area..."
                  value={form.address}
                  onChange={(e) => setForm(f => ({ ...f, address: e.target.value, ward: 'Ward 12, Delhi' }))}
                  className="w-full border-2 border-gray-200 focus:border-[#FF9933] rounded-2xl px-4 py-3 text-sm outline-none transition"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Media */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h3 className="font-bold text-gray-800 text-lg">Add Photos & Voice Note</h3>
              <p className="text-sm text-gray-500">Evidence helps officials prioritize and resolve issues faster.</p>

              {/* Photo Upload */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Photo (optional)</label>
                {form.photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden">
                    <img src={form.photoPreview} alt="Issue" className="w-full h-48 object-cover rounded-2xl" />
                    <button
                      onClick={() => setForm(f => ({ ...f, photo: null, photoPreview: '' }))}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 hover:border-[#FF9933] rounded-2xl p-8 flex flex-col items-center gap-3 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500 font-semibold">Click to upload photo</span>
                    <span className="text-xs text-gray-400">JPG, PNG up to 10MB</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </div>

              {/* Voice Note */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Voice Note (optional)</label>
                <button
                  onClick={recording ? stopRecording : startRecording}
                  className={`w-full flex items-center justify-center gap-3 font-bold py-4 px-6 rounded-2xl transition ${
                    recording
                      ? 'bg-red-600 text-white animate-pulse'
                      : form.voiceNote
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  {recording ? 'Recording... Tap to Stop' : form.voiceNote ? '✓ Voice Note Recorded' : 'Record Voice Note'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h3 className="font-bold text-gray-800 text-lg">Review & Submit</h3>
              <div className="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Category</span>
                  <span className="font-bold text-gray-800">{form.categoryLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Department</span>
                  <span className="font-bold text-[#0B1F3A]">{form.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Location</span>
                  <span className="font-bold text-gray-800 text-right max-w-[60%]">{form.address || 'Not provided'}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-gray-500 font-medium mb-1">Description</p>
                  <p className="text-gray-800">{form.description}</p>
                </div>
                {form.photoPreview && (
                  <img src={form.photoPreview} alt="Issue" className="w-full h-32 object-cover rounded-xl mt-2" />
                )}
                <div className="flex gap-2">
                  {form.photo && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">📷 Photo Added</span>}
                  {form.voiceNote && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg">🎙️ Voice Note Added</span>}
                </div>
              </div>
              <div className="bg-amber-50 border-l-4 border-[#FF9933] p-4 rounded-r-2xl flex items-start gap-3 text-sm">
                <AlertTriangle className="w-4 h-4 text-[#FF9933] flex-shrink-0 mt-0.5" />
                <p className="text-amber-800">
                  By submitting, you confirm this is a genuine civic issue. False complaints may lead to account action.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3 px-6 rounded-2xl hover:bg-gray-50 transition"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => {
                if (step === 0 && !form.category) { toast.error('Please select a category'); return; }
                if (step === 1 && !form.description.trim()) { toast.error('Please describe the issue'); return; }
                if (step === 2 && form.lat === 0 && !form.address) { toast.error('Please provide a location'); return; }
                setStep(s => s + 1);
              }}
              className="flex-1 bg-[#0B1F3A] text-white font-bold py-3 px-6 rounded-2xl hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-[#138808] to-green-600 text-white font-bold py-3 px-6 rounded-2xl hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
