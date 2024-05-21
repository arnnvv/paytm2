"use server";

import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export const p2pTransfer = async (to: string, amount: number) => {
  const session = await getServerSession(authOptions);

  const from = session?.user?.id;
  if (!from) throw new Error("Not logged in");

  const toExist = await db.user.findFirst({
    where: {
      number: to,
    },
  });
  if (!toExist) throw new Error("User does not exist");

  await db.$transaction(async (tx: any): Promise<any> => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
    const fromBalance = await tx.balance.findFirst({
      where: {
        userId: from,
      },
    });
    if (!fromBalance || fromBalance.amount < amount)
      throw new Error("Insufficient balance");
    await tx.balance.update({
      where: {
        userId: from,
      },
      data: {
        amount: {
          decrement: amount,
        },
      },
    });
    await tx.balance.update({
      where: {
        userId: toExist.id,
      },
      data: {
        amount: {
          increment: amount,
        },
      },
    });
    await tx.p2pTransfer.create({
      data: {
        fromUserId: from,
        toUserId: toExist.id,
        amount,
        timestamp: new Date(),
      },
    });
  });
};
