import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";
// import { newBook } from "../controllers/newBook.js";

const router = express.Router();

// =-------------Creating Book---------------------------=
// router.post("/", protectRoute, newBook);
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!image || !title || !caption || !rating) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    let imageUrl;

    try {
      // Ensure image is a valid base64 string prefixed with MIME type
      console.log("Uploading image of length:", image.length);
      console.log("Image starts with:", image.substring(0, 30));
      const uploadResponse = await cloudinary.uploader.upload(image, {
        // upload_preset: "your_upload_preset_if_needed", // optional
      });
      imageUrl = uploadResponse.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      return res.status(500).json({ message: "Image upload failed" });
    }
    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await newBook.save();
    res.status(200).json(newBook);
  } catch (uploadError) {
    console.error(
      "Cloudinary Upload Error:",
      uploadError.message,
      uploadError.stack
    );
    return res
      .status(500)
      .json({ message: "Image upload failed: " + uploadError.message });
  }
});

//=---------------------to Getting the book----------------------------------=
router.get("/", protectRoute, async (req, res) => {
  //example call from react native front end
  // const response = await fetch (`http://localhost:3000/api/books?page=1&limit=5`);
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    // const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage"); // getting books in desending order

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in getting Book", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//=---------------------------DELETE Endpoint------------------------------=

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    //https://res.clodinary.com/de1rmsfmdk/image/up;oad/v3223re343/adsfdewgerw.png
    //delete image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }
    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error in getting Book", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//============-get recommeded books by the loggeed in user

router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(books);
  } catch (error) {
    console.log("Get users book error", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
