import { Request, Response } from "express";
import {
  createUser,
  findUser,
  getUserAttribute,
  getUserFriends,
  searchUser,
  updateUser,
} from "../service/user.service";
import logger from "../utils/logger";
import { omit } from "lodash";
import { CreateUserInput } from "../schema/user.schema";
import { SearchUserQuery } from "../types/searchUser.interface";
import { FilterQuery, Types, UpdateQuery } from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";
import { generateFilePath } from "../utils/generateFilePath";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    logger.info("User created");
    return res.send(omit(user.toJSON(), "password"));
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e);
  }
}

export async function searchUserHandler(
  req: Request<{}, {}, {}, SearchUserQuery>,
  res: Response
) {
  try {
    let { name, field, direction } = req.query;

    const nameStr = name || "";
    const fieldStr = field || "";
    const directionStr = direction || "desc";

    const query: FilterQuery<UserDocument> = {};
    if (nameStr) {
      query.$or = [{ firstName: nameStr }, { lastName: nameStr }];
    }

    // console.log("Query:", query);
    // console.log("Field:", fieldStr);
    // console.log("Direction:", directionStr);

    const result = await searchUser(
      // { $or: [{ firstName: name }, { lastName: name }] },
      query,
      fieldStr,
      directionStr
    );
    logger.info("Executed search users");
    return res.status(200).send(result);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e);
  }
}

export async function getUserHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const user = await findUser({ _id: id });
    logger.info("User retrieved");
    return res.send(omit(user, ["password", "updatedAt", "__v"]));
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e);
  }
}

export async function updateUserHandler(req: Request, res: Response) {
  try {
    console.log("- Exec update");
    const { id } = req.params;
    const update = req.body;

    // Check inputs
    if (!id || !update) {
      return res.status(400).send({ message: "Invalid request" });
    }
    const updatedUser = await updateUser({ _id: id }, { $set: update });

    // If there are no changes
    if (!updatedUser.modifiedCount) {
      return res.status(404).send({ message: "User not updated" });
    }

    const user = await findUser({ _id: id });

    logger.info("User updated");
    return res.send(omit(user, ["password", "updatedAt", "__v"]));
  } catch (e) {
    logger.error(e);
    return res.status(409).send(e);
  }
}

export async function updateProfilePictureHandler(req: Request, res: Response) {
  const { id } = req.params;
  const { filename } = req.file as Express.Multer.File;

  logger.info("Executed updateProfilePicture");
  try {
    const filePath = generateFilePath(filename);
    console.log(filePath);

    const updatedUser = await updateUser(
      { _id: id },
      { $set: { profilePicture: filePath } }
    );

    // If there are no changes
    if (!updatedUser.modifiedCount) {
      return res.status(404).send({ message: "User not updated" });
    }

    const user = await findUser({ _id: id });

    logger.info("ProfilePicture updated successfully");
    return res.status(200).send(omit(user, "password"));
  } catch (e) {
    logger.error(e);
    return res.status(409).send(e);
  }
}

export async function getUserFriendsHandler(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const user = await findUser({ _id: id });

    if (!user) {
      logger.error("User or friend not be found");
      return res
        .status(404)
        .send({ message: "User or friend could not be found" });
    }

    const formattedFriends = await getUserFriends(id);
    if (!formattedFriends.length) {
      logger.info("0 friends found");
      return res.status(200).send([]);
    }

    return res.status(200).send(formattedFriends);
  } catch (e) {
    logger.error(e);
    return res.status(404).send(e);
  }
}

export async function addRemoveFriendHandler(req: Request, res: Response) {
  try {
    const { id, friendId } = req.params;
    // const objId = new Types.ObjectId(id);
    // const objFriendId = new Types.ObjectId(friendId);

    const user = await findUser({ _id: id });
    const friend = await findUser({ _id: friendId });

    if (!user || !friend) {
      logger.error("User or friend not be found");
      return res
        .status(404)
        .send({ message: "User or friend could not be found" });
    }

    // Toggle friend in user list
    const friendExists = await findUser({
      _id: id,
      friends: { $in: [friendId] },
    });
    // if (!userExists) {
    //   user.friends.push(objFriendId);
    //   friend.friends.push(objId);
    // } else {
    //   user.friends.filter((id) => id === objFriendId);
    //   friend.friends.filter((id) => id === objId);
    // }
    // await user.save();
    // await friend.save();

    if (!friendExists) {
      await updateUser({ _id: id }, { $push: { friends: friendId } });
      await updateUser({ _id: friendId }, { $push: { friends: id } });
    } else {
      await updateUser({ _id: id }, { $pull: { friends: friendId } });
      await updateUser({ _id: friendId }, { $pull: { friends: id } });
    }
    logger.info("User friends updated");

    // Retrieve list of friends
    const formattedFriends = await getUserFriends(id);
    if (!formattedFriends.length) {
      logger.info("0 friends found");
      return res.status(200).send([]);
    }

    return res.status(200).send(formattedFriends);
  } catch (e) {
    logger.error(e);
    return res.status(404).send(e);
  }
}

export async function followUserHandler(req: Request, res: Response) {
  // utfId = userToFollowId
  const { id, utfId } = req.params;

  try {
    const user = await findUser({ _id: id });
    const userToFollow = await findUser({ _id: utfId });

    if (!user || !userToFollow) {
      logger.error("User or user to follow have not been found");
      return res
        .status(404)
        .send({ message: "User or user to follow have not been found" });
    }

    const isFollowing = await findUser({
      _id: id,
      following: { $in: [utfId] },
    });

    if (isFollowing) {
      // unfollow
      await updateUser({ _id: id }, { $pull: { following: utfId } });
      await updateUser({ _id: utfId }, { $pull: { followers: id } });
    } else {
      // follow
      await updateUser({ _id: id }, { $push: { following: utfId } });
      await updateUser({ _id: utfId }, { $push: { followers: id } });
    }

    // Get user following
    const userFollowing = await getUserAttribute({ _id: id }, "following");

    return res.status(200).send(userFollowing);
  } catch (e) {
    logger.error(e);
    return res.status(409).send(e);
  }
}

export async function getUserFollowingHandler(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const userFollowing = await getUserAttribute({ _id: id }, "following");

    if (!userFollowing) {
      logger.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).send(userFollowing);
  } catch (e) {
    logger.error(e);
    return res.status(404).send(e);
  }
}

export async function getUserFollowersHandler(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const userFollowers = await getUserAttribute({ _id: id }, "followers");

    if (!userFollowers) {
      logger.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).send(userFollowers);
  } catch (e) {
    logger.error(e);
    return res.status(404).send(e);
  }
}
