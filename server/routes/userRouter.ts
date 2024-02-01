import express from "express";
import zod from "zod";
import jwt from "jsonwebtoken";
import Users, { Accounts } from "../db.ts";
import JWT_SECRET from "../config.ts";
import authenticate from "../authenticate.ts";

const userRouter = express.Router();

interface User {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  _id?: string;
}

const validateSignup = async (user: User) => {
  const signupScheema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstName: zod.string().min(3),
    lastName: zod.string().min(3),
  });
  const ans = await signupScheema.safeParseAsync(user);
  return ans.success;
};

const validateLogin = async (user: User) => {
  const loginScheema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
  });
  const ans = await loginScheema.safeParseAsync(user);
  return ans.success;
};

const validateUpdate = async (user: User) => {
  const updateScheema = zod.object({
    password: zod.string().min(6).optional(),
    firstName: zod.string().min(3).optional(),
    lastName: zod.string().min(3).optional(),
  });
  const ans = await updateScheema.safeParseAsync(user);
  return ans.success;
};

export default userRouter;
