import { redirect } from "next/navigation";
import { validateRequest } from "../../../lib/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

export default async (): Promise<JSX.Element> => {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Hi, {user.email}!</h2>
            <p className="text-sm text-slate-500">Your user ID is {user.id}.</p>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-slate-500">
          Thank you for using our service!
        </CardFooter>
      </Card>
    </div>
  );
};
