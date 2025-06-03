import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import User from "../models/User.js";


const generateToken = (userId)=>{
    return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"15d"})
} 
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User doesn't exists" });
    //check for the password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    //generate token
    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
