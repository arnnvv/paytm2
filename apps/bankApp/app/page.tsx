"use client";
import { useBalance } from "@repo/store/useBalance";
export default function Page(): JSX.Element {
  const balancve = useBalance();
  return <div>{balancve}</div>;
}
