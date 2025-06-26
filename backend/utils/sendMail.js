import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendMail(to, text) {
  return transporter.sendMail({
    from: '"TechBro24" <noreply@techbro24.com>',
    to: to,
    subject: 'OTP Verification',
    text: text
  });
}

