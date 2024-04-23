import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import route from "./routes/route.js"; 

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from this origin
  credentials: true, // Allow credentials (cookies) to be included
}));

// connect to MongoDB
mongoose
  .connect("mongodb+srv://yusufabdelfattah207:xRcBV80rikJQvLaA@cluster0.jb173jl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// routes for api endpoints
app.use("/api", route);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});