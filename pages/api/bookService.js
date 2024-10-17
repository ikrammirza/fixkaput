import { sendSMS } from "../../utils/smsService";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { oid, name, email, phone, address, cart, amount } = req.body;

      // Check for required fields
      if (!name || !phone || !address || !cart) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Phone number validation for Indian numbers (adjust regex as needed for other countries)
      const isValidPhone = (phone) => {
        const regex = /^(\+91)[6-9]\d{9}$/; // Indian phone number regex
        return regex.test(phone);
      };

      if (!isValidPhone(phone)) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }

      const servicesDetails = Object.values(cart)
        .map((service) => `${service.name} (Quantity: ${service.qty})`)
        .join(", ");

      const userMessage = `Dear ${name},\n\nThank you for choosing FixKaput.\nWe are pleased to inform you that your services have been successfully booked. Below are the details of your booking:\n\nServices Booked: ${servicesDetails}\nTotal Amount: ${amount}\n\nOur technician will reach out to you shortly to confirm the details and schedule your service.\n\nIf you have any questions or require further assistance, please do not hesitate to contact us.\n\nBest regards,\nThe FixKaput Team`;

      // Send message to user
      console.log("phone:", phone);
      await sendSMS(phone, userMessage);

      // Technician message
      const technicianPhoneNumber = "+919381145944";
      const technicianMessage = `Dear Technician,\n\nA new service request has been received from ${name} residing at ${address}.\n The customer's contact number is ${phone}.\n The following services have been booked: ${servicesDetails}.\n\nThank you for your assistance in fulfilling this request for FixKaput.\n\nBest regards,\nThe FixKaput Team`;

      // Send message to technician
      await sendSMS(technicianPhoneNumber, technicianMessage);

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
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
