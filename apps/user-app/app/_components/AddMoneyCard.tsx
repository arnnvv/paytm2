"use client";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { ChangeEvent, useState } from "react";
import { createOnRampTransaction } from "../../actions";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
  },
];

export default (): JSX.Element => {
  const [amount, setAmount] = useState<number>(0);
  const [selectedBank, setSelectedBank] = useState<string>(
    SUPPORTED_BANKS[0]?.name ?? "",
  );
  const redirectUrl =
    SUPPORTED_BANKS.find(
      (bank: { name: string; redirectUrl: string }): boolean =>
        bank.name === selectedBank,
    )?.redirectUrl || "";

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Add Money</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAmount(Number(e.target.value))
              }
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="bank">Bank</Label>
            <Select onValueChange={setSelectedBank} defaultValue={selectedBank}>
              <SelectTrigger id="bank">
                <SelectValue placeholder="Select a bank" />
              </SelectTrigger>
              <SelectContent position="popper">
                {SUPPORTED_BANKS.map(
                  (bank: {
                    name: string;
                    redirectUrl: string;
                  }): JSX.Element => (
                    <SelectItem key={bank.name} value={bank.name}>
                      {bank.name}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={async () => {
              if (amount && redirectUrl) {
                await createOnRampTransaction(selectedBank, amount);
                window.location.href = redirectUrl || "";
              }
            }}
          >
            Add Money
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
