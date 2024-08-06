"use client";
import { toast } from "@repo/ui/components/ui/sonner";
import { ReactNode, useActionState, useEffect } from "react";

export interface ActionResult {
  error: string | null;
}

export default ({
  children,
  action,
}: {
  children: ReactNode;
  action: (_: any, formdata: FormData) => Promise<ActionResult>;
}): JSX.Element => {
  const [state, formAction] = useActionState(action, {
    error: null,
  });

  useEffect((): void => {
    if (state.error)
      toast.error(state.error, {
        description: "PayTM",
        action: {
          label: "Undo",
          onClick: (): string | number => toast.dismiss(),
        },
      });
  }, [state.error]);

  return (
    <form action={formAction}>
      {children}
      <p>{state.error}</p>
    </form>
  );
};
