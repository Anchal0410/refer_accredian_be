import request from 'supertest';
import app from "../app.js";
import prisma from '../src/config/db.config.js';

describe('Referral API Tests', () => {
  // Test data
  const referralData = {
    referrerName: 'John Doe',
    referrerEmail: 'john@example.com',
    refereeName: 'Jane Smith',
    refereeEmail: 'jane@example.com',
    courseInterest: 'web-development',
    message: 'Check out this course!'
  };

  // Clear database before each test
  beforeEach(async () => {
    await prisma.referral.deleteMany();
  });

  // Close Prisma connection after all tests
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/referrals', () => {
    it('should create a new referral', async () => {
      const res = await request(app)
        .post('/api/referrals')
        .send(referralData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('referralCode');
      expect(res.body.data.referrerEmail).toBe(referralData.referrerEmail);
    });

    it('should validate required fields', async () => {
      const invalidData = {
        referrerName: 'John Doe'
        // Missing other required fields
      };

      const res = await request(app)
        .post('/api/referrals')
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/referrals/:referralCode', () => {
    it('should get referral status', async () => {
      // First create a referral
      const createRes = await request(app)
        .post('/api/referrals')
        .send(referralData);

      const referralCode = createRes.body.data.referralCode;

      // Then get its status
      const getRes = await request(app)
        .get(`/api/referrals/${referralCode}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.success).toBe(true);
      expect(getRes.body.data.status).toBe('PENDING');
    });

    it('should handle non-existent referral code', async () => {
      const res = await request(app)
        .get('/api/referrals/NONEXISTENT');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/referrals/:referralCode', () => {
    it('should update referral status', async () => {
      // First create a referral
      const createRes = await request(app)
        .post('/api/referrals')
        .send(referralData);

      const referralCode = createRes.body.data.referralCode;

      // Then update its status
      const updateRes = await request(app)
        .patch(`/api/referrals/${referralCode}`)
        .send({ status: 'ENROLLED' });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.success).toBe(true);
      expect(updateRes.body.data.status).toBe('ENROLLED');
    });
  });
});