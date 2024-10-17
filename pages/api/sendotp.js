// pages/api/sendotp.js
import twilio from "twilio";
import { MongoClient } from "mongodb";

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

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
    const { phone } = req.body;

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // Store OTP in MongoDB
      const db = await connectToDatabase();
      await db.collection("otps").updateOne(
        { phone },
        { $set: { otp, createdAt: new Date() } },
        { upsert: true } // Insert if not exists
      );

      // Send OTP via Twilio
      await twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`, // Add appropriate country code
      });

      return res.status(200).json({ success: true, message: "OTP sent!" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
