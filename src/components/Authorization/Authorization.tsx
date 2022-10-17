import * as React from "react";
import { useState } from "react";
import AuthPage from "./AuthPage/AuthPage";

interface iProps {
  children: React.ReactNode
}

export interface iAuthContext {
  setIsUserHaveAuth: (newValue: boolean) => void
}

export const AuthContext: React.Context<iAuthContext> = React.createContext<iAuthContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  setIsUserHaveAuth: (newValue: boolean): void => {}
});

export default function Authorization({children}: iProps): JSX.Element {
  const isUserHaveToken: boolean = !!localStorage.getItem("token");
  const [isUserHaveAuth, setIsUserHaveAuth]: [st: boolean, set: (st: boolean) => void] = useState(isUserHaveToken);

  return (
    <AuthContext.Provider value={{setIsUserHaveAuth}}>
      {isUserHaveAuth ? children : <AuthPage/>}
    </AuthContext.Provider>
  );
}
