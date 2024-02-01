import express from "express";
import cors from "cors";

const port: number = 3000;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
