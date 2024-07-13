import { AppBar } from "@repo/ui/components/ui/appbar";
import { validateRequest } from "../../lib/auth";

export default async () => {
  const { user } = await validateRequest();
  if (user) return <AppBar user={user} />;
  return <AppBar />;
};
