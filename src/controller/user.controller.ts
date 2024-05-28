import { Request, Response } from "express";
import {
  createUser,
  findUser,
  searchUser,
  updateUser,
} from "../service/user.service";
import logger from "../utils/logger";
import { omit } from "lodash";
import { CreateUserInput } from "../schema/user.schema";
import { SearchUserQuery } from "../types/searchUser.interface";
import { FilterQuery, UpdateQuery } from "mongoose";
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
      return res.status(404).send({ message: "User not found" });
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
  const { filename } = req.file;

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
