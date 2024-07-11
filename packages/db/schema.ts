import {
  integer,
  pgEnum,
  pgTableCreator,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator(
  (name: string): string => `paytm_${name}`,
);

export const authEnum = pgEnum("authEnum", ["Google", "Github"]);
export const onRampStatusEnum = pgEnum("onRampStatusEnum", [
  "Success",
  "Failure",
  "Processing",
]);

export const users = createTable("users", {
  id: varchar("id", { length: 21 }).primaryKey(),
  name: varchar("name"),
  email: varchar("email", { length: 255 }).unique().notNull(),
  number: varchar("number").unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export type Users = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = createTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 21 })
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const merchant = createTable("merchant", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email").unique(),
  name: varchar("name"),
  authType: authEnum("authEnum").notNull(),
});

export const onRampTransaction = createTable("onramp_transaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: onRampStatusEnum("onRampStatusEnum").notNull(),
  token: varchar("token").unique().notNull(),
  provider: varchar("provider").notNull(),
  amount: integer("amount").notNull(),
  startTime: timestamp("start_time").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});

export const balance = createTable("balance", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: integer("amount").notNull(),
  locked: integer("locked").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});

export const p2pTransfer = createTable("p2p_transfer", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: integer("amount").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  fromUserId: uuid("from_user_id")
    .notNull()
    .references(() => users.id),
  toUserId: uuid("to_user_id")
    .notNull()
    .references(() => users.id),
});
