import { Express, Request, Response } from "express";
import {
  addRemoveFriendHandler,
  createUserHandler,
  followUserHandler,
  getUserFollowersHandler,
  getUserFollowingHandler,
  getUserFriendsHandler,
  getUserHandler,
  searchUserHandler,
  updateProfilePictureHandler,
  updateUserHandler,
} from "./controller/user.controller";
import validateResource from "./middleware/validateResource";
import { createUserSchema } from "./schema/user.schema";
import { createSessionSchema } from "./schema/session.schema";
import {
  createSessionHandler,
  deleteSessionHandler,
  getSessionHandler,
} from "./controller/session.controller";
import deserializeUser from "./middleware/deserializeUser";
import requireUser from "./middleware/requireUser";
import uploadImage from "./middleware/uploadImage";
import {
  createPostHandler,
  createPostWithImageHandler,
} from "./controller/post.controller";
import { createPostSchema } from "./schema/post.schema";

const routes = (app: Express) => {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);
  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createSessionHandler
  );
  app.get("/api/sessions", requireUser, getSessionHandler);
  app.delete(
    "/api/sessions",
    // deserializeUser,
    requireUser,
    deleteSessionHandler
  );

  app.get("/api/users/search", requireUser, searchUserHandler);
  app.get("/api/users/:id", getUserHandler);
  app.patch("/api/users/:id", updateUserHandler);

  app.patch(
    "/api/user-profile-picture/:id",
    uploadImage.single("profile-picture"),
    updateProfilePictureHandler
  );

  app.get("/api/users/:id/friends", getUserFriendsHandler);
  app.patch("/api/users/:id/:friendId", addRemoveFriendHandler);

  app.get("/api/users/:id/following", getUserFollowingHandler);
  app.get("/api/users/:id/followers", getUserFollowersHandler);
  app.patch("/api/users/:id/follow/:utfId", followUserHandler);

  app.post("/api/posts", validateResource(createPostSchema), createPostHandler);
  app.post(
    "/api/posts/i",
    uploadImage.array("picture", 10),
    validateResource(createPostSchema),
    createPostWithImageHandler
  );
};

export default routes;
