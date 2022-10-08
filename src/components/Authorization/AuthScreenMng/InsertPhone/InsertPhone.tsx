import * as React from "react";
import { AuthScreenName } from "../AuthScreenMng";
import "./insertPhone.scss";

interface iProps {
  changeScreen: (newScreen: AuthScreenName) => void
  phoneNumber: string,
  setPhoneNumber: (newValue: string) => void
}

export default function InsertPhone({changeScreen, phoneNumber, setPhoneNumber}: iProps): JSX.Element {
  function nextBtnHandle(): void {
    changeScreen(AuthScreenName.InsertSMS)
  }

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
          onClick={(): void => {nextBtnHandle()}}
        >Next</button>
      </div>
    </div>
  );
}
