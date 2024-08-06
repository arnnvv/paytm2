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
import { ChangeEvent, useState } from "react";
import { createP2PTransfer } from "../../actions";
import { validatedEmail } from "@repo/validate/client";
import { toast } from "@repo/ui/components/ui/sonner";

export default (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Send Money</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                placeholder="Enter amount"
                type="number"
                value={amount}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAmount(e.target.value)
                }
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              onClick={async (): Promise<{ error: string } | undefined> => {
                if (!email || !amount) toast.error("enter email and amount");
                const numAmount: number = Number(amount);

                if (!validatedEmail(email)) toast.error("Invalid email format");
                if (isNaN(numAmount) || numAmount <= 0)
                  toast.error("Amount must be a positive number");
                try {
                  toast.success("Sending", {
                    description: "PayTM",
                    action: {
                      label: "Undo",
                      onClick: (): void => console.log("Undo"),
                    },
                  });
                  await createP2PTransfer(email, numAmount * 100);
                } catch (error) {
                  toast.error("An error occurred while sending money");
                  return { error: "An error occurred while sending money" };
                } finally {
                  setAmount("0");
                }
              }}
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
