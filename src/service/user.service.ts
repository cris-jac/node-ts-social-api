import { omit } from "lodash";
import UserModel, { UserDocument, UserInit } from "../models/user.model";
import logger from "../utils/logger";
import { FilterQuery, UpdateQuery } from "mongoose";

// Register
export async function createUser(input: UserInit) {
  try {
    return await UserModel.create(input);
  } catch (e: any) {
    throw new Error(e);
  }
}

// Login
export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    logger.error("User not found");
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    logger.error("Invalid password");
    return false;
  }

  return omit(user.toJSON(), "password");
}

// Find User
export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

// Search User
export async function searchUser(
  query: FilterQuery<UserDocument>,
  field: string,
  direction: "asc" | "desc"
) {
  if (!field) {
    field = "_id";
  }

  if (!direction) {
    direction = "desc";
  }

  // logger.info("-Executing find with data: ", { query, field, direction });

  return UserModel.find(query)
    .sort({ [field]: direction })
    .lean();
}

// Update user
export async function updateUser(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>
) {
  return UserModel.updateOne(query, update);
}
