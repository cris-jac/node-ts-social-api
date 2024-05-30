import PostModel, { PostInit } from "../models/post.model";

export async function createPost(input: PostInit) {
  try {
    return await PostModel.create(input);
  } catch (e: any) {
    throw new Error(e);
  }
}
