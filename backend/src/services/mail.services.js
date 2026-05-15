import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

// test connection
transport.verify()
  .then(() => console.log("EMAIL READY ✅"))
  .catch((err) => console.log("EMAIL ERROR ❌", err));

export async function sendEmail({ to, subject, html }) {
  try {
    const res = await transport.sendMail({
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT ✅", res.messageId);
    return res;
  } catch (err) {
    console.log("EMAIL FAILED ❌", err);
    throw err;
  }
}