import { Many, One, relations } from "drizzle-orm";
import {
  bigint,
  integer,
  PgColumn,
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
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"),
  email: varchar("email").unique().notNull(),
  number: varchar("number").unique(),
  password: varchar("password").notNull(),
});

export const sessions = createTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(
      (): PgColumn<
        {
          name: "id";
          tableName: "users";
          dataType: "string";
          columnType: "PgUUID";
          data: string;
          driverParam: string;
          notNull: true;
          hasDefault: true;
          isPrimaryKey: true;
          isAutoincrement: false;
          hasRuntimeDefault: false;
          enumValues: undefined;
          baseColumn: never;
          generated: undefined;
        },
        {},
        {}
      > => users.id,
    ),
  expires: bigint("expires", {
    mode: "number",
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
    .references(
      (): PgColumn<
        {
          name: "id";
          tableName: "users";
          dataType: "string";
          columnType: "PgUUID";
          data: string;
          driverParam: string;
          notNull: true;
          hasDefault: true;
          isPrimaryKey: true;
          isAutoincrement: false;
          hasRuntimeDefault: false;
          enumValues: undefined;
          baseColumn: never;
          generated: undefined;
        },
        {},
        {}
      > => users.id,
    ),
});

export const balance = createTable("balance", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .unique()
    .notNull()
    .references(
      (): PgColumn<
        {
          name: "id";
          tableName: "users";
          dataType: "string";
          columnType: "PgUUID";
          data: string;
          driverParam: string;
          notNull: true;
          hasDefault: true;
          isPrimaryKey: true;
          isAutoincrement: false;
          hasRuntimeDefault: false;
          enumValues: undefined;
          baseColumn: never;
          generated: undefined;
        },
        {},
        {}
      > => users.id,
    ),
  amount: integer("amount").notNull(),
  locked: integer("locked").notNull(),
});

export const p2pTransfer = createTable("p2p_transfer", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: integer("amount").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  fromUserId: uuid("from_user_id")
    .notNull()
    .references(
      (): PgColumn<
        {
          name: "id";
          tableName: "users";
          dataType: "string";
          columnType: "PgUUID";
          data: string;
          driverParam: string;
          notNull: true;
          hasDefault: true;
          isPrimaryKey: true;
          isAutoincrement: false;
          hasRuntimeDefault: false;
          enumValues: undefined;
          baseColumn: never;
          generated: undefined;
        },
        {},
        {}
      > => users.id,
    ),
  toUserId: uuid("to_user_id")
    .notNull()
    .references(
      (): PgColumn<
        {
          name: "id";
          tableName: "users";
          dataType: "string";
          columnType: "PgUUID";
          data: string;
          driverParam: string;
          notNull: true;
          hasDefault: true;
          isPrimaryKey: true;
          isAutoincrement: false;
          hasRuntimeDefault: false;
          enumValues: undefined;
          baseColumn: never;
          generated: undefined;
        },
        {},
        {}
      > => users.id,
    ),
});

export const userRelations = relations(
  users,
  ({
    many,
  }): {
    sessions: Many<"sessions">;
    onRampTransactions: Many<"onramp_transaction">;
    balances: Many<"balance">;
    sentTransfers: Many<"p2p_transfer">;
    receivedTransfers: Many<"p2p_transfer">;
  } => ({
    sessions: many(sessions),
    onRampTransactions: many(onRampTransaction),
    balances: many(balance),
    sentTransfers: many(p2pTransfer, { relationName: "FromUserRelation" }),
    receivedTransfers: many(p2pTransfer, { relationName: "ToUserRelation" }),
  }),
);

export const sessionRelations = relations(
  sessions,
  ({ one }): { user: One<"users", true> } => ({
    user: one(users, {
      fields: [sessions.userId],
      references: [users.id],
    }),
  }),
);

export const onRampTransactionRelations = relations(
  onRampTransaction,
  ({ one }): { user: One<"users", true> } => ({
    user: one(users, {
      fields: [onRampTransaction.userId],
      references: [users.id],
    }),
  }),
);

export const balanceRelations = relations(
  balance,
  ({ one }): { user: One<"users", true> } => ({
    user: one(users, {
      fields: [balance.userId],
      references: [users.id],
    }),
  }),
);

export const p2pTransferRelations = relations(
  p2pTransfer,
  ({ one }): { fromUser: One<"users", true>; toUser: One<"users", true> } => ({
    fromUser: one(users, {
      fields: [p2pTransfer.fromUserId],
      references: [users.id],
      relationName: "FromUserRelation",
    }),
    toUser: one(users, {
      fields: [p2pTransfer.toUserId],
      references: [users.id],
      relationName: "ToUserRelation",
    }),
  }),
);
