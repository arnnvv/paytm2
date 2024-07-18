import { Context, Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { db, eq } from "@repo/db";
import { balance, onRampTransaction } from "@repo/db/schema";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");
app.use(cors());

app.post("/hdfcWebhook", async (c: Context) => {
  const { token, userId, amount } = await c.req.json();
  try {
    const check = await db.query.onRampTransaction.findFirst({
      where: (onRampTransaction, { eq, and }) =>
        and(
          eq(onRampTransaction.token, token),
          eq(onRampTransaction.userId, userId),
        ),
    });

    if (!check) {
      return c.json({
        error: "Transaction is already processed",
        status: 400,
      });
    }

    await db.transaction(async (tx): Promise<void> => {
      await tx
        .update(balance)
        .set({ amount: balance.amount + amount })
        .where(eq(balance.userId, userId));
      await tx
        .update(onRampTransaction)
        .set({ status: "Success" })
        .where(eq(onRampTransaction.token, token));
    });

    return c.json({ message: "Payment processed" }, 200);
  } catch (error) {
    return c.json({ error: `Something went wrong: ${error}` }, 411);
  }
});

export default handle(app);
