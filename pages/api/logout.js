// pages/api/logout.js

import { deleteSession } from '@/lib/redis'; // your Redis helper
import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const cookies = parse(req.headers.cookie || '');
    const sessionId = cookies.token;

    if (sessionId) {
      await deleteSession(sessionId); // Deletes Redis session by token/sessionId
    }

    // Clear cookie on client
    res.setHeader('Set-Cookie', 'token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Secure');

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
}
