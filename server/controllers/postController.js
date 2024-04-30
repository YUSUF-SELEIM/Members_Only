import Post from "../models/Post.js";
import asyncHandler from "express-async-handler";

// retrieve messages from the database
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    console.log("Retrieved posts successfully");
    res.send(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).send({ error: "Failed to retrieve posts" });
  }
};
// save a new message to the database
export const savePost = asyncHandler(async (req, res, next) => {
    //begin from here
  try {
    const {post} = req.body;
    console.log(req.body);
    const newPost = await Post.create({
      creator :"author",
      title :"title",
      post,
      sendDate : new Date(),
    });
    console.log("Saved successfully");
    res.status(201).send(newPost);
  } catch (error) {
    console.error("Error saving POST:", error);
    res.status(400).send({ error: "Failed to save POST" });
  }
});
