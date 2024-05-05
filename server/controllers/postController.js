import Post from "../models/Post.js";
import asyncHandler from "express-async-handler";
import { io } from "../app.js";

// Retrieve posts from the database
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ dateCreated: -1 });
    // Emit serverTime event periodically
    setInterval(() => {
      io.emit("serverTime", { serverTime: new Date() });
    }, 1000); // Emit every second

    console.log("Retrieved posts successfully");
    res.send(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).send({ error: "Failed to retrieve posts" });
  }
};

// Save a new post to the database
export const savePost = asyncHandler(async (req, res, next) => {
  try {
    const { creatorName, creatorEmail, post } = req.body;
    const newPost = await Post.create({
      creatorName,
      creatorEmail,
      post,
      dateCreated: new Date(),
    });
    console.log("Saved successfully");

    // Broadcast the new post to Socket.IO clients
    io.emit("newPost", newPost);
    console.log("Emitted new post");

    res.status(200).send(newPost);
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(400).send({ error: "Failed to save post" });
  }
});
