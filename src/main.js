import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server listen on port ${port}...`)
})