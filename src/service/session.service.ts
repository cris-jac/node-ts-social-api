import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { get } from "lodash";
import logger from "../utils/logger";
import { findUser } from "./user.service";

// Create session
export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({
    user: userId,
    userAgent: userAgent,
  });

  return session.toJSON();
}

// Find sessions
export async function findSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel.find(query).lean();
}

// Update session
export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

// Re-sign a token for session
export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken);
  console.log(decoded);
  if (!decoded || !get(decoded, "session")) {
    logger.error("Session ID not found");
    return false;
  }

  const session = await SessionModel.findById(get(decoded, "session"));
  console.log(session);

  if (!session || !session.valid) {
    logger.error("Session is not valid");
    return false;
  }

  const user = await findUser({ _id: session.user });

  if (!user) {
    logger.error("Session User not found");
    return false;
  }

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: "15m" }
  );

  return accessToken;
}
