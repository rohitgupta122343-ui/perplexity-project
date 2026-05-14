
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
app.use(cors({
    origin : ['https://perplexity-project-navy.vercel.app'],
    credentials : true
}))

app.use('/api/auth',authRouter)
app.use('/api/chats',chatRouter)

export default app