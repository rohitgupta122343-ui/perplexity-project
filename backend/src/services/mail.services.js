import dotenv from 'dotenv'
dotenv.config()



// import nodemailer from "nodemailer";



// const transporter = nodemailer.createTransport({

//   service: "gmail",

//     port: 587,
//   secure: false,

//   family: 4, // ⭐ force IPv4

//   auth: {
//   user: process.env.GOOGLE_USER,
//   pass: process.env.GOOGLE_APP_PASSWORD,
// },
// });

// transporter.verify()
//   .then(() => {
//     console.log("Email transporter is ready");
//   })
//   .catch((err) => {
//     console.log("Transporter Error:", err);
//   });

// export async function sendEmail({ to, subject, html }) {

//   try {

//     const mailOptions = {
//       from: process.env.GOOGLE_USER,
//       to,
//       subject,
//       html,
//     };

//     const details = await transporter.sendMail(mailOptions);

//     console.log("Email Sent:", details);

//     return details;

//   } catch (err) {

//     console.log("EMAIL ERROR:", err);

//     throw err;
//   }
// }


// import dotenv from 'dotenv'
// dotenv.config()

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev", // testing domain
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT:", data);
    return data;

  } catch (err) {
    console.log("EMAIL ERROR:", err);
    throw err;
  }
}