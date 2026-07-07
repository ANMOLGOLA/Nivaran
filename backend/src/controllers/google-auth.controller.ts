import { Request, Response } from 'express';

// In-memory user store (Firestore-ready)
const userStore: Map<string, any> = new Map();

export const googleAuthHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, email, name, photoURL } = req.body;

    if (!uid) {
      res.status(400).json({ success: false, error: 'uid is required' });
      return;
    }

    // Upsert user
    let user = userStore.get(uid);
    if (!user) {
      user = {
        id: uid,
        uid,
        email: email || '',
        name: name || 'Citizen',
        photoURL: photoURL || null,
        phone: '',
        role: 'CITIZEN',
        languagePref: 'en',
        createdAt: new Date().toISOString(),
      };
      userStore.set(uid, user);
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('googleAuth error:', err);
    res.status(500).json({ success: false, error: 'Auth failed' });
  }
};
