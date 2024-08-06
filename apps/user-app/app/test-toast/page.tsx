"use client";

import { Button } from "@repo/ui/components/ui/button";
import { toast } from "@repo/ui/components/ui/sonner";

export default (): JSX.Element => (
  <Button
    onClick={(): string | number =>
      toast.error("PayTM", {
        description: "Lauda",
        action: {
          label: "Undo",
          onClick: (): void => console.log("Undo"),
        },
        actionButtonStyle: {
          color: "red",
          fontWeight: "bold",
        },
      })
    }
  >
    CLK
  </Button>
);
