import User from "../../models/User";
import cryptoJs from "crypto-js"; // Importing CryptoJS correctly
import connectDb from "../../middleware/mongoose";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method === "POST") {
    let user = await User.findOne({ email: req.body.email });

    // Check if user exists
    if (!user) {
      return res.status(200).json({ success: false, error: "No user found" });
    }

    var bytes = cryptoJs.AES.decrypt(user.password, process.env.AES_SECRET);
    var decryptedPass = bytes.toString(cryptoJs.enc.Utf8); // Use directly without JSON.parsec
    console.log(decryptedPass);
    // Validate email and password
    if (req.body.email === user.email && req.body.password === decryptedPass) {
      var token = jwt.sign(
        { email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
      );

      // Add expiration time
      return res.status(200).json({ success: true, token });
    } else {
      return res
        .status(200)
        .json({ success: false, error: "Invalid credentials" });
    }
  } else {
    return res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler);

