import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRouter from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'
import userRouter from './routes/user.route.js'

import connectDb from './db/connectDb.js'


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use("/api/auth", authRouter)
app.use("/api/message", messageRoute)
app.use("/api/users", userRouter)

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    connectDb()
    console.log(`Server listen on port ${port}...`)
})