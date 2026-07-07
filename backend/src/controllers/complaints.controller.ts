import { Request, Response } from 'express';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// ── In-memory complaint store for demo (replace with Firestore in prod) ─────
interface Complaint {
  id: string;
  uid: string;
  title: string;
  description: string;
  category: string;
  department: string;
  status: string;
  lat: number;
  lng: number;
  address: string;
  ward: string;
  photoUrl?: string;
  aiSummary?: string;
  duplicateClusterId?: string;
  clusterCount: number;
  slaDeadline: string;
  createdAt: string;
  updatedAt: string;
}

const DEPT_MAP: Record<string, string> = {
  roads: 'PWD Department',
  water: 'Water Department',
  sanitation: 'Municipal Corporation',
  electricity: 'Electricity Board',
  sewage: 'Water & Sanitation',
  encroachment: 'Town Planning',
  noise: 'Pollution Control',
  other: 'General Administration',
};

const SLA_DAYS: Record<string, number> = {
  roads: 7,
  water: 3,
  sanitation: 5,
  electricity: 2,
  sewage: 4,
  encroachment: 14,
  noise: 10,
  other: 10,
};

const store: Map<string, Complaint> = new Map();

// Pre-seed with demo data
const DEMO = [
  { id: 'SB-ABC123', uid: 'demo-user-001', title: 'Large pothole on MG Road near bus stop', description: 'Large pothole approximately 2 feet wide causing accidents.', category: 'roads', department: 'PWD Department', status: 'In Progress', lat: 28.6304, lng: 77.2177, address: 'MG Road, Connaught Place, New Delhi', ward: 'Ward 12, Delhi', clusterCount: 3, slaDeadline: new Date(Date.now() + 4 * 86400000).toISOString(), createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date().toISOString(), aiSummary: 'Road damage requiring immediate PWD intervention. High priority.' },
  { id: 'SB-DEF456', uid: 'demo-user-001', title: 'Broken street light on Sector 15', description: 'Street light not working for 5 days creating safety issues.', category: 'electricity', department: 'Electricity Board', status: 'Resolved', lat: 28.4595, lng: 77.0266, address: 'Sector 15, Gurgaon', ward: 'Ward 7, Gurgaon', clusterCount: 1, slaDeadline: new Date(Date.now() - 2 * 86400000).toISOString(), createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), updatedAt: new Date().toISOString(), aiSummary: 'Electrical infrastructure failure. Resolved within SLA.' },
  { id: 'SB-GHI789', uid: 'demo-user-001', title: 'Garbage not collected for 3 days', description: 'Waste management failure — garbage overflow on the street.', category: 'sanitation', department: 'Municipal Corporation', status: 'Acknowledged', lat: 28.5707, lng: 77.2257, address: 'Defence Colony, South Delhi', ward: 'Ward 24, Delhi', clusterCount: 2, slaDeadline: new Date(Date.now() + 6 * 86400000).toISOString(), createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date().toISOString(), aiSummary: 'Municipal sanitation lapse. Escalation recommended if not resolved in 2 days.' },
];
DEMO.forEach(d => store.set(d.id, d as Complaint));

// ── Haversine distance (km) ──────────────────────────────────────────────────
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Gemini AI Categorization ─────────────────────────────────────────────────
async function aiCategorize(title: string, description: string): Promise<{ summary: string; category: string }> {
  if (!GEMINI_API_KEY) {
    return {
      summary: `Civic complaint about ${title}. Filed and routed for processing.`,
      category: 'other'
    };
  }

  try {
    const prompt = `Analyze this civic complaint and respond with JSON only:
Title: ${title}
Description: ${description}

Respond with:
{"summary": "one sentence AI analysis for officials", "category": "one of: roads|water|sanitation|electricity|sewage|encroachment|noise|other"}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 150, temperature: 0 }
        })
      }
    );
    const data = await res.json() as any;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const clean = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return { summary: `Civic complaint: ${title}`, category: 'other' };
  }
}

// ── Generate Escalation Letter via Gemini ─────────────────────────────────────
async function generateEscalation(complaint: any): Promise<string> {
  if (!GEMINI_API_KEY) {
    return `To,
The ${complaint.department},

Subject: RTI/Escalation Request - Complaint #${complaint.id}

Sir/Madam,

This letter serves as an official escalation for complaint #${complaint.id} titled "${complaint.title}" filed on ${new Date(complaint.createdAt).toLocaleDateString('en-IN')}.

The SLA deadline has passed and the issue remains unresolved. As per RTI Act 2005 and citizen charter obligations, I request immediate action.

Issue Location: ${complaint.address}
Department Assigned: ${complaint.department}
Status: ${complaint.status}

Kindly escalate this to the senior officer for immediate attention.

Regards,
Nivaran Citizen`;
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Write a formal RTI/escalation letter from a citizen to the ${complaint.department} for an overdue civic complaint. Complaint: "${complaint.title}" at ${complaint.address}, filed ${new Date(complaint.createdAt).toLocaleDateString('en-IN')}. Keep it professional, cite RTI Act 2005, and be concise.` }] }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.3 }
        })
      }
    );
    const data = await res.json() as any;
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Letter generated.';
  } catch {
    return 'Escalation letter generated.';
  }
}

