

const express = require("express");
const router = express.Router();
const User = require("../models/usermodel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// 
const login= async(req,res)=>{

    const {email,password}=req.body;

    try{
        const user= await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const isMatch= await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token= jwt.sign({
            id:user._id,
            email:user.email
        },process.env.JWT_SECRET,{expiresIn:"1h"});

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res.status(200).json({message:"Login successful",user});

    }catch(err){
        return res.status(500).json({message:"Internal server error",error:err.message});
    }

}

const register= async (req,res)=>{

    const {username,email,password}=req.body;




    try{

  const user= await User.findOne({email});

   if(user){
    return res.status(400).json({message:"User already exists"});
   }
   const hashedPassword= await bcrypt.hash(password,12);
   const newUser= await User.create({
    username,
    email,
    password:hashedPassword
   });

   const token= jwt.sign({
    id:newUser._id,
    email:newUser.email
   },process.env.JWT_SECRET,{expiresIn:"1h"})

   res.cookie("token", token, {
       httpOnly: true,
       secure: true,
       sameSite: "none",
   });

   return res.status(201).json({message:"User registered successfully",user:newUser});

    }catch(err){
        return res.status(500).json({message:"Internal server error",error:err.message});

    }


}

const logout= (req,res)=>{
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    return res.status(200).json({message:"Logout successful"});
}

const getMe= (req,res)=>{

    const user=req.user;

    return res.status(200).json({message:"User fetched successfully",user});


}
module.exports = {login,register,logout,getMe};