import { FilterQuery, UpdateQuery } from "mongoose";
import PostModel, { PostDocument, PostInit } from "../models/post.model";
import UserModel, { UserDocument } from "../models/user.model";
import logger from "../utils/logger";

export async function createPost(input: PostInit) {
  try {
    return await PostModel.create(input);
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function getUserPosts(userId: string) {
  // Retrieve user
  const user: UserDocument | null = await UserModel.findById(userId)
    .select("posts")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  //
  // const userPosts = user.posts.map(post => {
  //     return await PostModel.findById(post).select()
  // })
}

export async function findPosts(query: FilterQuery<PostDocument>) {
  //   const posts = await PostModel.find(query).lean();
  const posts = await PostModel.find(query).sort({ createdAt: 1 }).lean();
  //   logger.info({ posts: posts }, "-Service: Posts");

  const formattedPosts = await Promise.all(
    posts.map(async (post) => {
      const postUser = await UserModel.findById(post.user)
        .select("_id firstName lastName profilePicture")
        .lean();

      if (!postUser) {
        throw new Error("User does not exist");
      }

      const { user, ...postWithoutUser } = post;
      return {
        ...postWithoutUser,
        userId: postUser._id,
        userFirstName: postUser.firstName,
        userLastName: postUser.lastName,
        userProfilePicture: postUser.profilePicture,
      };

      // return {
      //   _id: post._id,
      //   description: post.description,
      //   picture: post.picture,
      //   likes: post.likes,
      //   comments: post.comments,
      //   createdAt: post.createdAt,
      //   updatedAt: post.updatedAt,
      //   userId: postUser._id,
      //   userFirstName: postUser.firstName,
      //   userLastName: postUser.lastName,
      //   userProfilePicture: postUser.profilePicture,
      // };
    })
  );

  //   logger.info({ posts: formattedPosts }, "-Service: Formatted posts");
  return formattedPosts;
}

export async function updatePost(
  query: FilterQuery<PostDocument>,
  update: UpdateQuery<PostDocument>
) {
  return PostModel.updateOne(query, update);
}

export async function findPost(query: FilterQuery<PostDocument>) {
  return PostModel.findOne(query).lean();
}

export async function deletePost(query: FilterQuery<PostDocument>) {
  return PostModel.deleteOne(query);
}

export async function findPostAttribute(
  query: FilterQuery<PostDocument>,
  attribute: string
) {
  try {
    return await PostModel.find(query, { [attribute]: 1 })
      .lean()
      .exec();
  } catch (e) {
    logger.error(e);
    throw e;
  }
}