// ── Controllers ───────────────────────────────────────────────────────────────

export const createComplaint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, title, description, category, lat, lng, address, ward } = req.body;

    if (!description || !category) {
      res.status(400).json({ success: false, error: 'description and category are required' });
      return;
    }

    // AI categorization & summarization
    const ai = await aiCategorize(title || description.slice(0, 80), description);
    const finalCategory = ai.category || category;
    const department = DEPT_MAP[finalCategory] || 'General Administration';
    const slaDays = SLA_DAYS[finalCategory] || 10;

    // Duplicate detection — cluster complaints within 100m
    let clusterId: string | undefined;
    let clusterCount = 1;
    if (lat && lng) {
      for (const [, existing] of store) {
        if (
          existing.category === finalCategory &&
          existing.status !== 'Resolved' &&
          existing.lat && existing.lng &&
          haversineKm(lat, lng, existing.lat, existing.lng) <= 0.1 // 100m
        ) {
          clusterId = existing.duplicateClusterId || existing.id;
          existing.clusterCount = (existing.clusterCount || 1) + 1;
          clusterCount = existing.clusterCount;
          break;
        }
      }
    }

    const id = `SB-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();
    const complaint: Complaint = {
      id,
      uid: uid || 'anonymous',
      title: title || `${finalCategory} issue near ${ward || address}`,
      description,
      category: finalCategory,
      department,
      status: 'Filed',
      lat: lat || 0,
      lng: lng || 0,
      address: address || 'Location not provided',
      ward: ward || 'Unknown Ward',
      aiSummary: ai.summary,
      duplicateClusterId: clusterId,
      clusterCount,
      slaDeadline: new Date(Date.now() + slaDays * 86400000).toISOString(),
      createdAt: now,
      updatedAt: now,
    };

    store.set(id, complaint);

    res.status(201).json({
      success: true,
      complaint,
      isDuplicate: !!clusterId,
      clusterCount,
      message: clusterId
        ? `This complaint has been merged with ${clusterCount} similar complaints in your area.`
        : 'Complaint filed and routed to ' + department
    });
  } catch (err) {
    console.error('createComplaint error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getMyComplaints = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req.query.uid as string) || '';
    const complaints = Array.from(store.values())
      .filter(c => c.uid === uid || uid === 'demo-user-001')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getPublicComplaints = async (_req: Request, res: Response): Promise<void> => {
  try {
    const complaints = Array.from(store.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 100);

    // Aggregate stats
    const byCategory: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    for (const c of complaints) {
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    }

    res.json({ success: true, complaints, stats: { total: store.size, byCategory, byStatus } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getComplaintById = async (req: Request, res: Response): Promise<void> => {
  const complaint = store.get(req.params.id as string);
  if (!complaint) {
    res.status(404).json({ success: false, error: 'Complaint not found' });
    return;
  }
  res.json({ success: true, complaint });
};

export const updateComplaintStatus = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;
  const complaint = store.get(req.params.id as string);
  if (!complaint) {
    res.status(404).json({ success: false, error: 'Complaint not found' });
    return;
  }
  complaint.status = status;
  complaint.updatedAt = new Date().toISOString();
  store.set(complaint.id, complaint);
  res.json({ success: true, complaint, message: `Status updated to ${status}` });
};

export const escalateComplaint = async (req: Request, res: Response): Promise<void> => {
  try {
    const complaint = req.body.complaint || store.get(req.params.id as string);
    if (!complaint) {
      res.status(404).json({ success: false, error: 'Complaint not found' });
      return;
    }
    const letter = await generateEscalation(complaint);
    res.json({ success: true, letter });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to generate escalation letter' });
  }
};
