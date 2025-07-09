import redis from './redis';
import cookie from 'cookie';

export const authenticateTechnician = async (req) => {
    const cookies = cookie.parse(req.headers.cookie || '');
    const sessionId = cookies.technicianSessionId;

    if (!sessionId) return null;

    const session = await redis.get(`session:${sessionId}`);
    if (!session) return null;

    try {
        return JSON.parse(session);
    } catch {
        return null;
    }
};
