import { getSession } from '../../lib/redis';
import { parse } from 'cookie';
import connectDb from '../../middleware/mongoose';
import User from '../../models/User';

export default async function handler(req, res) {
  const cookies = parse(req.headers.cookie || '');
  const sessionId = cookies.sessionId;

  if (!sessionId) {
    console.warn('🚫 No session token found in cookies');
    return res.status(401).json({ success: false, message: 'Not logged in' });
  }

  const userId = await getSession(sessionId); // get user ID from Redis

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Session expired' });
  }

  await connectDb();
  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({ success: true, user }); // this includes isAdmin
}
