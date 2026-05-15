// import dotenv from 'dotenv'
// dotenv.config()

// import dns from 'dns'
// dns.setDefaultResultOrder('ipv4first')

// import nodemailer from 'nodemailer'
// import { google } from 'googleapis'

// const OAuth2 = google.auth.OAuth2

// const oauth2Client = new OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   "https://developers.google.com/oauthplayground"
// )

// oauth2Client.setCredentials({
//   refresh_token: process.env.GOOGLE_REFRESH_TOKEN
// })

// async function createTransport() {

//   const accessToken = await oauth2Client.getAccessToken()

//   console.log("✅ ACCESS TOKEN CREATED")

//   return nodemailer.createTransport({

//     host: 'smtp.gmail.com',

//     port: 465,

//     secure: true,

//     family: 4,

//     auth: {
//       type: 'OAuth2',

//       user: process.env.GOOGLE_USER,

//       clientId: process.env.GOOGLE_CLIENT_ID,

//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,

//       refreshToken: process.env.GOOGLE_REFRESH_TOKEN,

//       accessToken: accessToken.token
//     },

//     connectionTimeout: 10000,
//     greetingTimeout: 10000,
//     socketTimeout: 10000
//   })
// }

// export async function sendEmail({ to, subject, html }) {

//   try {

//     const transport = await createTransport()

//     const res = await transport.sendMail({
//       from: process.env.GOOGLE_USER,
//       to,
//       subject,
//       html
//     })

//     console.log("✅ MAIL SENT:", res.messageId)

//   } catch (err) {

//     console.log("❌ EMAIL ERROR:", err)
//   }
// }


import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({ to, subject, html }) {

  try {

    const data = await resend.emails.send({

      from: 'Rohit Gupta <onboarding@resend.dev>',

      to,

      subject,

      html
    })

    console.log("✅ EMAIL SENT:", data)

    return data

  } catch (err) {

    console.log("❌ EMAIL ERROR:", err)
  }
}