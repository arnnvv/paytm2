import express from "express";
import type { Request, Response } from "express";
import zod from "zod";
import jwt from "jsonwebtoken";
import Users, { Accounts } from "../db.ts";
import JWT_SECRET from "../config.ts";
import authenticate from "../authenticate.ts";
import type { AuthenticatedRequest } from "../authenticate.ts";

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

userRouter
  .route("/")
  .get(async (res: Response) => {
    res.json({ message: "Hello from /users" });
  })
  .put(authenticate, async (req: AuthenticatedRequest, res: Response) => {
    const { update } = req.body;
    if (!validateUpdate(update))
      return res.status(400).json({ message: "Invalid update" });
    try {
      await Users.findOneAndUpdate({ _id: req.userId }, update, {
        new: true,
      });
      return res.status(200).json({ message: "User Updated" });
    } catch (e) {
      console.error(`Error in Updating User: ${e}`);
      return res.status(500).json({ message: "Error in Updating User" });
    }
  });

userRouter.post("/signup", async (req: Request, res: Response) => {
  const { user } = req.body;
  if (!validateSignup(user))
    return res.status(400).json({ message: "Invalid Credentials" });
  try {
    const existingUser = await Users.findOne({ username: user.username });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const createUser = await Users.create({ user });
    const userId = createUser._id;
    await Accounts.create({
      userId,
      balance: Math.floor(Math.random() * 10000),
    });
    const token: string | undefined = jwt.sign({ userId }, JWT_SECRET);
    return res.status(200).json({ message: "User Created", token: token });
  } catch (error) {
    console.error(`Error in creating user: ${error}`);
    return res.status(500).json({
      message: `Error in creating user: ${error}`,
    });
  }
});

userRouter.post("/signin", async (req: Request, res: Response) => {
  const { user } = req.body;
  if (!validateLogin(user))
    return res.status(400).json({ message: "Invalid Credentials" });
  try {
    const existingUser = await Users.findOne({ username: user.username });
    if (!existingUser)
      return res.status(400).json({ message: "User does not exist" });
    if (existingUser.password !== user.password)
      return res.status(400).json({ message: "Invalid Credentials" });
    const userId = existingUser._id;
    const token: string | undefined = jwt.sign({ userId }, JWT_SECRET);
    return res.status(200).json({ message: "User Signed In", token: token });
  } catch (error) {
    console.error(`Error in signing in user: ${error}`);
    return res.status(500).json({
      message: `Error in signing in user: ${error}`,
    });
  }
});

userRouter
  .use(authenticate)
  .route("/bulk")
  .get(async (req: Request, res: Response) => {
    const { target } = req.query || "";
    try {
      const users = await Users.find({
        $or: [
          {
            firstName: {
              regex: target,
            },
            lastName: {
              regex: target,
            },
          },
        ],
      });
      return res.status(200).json({
        user: users?.map((user) => ({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        })),
      });
    } catch (error) {
      console.error(`Error in finding user: ${error}`);
      return res.status(500).json({
        message: `Error in finding user: ${error}`,
      });
    }
  });

export default userRouter;
