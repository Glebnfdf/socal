import * as React from "react";
import { AuthScreenName } from "../AuthScreenMng";

interface iProps {
  changeScreen: (newScreen: AuthScreenName) => void
}

export default function InsertSMS({changeScreen}: iProps): JSX.Element {
  return (
    <>
      <button onClick={(): void => {changeScreen(AuthScreenName.InsertPhone)}}>Back</button>
    </>
  );
}
