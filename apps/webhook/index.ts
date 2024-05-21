import express, { Request, Response } from "express";
import db from "@repo/db/client";

const port: number = 3003;

const app = express();

app.use(express.json());

app.post("/hdfcWebhook", async (req: Request, res: Response) => {
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  //trnsactions
  try {
    const check = await db.onRampTransaction.findFirst({
      where: {
        token: paymentInformation.token,
        status: "Processing",
      },
    });

    if (!check) {
      return res.status(400).json({
        error: "Transaction is already processed",
      });
    }

    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: paymentInformation.userId,
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount),
          },
        },
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);

    res.json({
      message: "captured",
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(411).json({
      error: "Error while processing webhook",
    });
  } finally {
    await db.$disconnect();
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
