import { atom } from "recoil";

export interface User {
  firstName: string;
  lastName: string;
  _id: number;
}

export const usersAtom = atom<User[]>({
  key: "userAtom",
  default: [
    {
      firstName: "",
      lastName: "",
      _id: 1,
    },
  ],
});

export const filterState = atom({
  key: "filterState",
  default: "",
});

export const firstNameState = atom({
  key: "firstNameState",
  default: "",
});

export const lastNameState = atom({
  key: "lastNameState",
  default: "",
});

export const usernameState = atom({
  key: "usernameState",
  default: "",
});

export const passwordState = atom({
  key: "passwordState",
  default: "",
});

export const authTokenState = atom({
  key: "authTokenState",
  default: null,
});

export const amountState = atom({
  key: "amountState",
  default: 0,
});
