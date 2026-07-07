import request from 'supertest';
import app from '../app';
import { prisma } from '../db';

describe('Authentication API (Mock OTP Flow)', () => {
  const testPhone = '9876543210';

  beforeAll(async () => {
    // Clean up any existing test session or user
    try {
      await prisma.otpSession.deleteMany({ where: { phone: testPhone } });
      await prisma.user.deleteMany({ where: { phone: testPhone } });
    } catch (err) {
      // Ignored if tables are clean
    }
  });

  afterAll(async () => {
    // Final cleanup
    try {
      await prisma.otpSession.deleteMany({ where: { phone: testPhone } });
      await prisma.user.deleteMany({ where: { phone: testPhone } });
    } catch (err) {
      // Ignored
    }
  });

  let generatedOtp: string;

  it('should generate a mock OTP code successfully', async () => {
    const res = await request(app)
      .post('/api/auth/request-otp')
      .send({ phone: testPhone });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.mockOtp).toBeDefined();
    expect(res.body.mockOtp.length).toBe(6);
    
    generatedOtp = res.body.mockOtp;
  });

  it('should fail verification if incorrect OTP is supplied', async () => {
    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({ phone: testPhone, otp: '000000' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Invalid OTP');
  });

  it('should successfully verify the correct OTP and issue a JWT', async () => {
    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({ phone: testPhone, otp: generatedOtp });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.phone).toBe(testPhone);
    expect(res.body.user.role).toBe('CITIZEN');
  });
});
