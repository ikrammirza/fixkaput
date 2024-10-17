// pages/api/verifyotp.js
import { MongoClient } from "mongodb";

// MongoDB connection
const uri = process.env.MONGO_URI; // MongoDB connection string from your .env
let client;

async function connectToDatabase() {
  if (!client) {
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return client.db("otp_db"); // Change to your database name
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { phone, otp } = req.body;

    try {
      const db = await connectToDatabase();
      const storedOtpData = await db.collection("otps").findOne({ phone });

      if (storedOtpData && storedOtpData.otp === otp) {
        // OTP matches, authentication is successful
        const token = "dummy-auth-token"; // Replace with real token generation

        // Clear OTP from MongoDB after successful verification
        await db.collection("otps").deleteOne({ phone });

        return res.status(200).json({ success: true, token });
      } else {
        // OTP doesn't match
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error verifying OTP." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
