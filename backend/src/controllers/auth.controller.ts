import { Request, Response } from 'express';
import { prisma } from '../db';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const requestOtpSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number too long"),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  name: z.string().optional(),
});

const JWT_SECRET = process.env.JWT_SECRET || 'smart_bharat_secret_key_12345';

export const requestOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = requestOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.issues[0].message });
      return;
    }

    const { phone } = parseResult.data;
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Upsert OTP session
    await prisma.otpSession.upsert({
      where: { phone },
      update: { otp, expiresAt },
      create: { phone, otp, expiresAt },
    });

    // In a real app, send OTP via SMS gateway. For this mock/hackathon build,
    // we return the code directly so it can be displayed in an on-screen toast.
    res.status(200).json({
      success: true,
      message: 'OTP generated successfully',
      mockOtp: otp,
    });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = verifyOtpSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.issues[0].message });
      return;
    }

    const { phone, otp, name } = parseResult.data;

    // Find OTP session
    const session = await prisma.otpSession.findUnique({
      where: { phone },
    });

    if (!session) {
      res.status(400).json({ success: false, error: 'OTP session not found' });
      return;
    }

    if (session.otp !== otp) {
      res.status(400).json({ success: false, error: 'Invalid OTP' });
      return;
    }

    if (new Date() > session.expiresAt) {
      res.status(400).json({ success: false, error: 'OTP has expired' });
      return;
    }

    // OTP is valid, find or create the User
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          name: name || `Citizen-${phone.slice(-4)}`,
          role: 'CITIZEN', // Default role is CITIZEN
        },
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Delete the OTP session after successful verification
    await prisma.otpSession.delete({
      where: { phone },
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        languagePref: user.languagePref,
      },
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
