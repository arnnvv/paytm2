import express from "express";
import type { Response } from "express";
import authenticate from "../authenticate.ts";
import { Accounts } from "../db.ts";
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

export default accountRouter;
