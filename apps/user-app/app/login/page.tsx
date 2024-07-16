import { redirect } from "next/navigation";
import { validateRequest } from "../../lib/auth";
import Link from "next/link";
import FormComponent from "../_components/FormComponent";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { logInAction } from "../../actions";

export default async (): Promise<JSX.Element> => {
  const { user } = await validateRequest();
  if (user) return redirect("/dashboard");
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormComponent action={logInAction}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  id="email"
                  placeholder="email@example.com"
                  type="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="********"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </div>
          </FormComponent>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/signup"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Don't have an account? Create one
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
