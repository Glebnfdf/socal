import * as React from "react";
import { AuthScreenName } from "../AuthScreenMng";
import "./insertPhone.scss";
import { useState } from "react";

interface iProps {
  changeScreen: (newScreen: AuthScreenName) => void
}

export default function InsertPhone({changeScreen}: iProps): JSX.Element {
  const [phoneNumber, setPhoneNumber]: [st: string, set: (st: string) => void] = useState("");

  return (
    <div className={"insert-phone-cont"}>
      <div>
        <input
          type={"tel"}
          value={phoneNumber}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {setPhoneNumber(event.target.value)}}
        />
        <div>There is no user with phone +1 403 905 88 78</div>
        <button
          className={phoneNumber.length === 0 ? "next-btn-disable" : ""}
          onClick={(): void => {changeScreen(AuthScreenName.InsertSMS)}}
        >Next</button>
      </div>
    </div>
  );
}
