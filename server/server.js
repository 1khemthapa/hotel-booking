import express from 'express'

import 'dotenv/config'
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWEbhooks.js';

connectDB()
const app=express()

app.use(cors())//Enable Cross Origin Resource Sharing

// Middleware
app.use(express.json())
app.use(clerkMiddleware())

//API to listen to clerk webhooks
app.use("/api/clerk",clerkWebhooks)

app.get('/',(req,res)=>res.send(" Api is working"))

const PORT=process.env.PORT ||5000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
