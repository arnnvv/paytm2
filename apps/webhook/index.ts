import "./global-polyfill";
import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import { db, eq } from "@repo/db/client";
import { cors } from "hono/cors";
import { balance, onRampTransaction } from "@repo/db/schema";

interface Bindings {
  DATABASE_URL: string;
}

const app = new Hono<{ Bindings: Bindings }>();
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

const port: number = 3002;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
