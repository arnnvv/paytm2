import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import JWT_SECRET from "./config.ts";

export interface AuthenticatedRequest extends Request {
  userId?: string | JwtPayload;
}

const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token: string | undefined = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded;
    next();
  } catch (e) {
    console.error(`Wrong Token Provided: ${e}`);
    return res.status(403).json({ message: "Access denied. Invalid token." });
  }
};

export default authenticate;
