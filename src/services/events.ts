import { User } from "../graphql/codegen-types";

export type EventPayloads = {
  "user:requestToRegisterReceived": {
    username: string;
    password: string;
  };
  "user:created": {
    newUser: User;
  };
  "user:requestToAuthoriseReceived": {
    username: string;
    password: string;
  };
  "user:authorised": {
    authToken: string;
  };
  error: Error;
};
