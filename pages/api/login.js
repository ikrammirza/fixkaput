import User from "../../models/User";
import cryptoJs from "crypto-js"; // Importing CryptoJS correctly
import connectDb from "../../middleware/mongoose";
import jwt from "jsonwebtoken";
import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
  methods: ['POST', 'GET', 'OPTIONS'],
  origin: 'https://fixkaput.com', // Allow requests from this origin
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

  if (req.method === "POST") {
    const { email, password } = req.body; // Destructure email and password from body

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "No user found" });
    }

    // Decrypt the password
    var bytes = cryptoJs.AES.decrypt(user.password, process.env.AES_SECRET);
    var decryptedPass = bytes.toString(cryptoJs.enc.Utf8);
    console.log(decryptedPass); // Consider removing this in production

    // Validate email and password
    if (email === user.email && password === decryptedPass) {
      var token = jwt.sign(
        { email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
      );

      // Return success response with token
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  } else {
    return res.status(405).json({ success: false, error: "This method is not allowed" });
  }
};

export default connectDb(handler);