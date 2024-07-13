import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};

const app = new Hono<{ Bindings: Bindings }>();
app.use(cors());

app.post("/hdfcWebhook", async (c) => {
  const body = await c.req.json();
  const paymentInformation = {
    token: body.token,
    userId: body.user_identifier,
    amount: body.amount,
  };
  try {
  } catch (error) {
    throw new Error("Error while processing webhook");
  } finally {
  }
});

export default app;
