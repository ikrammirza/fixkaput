// import twilio from 'twilio';

// // Twilio credentials (get these from your Twilio account)
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const serviceId = process.env.TWILIO_SERVICE_ID;

// const client = twilio(accountSid, authToken);

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { phone } = req.body;

//     // Add phone validation if needed
//     if (!phone || phone.length !== 10) {
//       return res.status(400).json({ success: false, message: 'Invalid phone number' });
//     }

//     try {
//       // Use Twilio Verify service to send OTP
//       await client.verify.services(serviceId).verifications.create({
//         to: `+91${phone}`, // Include country code if necessary
//         channel: 'sms',
//       });

//       return res.status(200).json({ success: true, message: 'OTP sent successfully' });
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       return res.status(500).json({ success: false, message: 'Failed to send OTP' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} not allowed`);
//   }
// }