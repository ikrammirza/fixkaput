{
  /*const https = require("https");
const PaytmChecksum = require("paytmchecksum");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const paytmParams = {
      body: {
        requestType: "Payment",
        mid: process.env.NEXT_PUBLIC_PAYTM_MID,
        websiteName: "YOUR_WEBSITE_NAME", // Update this to your actual website name
        orderId: req.body.oid,
        callbackUrl: `${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`,
        txnAmount: {
          value: req.body.subTotal,
          currency: "INR",
        },
        userInfo: {
          custId: req.body.email,
        },
      },
    };

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      abcdef1234567890abc
    );
    paytmParams.head = {
      signature: checksum,
    };

    const post_data = JSON.stringify(paytmParams);

    const requestAsync = async () => {
      return new Promise((resolve, reject) => {
        const options = {
          hostname: process.env.PAYTM_HOST.replace(/^https?:\/\//, ''), // Remove protocol from PAYTM_HOST
          port: 443,
          path: `/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${req.body.oid}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": post_data.length,
          },
        };

        let response = "";
        const post_req = https.request(options, (post_res) => {
          post_res.on("data", (chunk) => {
            response += chunk;
          });

          post_res.on("end", () => {
            resolve(response);
          });
        });

        post_req.on("error", (error) => {
          reject(error);
        });

        post_req.write(post_data);
        post_req.end();
      });
    };

    const myr = await requestAsync();
    res.status(200).json(JSON.parse(myr));
  } catch (error) {
    console.error("Error during payment initiation:", error);
    res.status(500).json({ error: error.message });
  }
}
*/
}
import Order from "../../models/Order";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { cart } = req.body;
      const { pincode } = req.body;
      console.log("my cart is:", cart);
      console.log("my pincode is:", pincode);

      let order = new Order({
        oid: req.body.oid,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        pincode: pincode,
        amount: req.body.amount,
        products: cart,
      });
      console.log("Order saved:", order);
      await order.save();

      res.status(201).json({ success: true, order });
    } catch (error) {
      console.error("Error saving order:", error);
      res
        .status(500)
        .json({ success: false, message: "Order could not be saved", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};

export default connectDb(handler);
