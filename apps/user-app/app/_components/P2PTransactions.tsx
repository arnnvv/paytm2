import { Transfer } from "@repo/db/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { validateRequest } from "../../lib/auth";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";

export default ({
  p2pTransactions,
}: {
  p2pTransactions: Transfer[];
}): JSX.Element => {
  if (!p2pTransactions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          No recent transactions
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {p2pTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const TransactionItem = async ({
  transaction,
}: {
  transaction: Transfer;
}): Promise<JSX.Element> => {
  const { user } = await validateRequest();
  if (!user) throw new Error("User dosen't exist");
  const isOutgoing = transaction.fromUserId === user.id;
  const otherUserId = isOutgoing
    ? transaction.toUserId
    : transaction.fromUserId;

  return (
    <div className="flex items-center space-x-4 mb-4">
      <Avatar>
        <AvatarFallback>{otherUserId.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">
          {isOutgoing ? "Sent to" : "Received from"} {otherUserId}
        </p>
        <p className="text-sm text-muted-foreground">
          {new Date(transaction.timestamp).toLocaleString()}
        </p>
      </div>
      <div
        className={`text-sm font-medium ${isOutgoing ? "text-red-500" : "text-green-500"}`}
      >
        {isOutgoing ? "-" : "+"}₹{(transaction.amount / 100).toFixed(2)}
      </div>
    </div>
  );
};
