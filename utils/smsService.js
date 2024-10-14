import twilio from "twilio";

const accountSid = "AC88752ba003e54d3b091d2813f0382419"; // Twilio Account SID
const authToken = "a01abf563a8b6cc140346da8d900da10"; // Twilio Auth Token
const twilioClient = twilio(accountSid, authToken);

export const sendSMS = async (to, message) => {
  try {
    await twilioClient.messages.create({
      body: message,
      from: +13148889196, // Your Twilio phone number
      to,
    });
    console.log("Message sent:", messageResponse.sid);
  } catch (error) {
    console.error("Failed to send SMS:", error);
    throw new Error("SMS sending failed");
  }
};
