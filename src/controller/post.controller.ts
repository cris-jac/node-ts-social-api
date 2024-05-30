import { Request, Response } from "express";
import logger from "../utils/logger";
import {
  createPost,
  deletePost,
  findPost,
  findPostAttribute,
  findPosts,
  updatePost,
} from "../service/post.service";
import { omit } from "lodash";
import { CreatePostInput } from "../schema/post.schema";
import { generateFilePath } from "../utils/generateFilePath";
import { Multer } from "multer";
import {
  findUser,
  getUserAttribute,
  updateUser,
} from "../service/user.service";
import { PostDocument } from "../models/post.model";

export async function createPostHandler(
  req: Request<{}, {}, CreatePostInput["body"]>,
  res: Response
) {
  try {
    // logger.info({ post: req.body }, "Post create");
    const { user } = req.body;

    // Create post
    const createdPost = await createPost(req.body);

    if (!createdPost) {
      logger.error("Post not created");
      return res.status(409).json({ message: "Post not created" });
    }

    // Add post to user
    const updatedUser = await updateUser(
      { _id: user },
      { $push: { posts: createdPost._id } }
    );

    if (!updatedUser) {
      logger.error("Post not added to user");
      return res.status(409).json({ message: "Post not added to user" });
    }

    logger.info("Post created");
    return res.send(omit(createdPost.toJSON()));
  } catch (e) {
    logger.error(e);
    return res.status(409).send(e);
  }
}

export async function createPostWithImageHandler(req: Request, res: Response) {
  const files = req.files as Express.Multer.File[];
  try {
    const { user } = req.body;

    if (!files) {
      logger.error("Empty images");
      return res.status(200).send([]);
    }

    // Process images
    const filesPaths = files?.map((file) => generateFilePath(file.filename));

    // Create post
    const createdPost = await createPost({ ...req.body, picture: filesPaths });

    if (!createdPost) {
      logger.error("Post not created");
      return res.status(409).json({ message: "Post not created" });
    }

    // Add post to user
    const updatedUser = await updateUser(
      { _id: user },
      { $push: { posts: createdPost._id } }
    );

    if (!updatedUser) {
      logger.error("Post not added to user");
      return res.status(409).json({ message: "Post not added to user" });
    }

    logger.info("Post created");
    return res.send(omit(createdPost.toJSON()));
  } catch (e) {
    logger.error(e);
    return res.status(409).send(e);
  }
}

export async function getUserPostsHandler(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const userExists = await findUser({ _id: userId });
    if (!userExists) {
      logger.error("User does not exist");
      return res.status(404).json({ message: "User does not exist." });
    }

    // Get posts
    const posts = await findPosts({ user: userId });

    logger.info("Posts retrieved");
    return res.status(200).send(posts);
  } catch (e) {
    logger.error(e);
    return res.status(409).send(e);
  }
}

export async function getPostsHandler(req: Request, res: Response) {
  try {
    const posts = await findPosts({});
    logger.info("Posts retrieved");
    return res.status(200).send(posts);
  } catch (e) {
    logger.error(e);
    return res.status(409).send(e);
  }
}

export async function updatePostHandler(req: Request, res: Response) {
  const { id } = req.params;
  const update = req.body;
  try {
    // Check inputs
    if (!id || !update) {
      return res.status(400).send({ message: "Invalid request" });
    }
    const updatedPost = await updatePost({ _id: id }, { $set: update });

    // If there are no changes
    if (!updatedPost.modifiedCount) {
      return res.status(404).send({ message: "Post not updated" });
    }

    const post = await findPost({ _id: id });
    logger.info("User updated");
    return res.status(200).send(post);
  } catch (e) {
    logger.error(e);
    return res.status(409).send(e);
  }
}

export async function deletePostHandler(req: Request, res: Response) {
  const { id } = req.params;

  try {
    // Get post
    const post: PostDocument | null = await findPost({ _id: id });
    if (!post) {
      logger.error("Post not found");
      return res.status(404).json({ message: "Post not found" });
    }

    // Remove post from user
    const updatedUser = await updateUser(
      { _id: post.user },
      { $pull: { posts: id } }
    );
    if (!updatedUser.modifiedCount) {
      logger.error("Post not deleted from user posts");
      return res
        .status(404)
        .json({ message: "Post not deleted from user posts" });
    }

    // Delete post
    const deletedPost = await deletePost({ _id: id });
    if (!deletedPost.acknowledged) {
      logger.error("Error while deleting the post");
      return res.status(200).json({ message: "Post deleted not acknowledged" });
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (e) {
    logger.error(e);
    return res.status(409).send(e);
  }
}

export async function likePostHandler(req: Request, res: Response) {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const postLiked = await findPost({ _id: id, likes: { $in: [userId] } });
    if (postLiked) {
      // unlike
      await updatePost({ _id: id }, { $pull: { likes: userId } });
    } else {
      // like
      await updatePost({ _id: id }, { $push: { likes: userId } });
    }

    const post = await findPostAttribute({ _id: id }, "likes");

    return res.status(200).send(post);
  } catch (e) {
    logger.error(e);
    return res.status(409).send(e);
  }
}
