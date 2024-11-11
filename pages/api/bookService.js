import connectDb from "../../middleware/mongoose"; // Import the database connection utility
import Order from "../../models/Order"; // Import the Order model
import { sendSMS } from "../../utils/smsService";

export default async function handler(req, res) {
  console.log("API handler called");
  if (req.method === "POST") {
      console.log("Received Data:", req.body); 
    try {
      await connectDb(); // Connect to the database

      const { oid, name, email, phone, address, cart, amount } = req.body;
      

      if (!name || !phone || !address || !cart) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate phone number (Indian format)
      const isValidPhone = (phone) => {
        const regex = /^(\+91)[6-9]\d{9}$/;
        return regex.test(phone);
      };
      if (!isValidPhone(phone)) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }

      // Save the order data to the database
      const newOrder = new Order({
        oid,
        name,
        email,
        phone,
        address,
        cart,
        amount,
        status: "Pending", // Initial status
      });

      await newOrder.save(); // Save the new order
      const servicesDetails = Object.values(cart)
        .map((service) => `${service.name} (Quantity: ${service.qty})`)
        .join(", ");

      const userMessage = `Dear ${name},\n\nThank you for choosing FixKaput...`;

      // Send message to user
      //await sendSMS(phone, userMessage);

      // Technician message with link to `partnerrequest.js`
      const technicianMessage = `Dear Technician,\n\nA new service request has been received... View requests: https://yourdomain.com/partnerrequest`;

      const technicianPhoneNumber = "+919381145944";
      //await sendSMS(technicianPhoneNumber, technicianMessage);

      // Emit WebSocket event
      

      return res.status(200).json({ message: "Booking successful!" });
    } catch (error) {
      console.error("Booking error:", error);
      return res
        .status(500)
        .json({ message: "Booking failed. Internal server error." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}







// if (res.socket?.server?.io) {
      //   console.log("Emitting new_booking event"); // Log to confirm event is triggered
      //   res.socket.server.io.emit("new_booking", {
      //     oid,
      //     name,
      //     phone,
      //     address,
      //     services: servicesDetails,
      //     amount,
      //     status: "Pending",
      //   });
      // } else {
      //   console.log("WebSocket not initialized on server");
      // }