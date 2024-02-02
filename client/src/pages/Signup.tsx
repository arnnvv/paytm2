import { lazy } from "react";
import {
  firstNameState,
  lastNameState,
  usernameState,
  passwordState,
  authTokenState,
} from "../store/atoms.ts";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Button = lazy(() => import("../components/Button.tsx"));
const ButtonWarning = lazy(() => import("../components/ButtonWarning.tsx"));
const InputBox = lazy(() => import("../components/InputBox.tsx"));
const Heading = lazy(() => import("../components/Heading.tsx"));
const Subheading = lazy(() => import("../components/SubHeading.tsx"));

const Signup = () => {
  const [firstName, setFirstName] = useRecoilState(firstNameState);
  const [lastName, setLastName] = useRecoilState(lastNameState);
  const [username, setUsername] = useRecoilState(usernameState);
  const [password, setPassword] = useRecoilState(passwordState);
  const [, setAuthToken] = useRecoilState(authTokenState);
  const navigate = useNavigate();
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <Subheading label={"Enter your infromation to create an account"} />
          <InputBox
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            label={"First Name"}
          />
          <InputBox
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            label={"Last Name"}
          />
          <InputBox
            onChange={(e) => setUsername(e.target.value)}
            placeholder="harkirat@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={async () => {
                try {
                  const res = await axios.post(
                    "http://localhost:3000/api/v1/users/signup",
                    {
                      firstName: firstName,
                      lastName: lastName,
                      username: username,
                      password: password,
                    },
                  );
                  setAuthToken(res.data.token);
                  axios.interceptors.request.use(
                    (config) => {
                      if (res.data.token) {
                        config.headers.Authorization = `Bearer ${res.data.token}`;
                      }
                      return config;
                    },
                    (error) => {
                      return Promise.reject(error);
                    },
                  );
                  navigate("/dashboard");
                } catch (e) {
                  console.error(`Error in sigining up: ${e}`);
                }
              }}
              label={"Sign up"}
            />
          </div>
          <ButtonWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
