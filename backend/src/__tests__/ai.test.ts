import request from 'supertest';
import app from '../app';

describe('AI Assistant & RAG Endpoints', () => {
  describe('POST /api/ai/chat', () => {
    it('should retrieve grounded RAG answers about welfare schemes (PM-KISAN)', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .send({ message: 'Tell me about PM-KISAN benefits' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('reply');
      expect(response.body.reply.toLowerCase()).toContain('pm-kisan');
      expect(response.body.reply.toLowerCase()).toContain('6,000');
    });

    it('should detect Hindi language and reply in Hindi vocabulary', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .send({ message: 'किसान योजना क्या है?' }); // "What is kisan scheme?"

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('detectedLanguage', 'hi');
      expect(response.body).toHaveProperty('reply');
      expect(response.body.reply).toContain('लाभ:');
    });

    it('should detect complaint intent and return redirect payload', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .send({ message: 'potholes on the road' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('redirect', 'file-complaint');
      expect(response.body).toHaveProperty('suggestedFields');
      expect(response.body.suggestedFields).toHaveProperty('category', 'Roads');
    });
  });

  describe('POST /api/ai/stt', () => {
    it('should return simulated speech transcription text', async () => {
      const response = await request(app)
        .post('/api/ai/stt')
        .send(); // posts empty payload, mimicking audio stream upload

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('transcript');
      expect(typeof response.body.transcript).toBe('string');
    });
  });
});
