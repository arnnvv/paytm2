"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { useRouter } from "next/navigation";

export const AppbarClient = () => {
  const session = useSession();
  const router = useRouter();

  return (
    <div>
      <Appbar
        onSignin={async () => {
          await signIn();
        }}
        onSignout={async () => {
          await signOut();
          router.push("/api/auth/signin");
        }}
        user={session.data?.user}
      />
    </div>
  );
};
