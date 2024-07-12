"use client";
import { useFormState } from "react-dom";

export interface ActionResult {
  error: string | null;
}

import { ReactNode } from "react";

export const Form = ({
  children,
  action,
}: {
  children: ReactNode;
  action: (prevState: any, formdata: FormData) => Promise<ActionResult>;
}): JSX.Element => {
  const [state, formAction] = useFormState(action, {
    error: null,
  });

  return (
    <form action={formAction}>
      {children}
      <p>{state.error}</p>
    </form>
  );
};
