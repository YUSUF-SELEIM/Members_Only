import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import route from "./routes/route.js";

dotenv.config({ path: '../.env' });
const PORT = process.env.PORT || 3000;

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from this origin
  credentials: true, // Allow credentials (cookies) to be included
  allowedHeaders: ['Content-Type','Set-Cookie'], // Allow the Content-Type header to be sent
  allowMethods: ['GET', 'POST', 'DELETE'], // Allow only GET, POST, and DELETE requests
}));

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));


// routes for api endpoints
app.use("/api", route);

const server = app.listen(3000, () => {
  console.log(`Server listening on port ${PORT}...`);
});

const io = new Server(server);
// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

export default io ;
