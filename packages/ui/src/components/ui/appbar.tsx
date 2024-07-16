"use client";
import { ReactNode } from "react";

interface AppbarProps {
  user?: {
    name?: string | null;
  };
  children?: ReactNode;
}

export const AppBar = ({ user, children }: AppbarProps): JSX.Element => (
  <div className="flex justify-between border-b px-4">
    <div className="text-lg flex flex-col justify-center">PayTM</div>
    {user && (
      <div className="flex flex-col justify-center pt-2">{children}</div>
    )}
  </div>
);
