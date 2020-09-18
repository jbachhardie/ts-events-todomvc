import { Service } from "./service";

export const UserService: Service = {
  "user:requestToRegisterReceived": ({ username, password }, { dispatch }) => {
    dispatch("user:created", { newUser: { username } });
  },
};
