// pages/api/me.js
import { getSession } from '../../lib/redis';
import { parse } from 'cookie';

export default async function handler(req, res) {
  const cookies = parse(req.headers.cookie || '');
  const sessionId = cookies.sessionId;

  console.log('👉 Incoming /api/me request');
  console.log('🍪 Cookies:', cookies);
  console.log('🔑 Session ID from cookie:', sessionId);

  if (!sessionId) {
    console.warn('🚫 No session token found in cookies');
    return res.status(401).json({ success: false, message: 'Not logged in' });
  }

  const userData = await getSession(sessionId);

  console.log('📦 Data fetched from Redis for this session:', userData);

  if (!userData) {
    console.warn('⚠️ Session expired or not found in Redis');
    return res.status(401).json({ success: false, message: 'Session expired' });
  }

  console.log('✅ Returning user data:', {
    name: userData.name,
    phone: userData.phone,
  });

  return res.status(200).json({ success: true, user: userData });
}
