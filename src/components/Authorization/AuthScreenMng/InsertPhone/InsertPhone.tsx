import * as React from "react";
import { AuthScreenName } from "../AuthScreenMng";
import "./insertPhone.scss";

interface iProps {
  changeScreen: (newScreen: AuthScreenName) => void
}

export default function InsertPhone({changeScreen}: iProps): JSX.Element {
  return (
    <div className={"insert-phone-cont"}>
      <div>
        <input type={"tel"}/>
        <div>There is no user with phone +1 403 905 88 78</div>
        <button onClick={(): void => {changeScreen(AuthScreenName.InsertSMS)}}>Next</button>
      </div>
    </div>
  );
}
