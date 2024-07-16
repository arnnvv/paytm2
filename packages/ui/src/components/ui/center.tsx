import { ReactNode } from "react";

export default ({ children }: { children: ReactNode }): JSX.Element => (
  <div className="flex justify-center flex-col h-full">
    <div className="flex justify-center">{children}</div>
  </div>
);
