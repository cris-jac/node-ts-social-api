import mongoose from "mongoose";
import { UserDocument } from "./user.model";
import { customAlphabet } from "nanoid";

// const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface PostInit {
  user: UserDocument["_id"];
  description: string;
}

export interface PostDocument extends PostInit, mongoose.Document {
  picture: string;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    picture: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const PostModel = mongoose.model<PostDocument>("Post", postSchema);

export default PostModel;
