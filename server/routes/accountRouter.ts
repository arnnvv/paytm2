import express from "express";
import type { Response } from "express";
import authenticate from "../authenticate.ts";
import { Accounts } from "../db.ts";
import mongoose from "mongoose";
import type { AuthenticatedRequest } from "../authenticate.ts";

const accountRouter = express.Router();

accountRouter
  .use(authenticate)
  .route("/balance")
  .get(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const account = await Accounts.findOne({ userId: req.userId });
      if (!account)
        return res.status(404).json({ message: "Account not found" });
      return res.status(200).json({
        message: `Balance fetched: ${account.balance}`,
        balance: account.balance,
      });
    } catch (e) {
      console.error(`Error in fetching Balance: ${e}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

accountRouter
  .use(authenticate)
  .route("/transfer")
  .post(async (req: AuthenticatedRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { amount, to } = req.body;
    try {
      const account = await Accounts.findOne({ userId: req.userId }).session(
        session,
      );
      if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Insufficient Balance" });
      }
      await Accounts.findOneAndUpdate(
        { userId: req.userId },
        {
          $inc: { balance: -amount },
        },
      ).session(session);
      await Accounts.findOneAndUpdate(
        { userId: to },
        {
          $inc: { balance: amount },
        },
      ).session(session);
      await session.commitTransaction();
      return res.status(200).json({ message: "Transaction Successful" });
    } catch (e) {
      console.error(`Error in transfer: ${e}`);
      return res.status(500).json({ message: "Internal Server Error" });
    } finally {
      session.endSession();
    }
  });

export default accountRouter;
