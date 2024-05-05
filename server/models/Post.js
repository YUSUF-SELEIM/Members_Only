import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  creatorName: {
    type: String,
    required: true,
  },
  creatorEmail: {
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