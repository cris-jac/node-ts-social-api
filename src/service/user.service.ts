import { omit } from "lodash";
import UserModel, { UserDocument, UserInit } from "../models/user.model";
import logger from "../utils/logger";
import { FilterQuery, ObjectId, UpdateQuery } from "mongoose";
import { FormattedFriend } from "../types/formattedFriend.interface";

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

// Get user friends
export async function getUserFriends(
  userId: string
): Promise<FormattedFriend[]> {
  try {
    // Retrieve user friends
    // const friendsIds = UserModel.find({ _id: id }, { friends: true });
    const user: UserDocument | null = await UserModel.findById(userId)
      .select("friends")
      .lean();

    if (!user || !user.friends.length || !Array.isArray(user.friends)) {
      return [];
    }

    // Fetch friends relevant attributes
    const friendsProps = await Promise.all(
      user.friends.map(async (friendId) => {
        // const f = await UserModel.findById(friendId)
        //   .select("_id firstName lastName profilePicture")
        //   .lean();
        // return f
        //   ? {
        //       _id: f._id,
        //       lastName: f.lastName,
        //       firstName: f.firstName,
        //       profilePicture: f.profilePicture,
        //     }
        //   : null;
        return await UserModel.findById(friendId)
          .select("_id firstName lastName profilePicture")
          .lean();
      })
    );

    // Map friends

    const formattedFriends: FormattedFriend[] = friendsProps.map((friend) => ({
      _id: friend?._id!,
      lastName: friend?.lastName!,
      firstName: friend?.firstName!,
      profilePicture: friend?.profilePicture!,
    }));
    // const formattedFriends: FormattedFriend[] = friendsProps.filter(
    //   Boolean
    // ) as FormattedFriend[];

    return formattedFriends;
  } catch (e) {
    logger.error(e);
    throw e;
  }
}

export async function getUserAttribute(
  query: FilterQuery<UserDocument>,
  attr: string
) {
  try {
    return await UserModel.find(query, { [attr]: 1 })
      .lean()
      .exec();
  } catch (e) {
    logger.error(e);
    throw e;
  }
}
