"use client";
import { ReactNode, useActionState } from "react";

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

  return (
    <form action={formAction}>
      {children}
      <p>{state.error}</p>
    </form>
  );
};
