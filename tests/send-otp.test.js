// ✅ tests/send-otp.test.js
jest.setTimeout(15000);

// ✅ Mock Redis
jest.mock('../lib/redis', () => ({
    set: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
    setex: jest.fn(),
}));

// ✅ Mock Twilio
const mockCreate = jest.fn().mockResolvedValue({ sid: 'MOCK_SID' });
jest.mock('twilio', () => {
    return jest.fn(() => ({
        messages: {
            create: mockCreate,
        },
    }));
});

// ✅ Mock DB
jest.mock('../middleware/mongoose', () => jest.fn(() => Promise.resolve()));

// ✅ Imports
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/send-otp';
import redis from '../lib/redis';

const runHandler = (req, res, handler) => {
    return new Promise((resolve) => {
        res.end = () => resolve(res);
        handler(req, res);
    });
};

describe('POST /api/send-otp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        redis.set.mockResolvedValue('OK');
        redis.incr.mockResolvedValue(1);
        redis.expire.mockResolvedValue(1);
        redis.setex.mockResolvedValue('OK');
        mockCreate.mockResolvedValue({ sid: 'MOCK_SID' });
    });

    it('should send OTP for valid phone', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: { phone: '9876543210' },
        });

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData()).success).toBe(true);
    });

    it('should return 400 for invalid phone', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: { phone: 'abc' },
        });

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(400);
    });

    it('should return 429 if Redis lock fails', async () => {
        redis.set.mockResolvedValue(null);

        const { req, res } = createMocks({
            method: 'POST',
            body: { phone: '9876543210' },
        });

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(429);
    });

    it('should return 429 if rate limit exceeded', async () => {
        redis.incr.mockResolvedValue(6);

        const { req, res } = createMocks({
            method: 'POST',
            body: { phone: '9876543210' },
        });

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(429);
    });

    it('should return 500 if Twilio fails', async () => {
        mockCreate.mockRejectedValueOnce(new Error('Twilio error'));

        const { req, res } = createMocks({
            method: 'POST',
            body: { phone: '9876543210' },
        });

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(500);
    });

    it('should return 405 for GET request', async () => {
        const { req, res } = createMocks({ method: 'GET' });
        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(405);
    });
});
