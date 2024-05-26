import { omit } from "lodash";
import UserModel, { UserInit } from "../models/user.model";
import logger from "../utils/logger";

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
