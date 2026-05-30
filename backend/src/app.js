
import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'
import authRouter from './routers/authRouter.js'
import chatRouter from './routers/chatRouter.js'


const app = express()

app.use(express.json())  
app.use(cookieParser())
app.use(morgan("dev"))

const allowedOrigins = [
  'https://perplexity-project-navy.vercel.app',
  'capacitor://localhost',
  'http://localhost',
  'http://localhost:3000'
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    callback(new Error("Not allowed by CORS"))
  },
  credentials: true
}))

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});



app.use('/api/auth',authRouter)
app.use('/api/chats',chatRouter)

export default app