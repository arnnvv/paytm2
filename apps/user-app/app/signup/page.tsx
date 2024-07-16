import { redirect } from "next/navigation";
import { validateRequest } from "../../lib/auth";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@repo/ui/components/ui/card";
import FormComponent from "../_components/FormComponent";
import { signUpAction } from "../../actions";

export default async (): Promise<JSX.Element> => {
  const { user } = await validateRequest();
  if (user) return redirect("/dashboard");

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormComponent action={signUpAction}>
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
                Create Account
              </Button>
            </div>
          </FormComponent>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/login"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Already have an account? Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
