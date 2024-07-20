import "./global-polyfill";
import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import { db, eq, pool } from "@repo/db/client";
import { cors } from "hono/cors";
import { balance, onRampTransaction } from "@repo/db/schema";

const app = new Hono();
app.use(cors());

app.post("/hdfcWebhook", async (c: Context) => {
  const { token, userId, amount } = await c.req.json();
  let connection;
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
    connection = await pool.connect();
    await connection.query("BEGIN");

    await db
      .update(balance)
      .set({ amount: balance.amount + amount })
      .where(eq(balance.userId, userId));
    await db
      .update(onRampTransaction)
      .set({ status: "Success" })
      .where(eq(onRampTransaction.token, token));

    await connection.query("COMMIT");
    return c.json({ message: "Payment processed" }, 200);
  } catch (error) {
    if (connection) await connection.query("ROLLBACK");
    return c.json({ error: `Something went wrong: ${error}` }, 411);
  } finally {
    if (connection) connection.release();
  }
});

const port = 3002;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
