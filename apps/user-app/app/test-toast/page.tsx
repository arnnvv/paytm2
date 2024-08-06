"use client";

import { Button } from "@repo/ui/components/ui/button";
import { toast } from "@repo/ui/components/ui/sonner";

export default (): JSX.Element => (
  <Button
    onClick={(): string | number =>
      toast("PayTM", {
        description: "Lauda",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      })
    }
  >
    CLK
  </Button>
);
