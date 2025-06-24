import jwt from 'jsonwebtoken';

export default function verifyToken(handler) {
  return async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // e.g., { phone: 'xxxxxxxxxx' }
      return handler(req, res);
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  };
}
