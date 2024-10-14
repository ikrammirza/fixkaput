import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token
const twilioClient = twilio(accountSid, authToken);

export const sendSMS = async (to, message) => {
  try {
    await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber, // Your Twilio phone number
      to,
    });
    console.log("Message sent:", messageResponse.sid);
  } catch (error) {
    console.error("Failed to send SMS:", error);
    throw new Error("SMS sending failed");
  }
};
