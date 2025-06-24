jest.setTimeout(10000);

// ✅ Mocks
jest.mock('../middleware/mongoose', () => jest.fn(() => Promise.resolve()));
const connectDb = require('../middleware/mongoose');

const mockSave = jest.fn();
jest.mock('../models/Order', () =>
    function MockOrder(data) {
        return {
            ...data,
            save: mockSave,
        };
    }
);

jest.mock('../utils/smsService', () => ({
    sendSMS: jest.fn().mockResolvedValue(true),
}));

// ✅ Imports (no socket.io import here)
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/bookService';
import { sendSMS } from '../utils/smsService';

const runHandler = (req, res, handler) => {
    return new Promise((resolve) => {
        res.end = () => resolve(res);
        handler(req, res);
    });
};

describe('/api/bookService', () => {
    const validPayload = {
        oid: 123456,
        name: 'John Doe',
        phone: '9876543210',
        address: {
            area: 'MG Road',
            line1: 'Street 1',
            city: 'Hyderabad',
            pincode: '500001',
        },
        cart: {
            ac_cleaning: {
                name: 'AC Cleaning',
                qty: 1,
                price: 500,
            },
        },
        amount: 525,
    };

    beforeEach(() => {
        process.env.TEST_ENV = 'true';
        mockSave.mockResolvedValue(validPayload);
        sendSMS.mockResolvedValue(true);
        jest.clearAllMocks();
    });

    it('should return 200 on successful booking', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: validPayload,
        });

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.message).toBe('Booking successful!');
    });

    it('should return 400 for missing fields', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                name: 'John Doe',
                phone: '9876543210',
            },
        });

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(400);
    });

    it('should return 400 for invalid phone number', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: { ...validPayload, phone: '12345' },
        });

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(400);
    });

    it('should return 405 for GET requests', async () => {
        const { req, res } = createMocks({ method: 'GET' });
        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(405);
    });

    it('should return 500 if saving the order fails', async () => {
        mockSave.mockRejectedValueOnce(new Error('DB save failed'));

        const { req, res } = createMocks({
            method: 'POST',
            body: validPayload,
        });

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(500);
        expect(JSON.parse(res._getData()).message).toMatch(/Booking failed/i);
    });

    it('should not fail if SMS sending fails', async () => {
        sendSMS.mockRejectedValue(new Error('SMS error'));

        const { req, res } = createMocks({
            method: 'POST',
            body: validPayload,
        });

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(200);
    });

    it('should work without optional email field', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: { ...validPayload, email: undefined },
        });

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(200);
    });

    it('should return 400 if address is incomplete', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                ...validPayload,
                address: { area: '', line1: '', city: '', pincode: '' },
            },
        });

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(400);
    });

    it('should still work if res.socket.server is missing', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: validPayload,
        });

        res.socket = {}; // simulate socket server missing
        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(200);
    });

    it('should return 500 if connectDb fails', async () => {
        connectDb.mockRejectedValueOnce(new Error('DB connection failed'));

        const { req, res } = createMocks({
            method: 'POST',
            body: validPayload,
        });

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(500);
        expect(JSON.parse(res._getData()).message).toMatch(/Internal server error/i);
    });

    it('should emit socket event if io is present and not test env', async () => {
        delete process.env.TEST_ENV;
        jest.resetModules();

        const mockEmit = jest.fn();

        jest.doMock('socket.io', () => ({
            Server: jest.fn().mockImplementation(() => ({
                emit: mockEmit,
            })),
        }));

        await jest.isolateModules(async () => {
            const { createMocks } = await import('node-mocks-http');
            const handlerWithIO = (await import('../pages/api/bookService')).default;

            const { req, res } = createMocks({
                method: 'POST',
                body: validPayload,
            });

            res.socket = { server: {} };
            await runHandler(req, res, handlerWithIO);

            expect(res._getStatusCode()).toBe(200);
            expect(mockEmit).toHaveBeenCalledWith('newOrder', expect.any(Object));
        });
    });

    it('should initialize socket.io if not already set and server is present', async () => {
        delete process.env.TEST_ENV;
        jest.resetModules();

        const emitMock = jest.fn();

        jest.doMock('socket.io', () => ({
            Server: jest.fn().mockImplementation(() => ({
                emit: emitMock,
            })),
        }));

        await jest.isolateModules(async () => {
            const { createMocks } = await import('node-mocks-http');
            const handlerWithIO = (await import('../pages/api/bookService')).default;

            const { req, res } = createMocks({
                method: 'POST',
                body: validPayload,
            });

            res.socket = { server: {} };
            await runHandler(req, res, handlerWithIO);

            expect(res._getStatusCode()).toBe(200);
            expect(emitMock).toHaveBeenCalledWith('newOrder', expect.any(Object));
        });
    });
    it('should not throw if res.socket is missing entirely', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: validPayload,
        });

        // simulate no `res.socket` at all (undefined)
        delete res.socket;

        await runHandler(req, res, handler);
        expect(res._getStatusCode()).toBe(200);
    });
    it('should log SMS error but not fail booking if SMS sending fails in prod env', async () => {
        delete process.env.TEST_ENV; // simulate production
        sendSMS.mockRejectedValueOnce(new Error('SMS failed'));

        const { req, res } = createMocks({
            method: 'POST',
            body: validPayload,
        });

        res.socket = { server: {} };

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        await runHandler(req, res, handler);

        expect(res._getStatusCode()).toBe(200);
        expect(consoleSpy).toHaveBeenCalledWith(
            'SMS sending failed:',
            expect.any(Error)
        );

        consoleSpy.mockRestore();
    });

});
