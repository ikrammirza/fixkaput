import { parse, serialize } from 'cookie';
import redis from '../../../lib/redis';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const cookies = parse(req.headers.cookie || '');
        const sessionId = cookies.technicianSessionId;

        if (sessionId) {
            await redis.del(`session:${sessionId}`);

            // Expire the cookie
            res.setHeader('Set-Cookie', serialize('technicianSessionId', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax', // more lenient than 'strict' and still secure
                path: '/',
                maxAge: 0,
                expires: new Date(0), // helps expire in all browsers
            }));
        }

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Technician logout error:', error);
        return res.status(500).json({ message: 'Logout failed' });
    }
}
