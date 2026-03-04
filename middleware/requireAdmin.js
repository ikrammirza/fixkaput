import { parse } from "cookie";
import { getSession } from "../lib/redis";
import connectDb from "./mongoose";
import User from "../models/User";

export default function requireAdmin(handler) {
  return async (req, res) => {
    try {
      const rawCookie = req.headers?.cookie || "";
      const cookies = parse(rawCookie);
      const sessionId = cookies.sessionId;

      if (!sessionId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const decoded = await getSession(sessionId);
      if (!decoded) {
        return res.status(401).json({ error: "Session expired" });
      }

      await connectDb();
      const user = await User.findById(decoded._id);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: "Forbidden: Admins only" });
      }

      req.user = decoded;
      return handler(req, res);
    } catch (err) {
      console.error("Admin auth error:", err);
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}
