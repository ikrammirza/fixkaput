import { sendSMS } from "../../utils/smsService";
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { oid, name, email, phone, address, cart, amount } = req.body;
      if (!name || !phone || !address || !cart) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const servicesDetails = Object.values(cart)
        .map((service) => {
          return `${service.name} (Quantity: ${service.qty})`;
        })
        .join(", ");

      // Simulate technician message
      const technicianPhoneNumber = "+919381145944";
      const technicianMessage = `\n\nDear Technician,\n\nA new service request has been received from ${name} residing at ${address}.\n The customer's contact number is ${phone}.\n The following services have been booked: ${servicesDetails}.\n\nThank you for your assistance in fulfilling this request for FixKaput.\n\nBest regards,\nThe FixKaput Team`;

      // Sending technician message
      sendSMS(technicianPhoneNumber, technicianMessage).catch((error) => {
        console.error("Failed to send technician message:", error);
      });

      const userMessage = `Dear ${name},\n\nThank you for choosing FixKaput.\nWe are pleased to inform you that your services have been successfully booked. Below are the details of your booking:\n\nServices Booked: ${servicesDetails}\nTotal Amount: ${amount}\n\nOur technician will reach out to you shortly to confirm the details and schedule your service.\n\nIf you have any questions or require further assistance, please do not hesitate to contact us.\n\nBest regards,\nThe FixKaput Team`;

      // Sending user message
      sendSMS(phone, userMessage).catch((error) => {
        console.error("Failed to send user message:", error);
      });

      // Respond back with success
      return res.status(200).json({ message: "Booking successful!" });
    } catch (error) {
      console.error("Booking error:", error);
      return res
        .status(500)
        .json({ message: "Booking failed. Internal server error." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}