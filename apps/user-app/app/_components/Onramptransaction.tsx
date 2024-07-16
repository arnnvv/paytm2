import { Transaction } from "@repo/db/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";

export default ({
  transactions,
}: {
  transactions: Transaction[];
}): JSX.Element => {
  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value / 100);

  const formatDate = (date: Date): string =>
    date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (!transactions.length) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No recent transactions
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {transactions.map(
              (t: Transaction, index: number): JSX.Element => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Received INR</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(t.startTime)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      via {t.provider}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      + {formatCurrency(t.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {t.status}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
