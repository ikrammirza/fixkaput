import connectDb from "../../middleware/mongoose";
import Order from "../../models/Order";
import { sendSMS } from "../../utils/smsService"; // Utility function to send SMS
import { Server } from 'socket.io';

let io;

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectDb();

      if (!io && res.socket?.server && !process.env.TEST_ENV) {
        io = new Server(res.socket.server);
      }

      const { oid, name, email, phone, address, cart, amount } = req.body;

      if (!name || !phone || !address || !cart) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Optional: Validate inner address structure (optional but improves safety)
      const { area, line1, city, pincode } = address;
      if (!area || !line1 || !city || !pincode) {
        return res.status(400).json({ message: "Incomplete address details" });
      }

      const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);
      if (!isValidPhone(phone)) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }

      const newOrder = new Order({
        oid,
        name,
        email,
        phone,
        address: {
          area,
          line1,
          city,
          pincode,
        },
        cart,
        amount,
      });

      await newOrder.save();

      const isTestEnv = process.env.TEST_ENV === 'true';
      if (!isTestEnv && io) {
        io.emit('newOrder', newOrder);
      }

      // ✅ Send SMS to technician and customer (now active)
      const technicianMessage = `New service request: ${name} at ${area}, ${city}. View details: https://fixkaput.com/partnerrequest`;
      const technicianPhoneNumber = "+919381145944";

      const customerMessage = `Dear ${name}, your service request has been received. A technician will contact you soon.`;
      const normalizedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

      if (!isTestEnv) {
        try {
          await sendSMS(technicianPhoneNumber, technicianMessage);
          await sendSMS(normalizedPhone, customerMessage);
        } catch (smsError) {
          console.error("SMS sending failed:", smsError);
          // Don't block booking just because of SMS failure
        }
      }

      return res.status(200).json({ message: "Booking successful!" });
    } catch (error) {
      console.error("Booking error:", error);
      return res.status(500).json({ message: "Booking failed. Internal server error." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
