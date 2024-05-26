import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey: any = process.env.SECRET_KEY;

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, secretKey, {
    ...(options && options),
    algorithm: "HS256",
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return {
      valid: true,
      expired: false,
      decoded: decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message == "jwt expired",
      decoded: null,
    };
  }
}
