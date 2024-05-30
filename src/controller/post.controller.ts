import { Request, Response } from "express";
import logger from "../utils/logger";
import { createPost } from "../service/post.service";
import { omit } from "lodash";
import { CreatePostInput } from "../schema/post.schema";
import { generateFilePath } from "../utils/generateFilePath";
import { Multer } from "multer";
import { updateUser } from "../service/user.service";

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
