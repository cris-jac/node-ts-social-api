import { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import { createSession } from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";

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
