import { ObjectId } from "mongoose";

export interface FormattedFriend {
  _id: ObjectId;
  //   _id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}
