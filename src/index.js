// const express = require('express')
import express from "express"
import cors from "cors";
import "dotenv/config"
// import authRoutes from "./routes/authRoutes.js"
import registerRoute from "./routes/registerRoute.js"
import loginRoute from "./routes/loginRoute.js"
import bookRoutes from "./routes/bookRoutes.js"
import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js"

// connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

job.start();
// Increase request size limit to 10MB (you can adjust it)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// app.use(express.json())
app.use(cors({ origin: '*' }));
// app.use("/api/auth",authRoutes);
app.use("/api/auth",registerRoute);
app.use("/api/auth",loginRoute);
app.use("/api/books/",bookRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
    connectDB();
})


