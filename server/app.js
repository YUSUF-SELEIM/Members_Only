import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import route from "./routes/route.js";

dotenv.config({ path: '../.env' });
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app, {
  cors: {
    origin: "http://localhost:3001"
  }
});
const io = new Server(server);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from this origin
  credentials: true, // Allow credentials (cookies) to be included
}));

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
// routes for api endpoints
app.use("/api", route);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

export default io ;
