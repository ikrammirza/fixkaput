import User from "../../models/User";
import cryptoJs from "crypto-js";
import connectDb from "../../middleware/mongoose";
import jwt from "jsonwebtoken";
import Cors from "cors";

// Initialize CORS middleware
const cors = Cors({
  methods: ["POST", "GET", "OPTIONS"],
  origin: "https://fixkaput.in", // Allow requests from this origin
  credentials: true,
});

// Helper function to run CORS middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

const handler = async (req, res) => {
  // Run CORS middleware
  await runMiddleware(req, res, cors);

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "No user found" });
    }

    // Decrypt the password
    const bytes = cryptoJs.AES.decrypt(user.password, process.env.AES_SECRET);
    const decryptedPass = bytes.toString(cryptoJs.enc.Utf8);

    // Validate email and password
    if (email === user.email && password === decryptedPass) {
      const token = jwt.sign(
        { email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
      );

      return res.status(200).json({ success: true, token });
    } else {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, error: "This method is not allowed" });
  }
};

export default connectDb(handler);
