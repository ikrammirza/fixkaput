jest.setTimeout(15000);
import { createMocks } from 'node-mocks-http';
process.env.JWT_SECRET = 'testsecretkey';
import redis from '../lib/redis.js';

// ✅ Redis mock
jest.mock('../lib/redis.js', () => ({
    get: jest.fn(),
    del: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
}));

// ✅ Mongoose mock
jest.mock('../middleware/mongoose', () => jest.fn(() => Promise.resolve()));

// ✅ User model mock (FIXED HERE)
const mockFindOne = jest.fn();

const mockUserClass = function (data) {
    return {
        _id: '456',
        phone: data.phone,
        save: jest.fn().mockResolvedValue({
            _id: '456',
            phone: data.phone,
        }),
    };
};

mockUserClass.findOne = mockFindOne;

jest.mock('../models/User', () => ({
    __esModule: true,
    default: mockUserClass,
}));

// ✅ Import AFTER mocks
const handler = require('../pages/api/verify-otp').default;

const runHandler = (req, res, handler) => {
    return new Promise((resolve) => {
        res.end = () => resolve(res);
        handler(req, res);
    });
};

describe('POST /api/verify-otp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        redis.get.mockResolvedValue('123456');
        redis.del.mockResolvedValue(1);
    });

    it('should verify OTP and return existing user', async () => {
        mockFindOne.mockResolvedValue({ _id: '123', phone: '9876543210' });

        const { req, res } = createMocks({
            method: 'POST',
            body: { phone: '9876543210', otp: '123456' },
        });

        await runHandler(req, res, handler);

        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());

        expect(data.success).toBe(true);
        expect(data.user.phone).toBe('9876543210');
        expect(redis.del).toHaveBeenCalledWith('otp:9876543210');
    });

    it('should create new user if not found in DB', async () => {
        mockFindOne.mockResolvedValue(null);

        const { req, res } = createMocks({
            method: 'POST',
            body: { phone: '9999999999', otp: '123456' },
        });

        await runHandler(req, res, handler);

        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());

        expect(data.success).toBe(true);
        expect(data.user.phone).toBe('9999999999');
        expect(redis.del).toHaveBeenCalledWith('otp:9999999999');
    });

    it('should return 400 for invalid OTP', async () => {
        redis.get.mockResolvedValue('123456');

        const { req, res } = createMocks({
            method: 'POST',
            body: { phone: '9876543210', otp: '000000' },
        });

        await runHandler(req, res, handler);

        expect(res._getStatusCode()).toBe(400);
        const data = JSON.parse(res._getData());
        expect(data.success).toBe(false);
        expect(redis.del).not.toHaveBeenCalled();
    });

    it('should return 400 if OTP is not found (expired)', async () => {
        redis.get.mockResolvedValue(null);

        const { req, res } = createMocks({
            method: 'POST',
            body: { phone: '9876543210', otp: '123456' },
        });

        await runHandler(req, res, handler);

        expect(res._getStatusCode()).toBe(400);
        const data = JSON.parse(res._getData());
        expect(data.success).toBe(false);
        expect(data.message).toBe('OTP expired or not found. Please resend.');
        expect(redis.del).not.toHaveBeenCalled();
    });

    it('should return 400 if phone or OTP is missing', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: { phone: '', otp: '' },
        });

        await runHandler(req, res, handler);

        expect(res._getStatusCode()).toBe(400);
        const data = JSON.parse(res._getData());
        expect(data.success).toBe(false);
        expect(data.message).toBe('Phone and OTP are required');
    });

    it('should return 500 if Redis throws error', async () => {
        redis.get.mockRejectedValue(new Error('Redis error'));

        const { req, res } = createMocks({
            method: 'POST',
            body: { phone: '9876543210', otp: '123456' },
        });

        await runHandler(req, res, handler);

        expect(res._getStatusCode()).toBe(500);
        const data = JSON.parse(res._getData());
        expect(data.success).toBe(false);
    });

    it('should return 405 for GET request', async () => {
        const { req, res } = createMocks({ method: 'GET' });
        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(405);
    });
});
