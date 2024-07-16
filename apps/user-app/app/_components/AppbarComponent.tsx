import { AppBar } from "@repo/ui/components/ui/appbar";
import { validateRequest } from "../../lib/auth";
import { Button } from "@repo/ui/components/ui/button";
import FormComponent from "./FormComponent";
import { signOutAction } from "../../actions";

export default async (): Promise<JSX.Element> => {
  const { user } = await validateRequest();
  if (user)
    return (
      <AppBar
        user={user}
        children={
          <FormComponent action={signOutAction}>
            <Button>Logout</Button>
          </FormComponent>
        }
      />
    );
  return <AppBar />;
};
