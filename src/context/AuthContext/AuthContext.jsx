import { createContext, use } from "react";

export const AuthContext = createContext();

const useAuth = () => {
  return use(AuthContext);
};

export default useAuth;
