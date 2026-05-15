
import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'
import authRouter from './routers/authRouter.js'
import chatRouter from './routers/chatRouter.js'
import { sendEmail } from './services/mail.services.js'


const app = express()

app.use(express.json())  
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin: 'https://perplexity-project-navy.vercel.app',
    credentials: true
}))

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.get("/test-mail", async (req, res) => {

  try {

    await sendEmail({
      to: "yourmobilegmail@gmail.com",
      subject: "Mobile Test",
      html: "<h1>Email working on mobile 🚀</h1>"
    })

    res.send("EMAIL SENT")

  } catch (err) {

    console.log(err)

    res.send("FAILED")
  }
})

app.use('/api/auth',authRouter)
app.use('/api/chats',chatRouter)

export default app