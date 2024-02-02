import { lazy } from "react";
const Appbar = lazy(() => import("../components/Appbar.tsx"));
const Balance = lazy(() => import("../components/Balance.tsx"));
const Users = lazy(() => import("../components/Users.tsx"));

const Dashboard = () => {
  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={"10,000"} />
        <Users />
      </div>
    </div>
  );
};

export default Dashboard;
