import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    logger.error("User required but not found");
    return res.sendStatus(403);
  }

  return next();
};

export default requireUser;
