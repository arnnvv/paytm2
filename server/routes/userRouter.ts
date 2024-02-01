import express from "express";
import zod from "zod";
import jwt from "jsonwebtoken";
import JWT_SECRET from "../config.ts";

const userRouter = express.Router();

export default userRouter;
