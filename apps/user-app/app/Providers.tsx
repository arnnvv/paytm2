"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";

export default ({ children }: { children: ReactNode }): JSX.Element => (
  <>
    <Toaster position="top-center" richColors />
    {children}
  </>
);
