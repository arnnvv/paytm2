import { pgEnum } from "drizzle-orm/pg-core";

export const authEnum = pgEnum("authEnum", ["Google", "Github"]);
export const onRampStatusEnum = pgEnum("onRampStatusEnum", [
  "Success",
  "Failure",
  "Processing",
]);
