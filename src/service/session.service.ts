import { FilterQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";

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
