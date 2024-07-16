"use server";

import { validatedEmail } from "@repo/validate/client";
import { ActionResult } from "./app/_components/FormComponent";
import { db } from "@repo/db/client";
import { Balance, Transaction, users, Users } from "@repo/db/schema";
import { LegacyScrypt } from "lucia";
import lucia, { validateRequest } from "./lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateId } from "lucia";

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
  const transactions: Transaction[] = [];
  return transactions;
};
