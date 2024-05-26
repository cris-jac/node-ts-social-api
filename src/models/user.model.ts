import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Used for create user
export interface UserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  profilePicture: string;
  bio: string;
  posts: mongoose.Types.ObjectId[];
  friends: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(passwordToCheck: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Opt 1
// userSchema.pre("save", async function (next) {
//   let user = this as UserDocument;

//   if (!user.isModified("password")) {
//     return next();
//   }
// });

// Opt 2
userSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(9); // salt work factor = 9

  const hash = await bcrypt.hashSync(this.password, salt);

  this.password = hash;

  return next();
});

// compare password
userSchema.methods.comparePassword = async function (passwordToCheck: string) {
  const user = this as UserDocument;

  return bcrypt.compare(passwordToCheck, user.password).catch((e) => false);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
