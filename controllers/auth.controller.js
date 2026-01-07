import prisma from "../prisma/prismaClient.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const userRegistered = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    console.log("Data is missing");
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashPassword,
      }
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

//Login User
export const userLogin= async(req, res)=>{

  const {email,password}= req.body;


  if (!email || !password){

    return res.status(400).json({
      success:false,
      message: "All fields are required"
    });

  }

  try{

    const user = await prisma.user.findUnique({
      where:{email}
    });
    if(!user){
      return res.status(400).json({
        success:false,
        message:"user not found"
      });
    }

    //compare the password

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(400).json({
        success:false,
        message:"invalid email or password"

      })
    }
    // create a Token for session management

    const token = jwt.sign(
      {id:user.id , role:user.role},
      process.env.JWT_SECRET,
      {expiresIn:'24h'}
    )

    //from here we can set cookie or send token in response

    const cookieOptions={
      httpOnly:true,
      expires:new Date(Date.now()+24*60*60*1000)
    };
    res.cookie('token',token,cookieOptions);
    return res.status(200).json({
      success:true,
      message:"Login successfull",
      user,
      id:user.id,
      token

    })

  } catch(error){
    console.error(error);
    return res.status(400).json({
      success:false,
      message:"something went wrong"
    });
  }
};











