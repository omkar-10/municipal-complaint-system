import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complainRoutes.js";

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

dotenv.config();

const app = express();

// Serve static files from "uploads" directory
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server started on PORT: ${PORT}`);
  });
});
