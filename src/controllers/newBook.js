import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";

const router = express.Router();

export const newBook = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!image || !title || !caption || !rating)
      return res.status(400).json({ message: "Please provide all fiels" });

    console.log("Cloudinary config check at upload time:");
    console.log({
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key,
      api_secret: cloudinary.config().api_secret ? "[HIDDEN]" : "❌ MISSING",
    });
    //upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;
    //save to the database
    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });
    console.log(
      "Posting book, Cloudinary Config:",
      process.env.CLOUDINARY_API_SECRET ? "[secret]" : "[no secret]"
    );

    await newBook.save();
    res.status(200).json(newBook);
  } catch (error) {
    console.log("Error creating Book", error);
    res.status(500).json({ message: error.message });
  }
};

export default router;
