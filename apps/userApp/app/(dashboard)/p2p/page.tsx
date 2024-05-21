import db from "@repo/db/client";
import { SendCard } from "./../../../components/SendCard";
import { P2pTransactions } from "./../../../components/P2ptransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";

const getP2pTransactions = async () => {
  const session = await getServerSession(authOptions);
  const transactions = await db.p2pTransfer.findMany({
    where: {
      fromUserId: session?.user?.id,
    },
    include: {
      toUser: true,
    },
  });
  return transactions.map((transaction: any) => ({
    amount: transaction.amount,
    sentTo: transaction.toUser.number,
    time: transaction.timestamp,
  }));
};
export default async function Send(): Promise<JSX.Element> {
  const transactions = await getP2pTransactions();
  return (
    <div className="w-full">
      <SendCard />
      <P2pTransactions p2ptransactions={transactions} />
    </div>
  );
}
