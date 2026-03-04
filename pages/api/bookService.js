import connectDb from "../../middleware/mongoose";
import Order from "../../models/Order";
import { sendSMS } from "../../utils/smsService";
import { getSocket } from "../../lib/socket";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectDb();

    const { name, phone, address, cart, amount } = req.body;

    if (!name || !phone || !address || !cart) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { area, line1, city, pincode } = address;
    if (!area || !line1 || !city || !pincode) {
      return res.status(400).json({ message: "Incomplete address details" });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ message: "Pincode must be 6 digits" });
    }

    const oid = uuidv4();

    const newOrder = new Order({
      oid,
      name,
      phone,
      address: { area, line1, city, pincode },
      cart,
      amount,
    });

    const savedOrder = await newOrder.save();

    const io = getSocket();
    const isTestEnv = process.env.TEST_ENV === "true";
    if (!isTestEnv && io) {
      io.emit("newOrder", savedOrder.toObject());
    }

    const technicianPhoneNumber = process.env.TECHNICIAN_NOTIFY_PHONE;
    const technicianMessage = `New service request: ${name} at ${area}, ${city}. View details: https://fixkaput.in/partnerrequest`;
    const customerMessage = `Dear ${name}, your service request has been received. A technician will contact you soon.`;
    const normalizedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

    if (!isTestEnv && technicianPhoneNumber) {
      try {
        await sendSMS(technicianPhoneNumber, technicianMessage);
        await sendSMS(normalizedPhone, customerMessage);
      } catch (smsError) {
        console.error("SMS sending failed:", smsError);
      }
    }

    return res.status(200).json({ message: "Booking successful!" });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ message: "Booking failed. Internal server error." });
  }
}
