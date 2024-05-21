import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { redirect } from "next/navigation";

export default async function Page(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/api/auth/signin");
  } else {
    redirect("/dashboard");
  }
}
