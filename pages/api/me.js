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

  console.log('📝 ME API: Session ID from cookie:', sessionId);

  const decoded = await getSession(sessionId);

  if (!decoded || !decoded._id) {
    console.warn('🚫 ME API: Session decoding failed or no _id:', decoded);
    return res.status(401).json({ success: false, message: 'Session expired' });
  }

  console.log('📝 ME API: Decoded user ID from session:', decoded._id);

  await connectDb();
  const user = await User.findById(decoded._id);

  if (!user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }

  console.log('📝 ME API: User found in DB (ID, isAdmin):', user._id, user.isAdmin);
  return res.status(200).json({ success: true, user }); // this includes isAdmin
}
