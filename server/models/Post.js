import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  dateCreated: Date,
});

export default mongoose.model("Post", postSchema);