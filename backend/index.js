import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user/user.route.js'
import postRoute from './routes/post/post.route.js'


import path from 'path'
dotenv.config({});
const PORT = process.env.PORT; 


const __dirname = path.resolve()
const app = express();
app.get('/',(req,res)=>{
    return res.status(200).json({
        message:'I am coming from backend',
        success:'true'
    })
})
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));

// apis 
app.use('/api/v1/user',userRoute)
app.use('/api/v1/post',postRoute)

app.use(express.static(path.join(__dirname,'/frontend/dist')))
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
})
app.listen(PORT,()=>{
    connectDB();
    console.log(`server is running on port ${PORT}`);
})