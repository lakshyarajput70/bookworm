// import {v2 as cloudinary} from "cloudinary";
// import "dotenv/config"

// lib/cloudinary.js
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

console.log(
  "🔐 Cloudinary Env Check:",
  {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ EXISTS" : "❌ MISSING",
  }
);


export default cloudinary;