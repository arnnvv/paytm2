import { Button } from "./button";

interface AppbarProps {
  user?: {
    name?: string | null;
  };
}

export const AppBar = ({ user }: AppbarProps): JSX.Element => (
  <div className="flex justify-between border-b px-4">
    <div className="text-lg flex flex-col justify-center">PayTM</div>
    {user && (
      <div className="flex flex-col justify-center pt-2">
        <Button onClick={() => {}}>Logout</Button>
      </div>
    )}
  </div>
);
