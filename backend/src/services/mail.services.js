import dotenv from 'dotenv'
dotenv.config()



import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,

  secure: false,
  auth: {
    type: "OAuth2",

    user: process.env.GOOGLE_USER,

    clientId: process.env.GOOGLE_CLIENT_ID,

    clientSecret: process.env.GOOGLE_CLIENT_SECRET,

    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify()
  .then(() => {
    console.log("Email transporter is ready");
  })
  .catch((err) => {
    console.log("Transporter Error:", err);
  });

export async function sendEmail({ to, subject, html }) {

  try {

    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
    };

    const details = await transporter.sendMail(mailOptions);

    console.log("Email Sent:", details);

    return details;

  } catch (err) {

    console.log("EMAIL ERROR:", err);

    throw err;
  }
}


// import dotenv from 'dotenv'
// dotenv.config()

// import { Resend } from 'resend'

// const resend = new Resend(process.env.RESEND_API_KEY)

// export async function sendEmail({ to, subject, html }) {

//   try {

//     const data = await resend.emails.send({

//       from: 'onboarding@resend.dev',

//       to,

//       subject,

//       html
//     })

//     console.log("✅ EMAIL SENT:", data)

//     return data

//   } catch (err) {

//     console.log("❌ EMAIL ERROR:", err)
//   }
// }