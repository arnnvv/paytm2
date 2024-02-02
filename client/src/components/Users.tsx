import { usersAtom, filterState, User } from "../store/atoms";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { lazy } from "react";
const Button = lazy(() => import("../components/Button.tsx"));
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useRecoilState(usersAtom);
  const [filter, setFilter] = useRecoilState(filterState);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/bulk?filter=${filter}`,
        );
        setUsers(response.data.users);
      } catch (error) {
        console.error(`Error fetching users: ${error}`);
      }
    })();
  }, [filter]);
  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          type="text"
          placeholder="Search users..."
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-2 py-1 border rounded border-slate-200"
        ></input>
      </div>
      <div>
        {users.map((user) => (
          <User user={user} />
        ))}
      </div>
    </>
  );
};

const User = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.firstName[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center h-ful">
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-ful">
        <Button
          onClick={() => {
            navigate(`/send/?id=${user._id}&name=${user.firstName}`);
          }}
          label={"Send Money"}
        />
      </div>
    </div>
  );
};

export default Users;
