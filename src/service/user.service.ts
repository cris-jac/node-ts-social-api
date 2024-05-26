import UserModel, { UserInit } from "../models/user.model";

export async function createUser(input: UserInit) {
  try {
    return await UserModel.create(input);
  } catch (e: any) {
    throw new Error(e);
  }
}
