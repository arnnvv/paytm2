"use server";

import { validatedEmail } from "@repo/validate/client";
import { ActionResult } from "./app/_components/FormComponent";
import { db, eq, pool } from "@repo/db/client";
import {
  balance,
  Balance,
  onRampTransaction,
  p2pTransfer,
  Transaction,
  Transfer,
  users,
  Users,
} from "@repo/db/schema";
import { LegacyScrypt } from "lucia";
import lucia, { validateRequest } from "./lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateId } from "lucia";
import { v4 } from "uuid";

export const logInAction = async (
  _: any,
  formData: FormData,
): Promise<ActionResult> => {
  const email = formData.get("email");
  if (typeof email !== "string") return { error: "Email is required" };
  if (!validatedEmail(email)) return { error: "Invalid email" };
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 64
  )
    return { error: "Invalid password" };
  try {
    const existingUser = (await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })) as Users | undefined;
    if (!existingUser) return { error: "User not found" };
    const validPassword = await new LegacyScrypt().verify(
      existingUser.password,
      password,
    );
    if (!validPassword) return { error: "Incorrect Password" };
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch {
    throw new Error("Something went wrong");
  }
  return redirect("/");
};

export const signUpAction = async (
  _: any,
  formData: FormData,
): Promise<ActionResult> => {
  const email = formData.get("email");
  if (typeof email !== "string") return { error: "Email is required" };
  if (!validatedEmail(email)) return { error: "Invalid email" };
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 64
  )
    return { error: "Invalid password" };
  const id = generateId(10);
  try {
    const hashedPassword = await new LegacyScrypt().hash(password);
    const existingUser = (await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })) as Users | undefined;
    if (existingUser) return { error: "User already exists" };
    await db.insert(users).values({
      id,
      password: hashedPassword,
      email,
    });
    const session = await lucia.createSession(id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch {
    throw new Error("Unexpected error");
  }
  return redirect("/");
};

export const signOutAction = async (): Promise<ActionResult> => {
  const { session } = await validateRequest();
  if (!session) return { error: "not logged in" };
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/login");
};

export const getBalance = async (
  id: string | undefined,
): Promise<Balance | undefined> => {
  if (!id) throw new Error("User not found");
  try {
    const balance = await db.query.balance.findFirst({
      where: (balance, { eq }) => eq(balance.userId, id),
    });
    return balance;
  } catch {
    throw new Error("Something went wrong");
  }
};

export const getTransactions = async (
  id: string | undefined,
): Promise<Transaction[]> => {
  if (!id) throw new Error("User not found");
  try {
    const transactions: Transaction[] | undefined =
      await db.query.onRampTransaction.findMany({
        where: (onRampTransaction, { eq }) => eq(onRampTransaction.userId, id),
        orderBy: (onRampTransaction, { desc }) => [
          desc(onRampTransaction.startTime),
        ],
      });
    return transactions;
  } catch {
    throw new Error("Something went wrong");
  }
};

export const createOnRampTransaction = async (
  provider: string,
  amount: number,
): Promise<{ message: string; token: string }> => {
  const { user } = await validateRequest();
  if (!user) throw new Error("User not found");
  try {
    const token = (Math.random() * 1000).toString();
    await db.insert(onRampTransaction).values({
      id: v4(),
      status: "Processing",
      startTime: new Date(),
      provider,
      token,
      userId: user.id,
      amount: amount * 100,
    });
    return {
      message: "Transaction created",
      token,
    };
  } catch {
    throw new Error("Something went wrong");
  }
};

export const createP2PTransfer = async (toEmail: string, amount: number) => {
  const { user } = await validateRequest();
  if (!user) throw new Error("User not found");
  const toExists = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, toEmail),
  });
  if (!toExists) throw new Error("User not found");
  let connection;
  try {
    connection = await pool.connect();
    await connection.query("BEGIN;");

    const receiver = await db.query.users.findFirst({
      where: eq(users.email, toEmail),
    });

    if (!receiver) throw new Error("User not found");

    const senderBalance = await db.query.balance.findFirst({
      where: eq(balance.userId, user.id),
    });

    if (!senderBalance || senderBalance.amount < amount)
      throw new Error("Insufficient balance");

    const receiverBalance = await db.query.balance.findFirst({
      where: eq(balance.userId, receiver.id),
    });

    await db
      .update(balance)
      .set({ amount: senderBalance.amount - amount })
      .where(eq(balance.userId, user.id));

    if (receiverBalance) {
      await db
        .update(balance)
        .set({ amount: receiverBalance.amount + amount })
        .where(eq(balance.userId, receiver.id));
    } else {
      await db.insert(balance).values({
        amount: amount,
        locked: 0,
        userId: receiver.id,
      });
    }

    await db.insert(p2pTransfer).values({
      amount: amount,
      timestamp: new Date(),
      fromUserId: user.id,
      toUserId: receiver.id,
    });

    await connection.query("COMMIT");

    console.log(
      `Successfully transferred ${amount} from user ${user.email} to ${toEmail}`,
    );
    return {
      message: `Successfully transferred ${amount} from user ${user.email} to ${toEmail}`,
    };
  } catch (e) {
    await connection?.query("ROLLBACK");
    throw new Error(`Something went wrong: ${e}`);
  } finally {
    connection?.release();
  }
};

export const getP2PTransfers = async (): Promise<Transfer[]> => {
  const { user } = await validateRequest();
  if (!user) throw new Error("User not found");
  try {
    const transfersStent: Transfer[] = await db.query.p2pTransfer.findMany({
      where: (p2pTransfer, { eq }) => eq(p2pTransfer.fromUserId, user.id),
    });
    const transfersReceived: Transfer[] = await db.query.p2pTransfer.findMany({
      where: (p2pTransfer, { eq }) => eq(p2pTransfer.toUserId, user.id),
    });
    const allTransfers: Transfer[] = [...transfersStent, ...transfersReceived];

    return allTransfers.sort((a: Transfer, b: Transfer): number => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  } catch (e) {
    throw new Error(`Something went wrong: ${e}`);
  }
};
