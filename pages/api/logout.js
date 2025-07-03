import { parse, serialize } from 'cookie';
import redis from '../../lib/redis';

export default async function handler(req, res) {
  console.log("🚪 Logout API called");

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const cookies = parse(req.headers.cookie || '');
    const sessionId = cookies.sessionId;

    console.log("🍪 Parsed cookies:", cookies);
    console.log("🔑 Extracted sessionId:", sessionId);

    if (sessionId) {
      const deleted = await redis.del(sessionId); // should return 1 if key was deleted
      console.log("🧹 Redis deletion result:", deleted);
    } else {
      console.warn("⚠️ No sessionId cookie found.");
    }

    // Always clear cookie regardless
    res.setHeader('Set-Cookie', serialize('sessionId', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    }));

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error('❌ Logout error:', err);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
}
