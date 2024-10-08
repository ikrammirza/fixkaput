// // pages/api/verify-otp.js
// import twilio from 'twilio';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const serviceId = process.env.TWILIO_SERVICE_ID;

// const client = twilio(accountSid, authToken);

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { phone, otp } = req.body;

//     if (!phone || phone.length !== 10 || !otp || otp.length !== 6) {
//       return res.status(400).json({ success: false, message: 'Invalid input' });
//     }

//     try {
//       // Use Twilio Verify service to check OTP
//       const verification = await client.verify.services(serviceId).verificationChecks.create({
//         to: `+91${phone}`, // Include country code if necessary
//         code: otp,
//       });

//       if (verification.status === 'approved') {
//         return res.status(200).json({ success: true, message: 'OTP verified successfully' });
//       } else {
//         return res.status(400).json({ success: false, message: 'Invalid OTP' });
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       return res.status(500).json({ success: false, message: 'Failed to verify OTP' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} not allowed`);
//   }
// }