// const express = require('express')
import express from "express"
import cors from "cors";
import "dotenv/config"
// import authRoutes from "./routes/authRoutes.js"
import registerRoute from "./routes/registerRoute.js"
import loginRoute from "./routes/loginRoute.js"
import bookRoutes from "./routes/bookRoutes.js"
import { connectDB } from "./lib/db.js";

// connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors());
// app.use("/api/auth",authRoutes);
app.use("/api/auth",registerRoute);
app.use("/api/auth",loginRoute);
app.use("/api/books/",bookRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
    connectDB();
})


