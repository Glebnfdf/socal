import * as React from "react";
import { AuthScreenName } from "../AuthScreenMng";

interface iProps {
  changeScreen: (newScreen: AuthScreenName) => void
}

export default function InsertPhone({changeScreen}: iProps): JSX.Element {
  return (
    <>
      <button onClick={(): void => {changeScreen(AuthScreenName.InsertSMS)}}>Next</button>
    </>
  );
}
