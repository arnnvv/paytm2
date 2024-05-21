import { Card } from "@repo/ui/card";

export const P2pTransactions = ({
  p2ptransactions,
}: {
  p2ptransactions: {
    amount: number;
    sentTo: string;
    time: Date;
  }[];
}): JSX.Element => {
  if (!p2ptransactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }
  return (
    <Card title="Recent Transactions">
      <div className="pt-2">
        {p2ptransactions.map((transaction) => (
          <div className="flex justify-between">
            <div>
              <div className="text-sm">
                Sent ₹{transaction.amount / 100} to:{" "}
              </div>
              <div className="text-slate-600 text-xs">
                {transaction.time.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              {transaction.sentTo}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
