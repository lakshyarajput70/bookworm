import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";

const router = express.Router();

export const newBook = async(req,res)=>{
    try {
        const {title,caption,rating,image} = req.body;
        if(!image || !title || !caption || !rating)
            return res.status(400).json({message:"Please provide all fiels"});

        //upload image to cloudinary
        const uploadResponse = await cloudinaryary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;
        //save to the database
        const newBook = new Bookok({
            title,
            caption,
            rating,
            image:imageUrl,
            user:req.user._id
        })

        await newBook.save();
        res.status(200).json(newBook)


    } catch (error) {
        console.log("Error creating Book",error);
        res.status(500).json({message: error.message});
    }
};



export default router;