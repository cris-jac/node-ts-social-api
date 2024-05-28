import { Express, Request, Response } from "express";
import {
  createUserHandler,
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
};

export default routes;
