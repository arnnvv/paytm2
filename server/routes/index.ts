import express from "express";
import usersRouter from "./userRouter.ts";
import accountRouter from "./accountRouter.ts";
const router = express.Router();

router.use("/users", usersRouter);
router.use("/account", accountRouter);

export default router;
