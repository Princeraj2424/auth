import express from "express";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from "./Routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 4000;

dotenv.config();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:4000',
}));

app.use(express.json());
app.use(express.urlencoded({extended:true})); 
app.use('/api/v1/users',userRouter);

app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Checked sucessfully"
    
    });
});





app.listen(process.env.PORT,()=>{

    console.log (`Server running on port ${PORT}`)

});