import Otp from "../models/otp.js";
import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs"


export async function verifyOtpController(req, res) {
  const { firstName, lastName, email, number, password, otp } = req.body;

  const record = await Otp.findOne({ email });
  if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
  }

 const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({ email: email.toLowerCase(), firstName, lastName, number, password: hashedPassword });
  const token = await user.generateAuthToken();

  await Otp.deleteOne({ email });

  res.status(200).json({
    success: true,
    token,
    user: { firstName: user.firstName, lastName: user.lastName, email: user.email },
  });
}


