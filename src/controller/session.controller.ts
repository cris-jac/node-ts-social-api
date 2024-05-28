import { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";

// Create session
export async function createSessionHandler(req: Request, res: Response) {
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  const session = await createSession(
    user._id.toString(),
    req.get("user-agent") || ""
  );

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: "15m" }
  );

  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: "1w" }
  );

  return res.send({ accessToken, refreshToken });
}

// Get sessions
export async function getSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

// Delete session (logical)
export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
