import Otp from "../models/otp.js"
import { sendMail } from "../utils/sendMail.js";
import { User } from "../models/user.models.js";



export async function requestOtpController(req, res) {
  const { firstName, lastName, email, number, password } = req.body;

  if (!email || !firstName || !lastName || !number || !password)
    return res.status(400).json({ success: false, message: "All fields are required" });

  const existedUser = await User.findOne({ email: email.toLowerCase() });
  if (existedUser)
    return res.status(400).json({ success: false, message: "Email already exists" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    { upsert: true }
  );

  await sendMail(email, `Your OTP for TechBro24 signup is: ${otp}`);

  res.status(200).json({ success: true, message: "OTP sent to your email." });
}


