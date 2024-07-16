import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value / 100);

export default ({
  amount,
  locked,
}: {
  amount: number | undefined;
  locked: number | undefined;
}): JSX.Element => {
  const unlockedBalance = amount ?? 0;
  const lockedBalance = locked ?? 0;
  const totalBalance = unlockedBalance + lockedBalance;

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Unlocked balance
            </span>
            <span className="font-medium">
              {formatCurrency(unlockedBalance)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Total Locked Balance
            </span>
            <span className="font-medium">{formatCurrency(lockedBalance)}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Total Balance</span>
            <span className="font-bold">{formatCurrency(totalBalance)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
