import * as React from "react";
import { AuthScreenName } from "../AuthScreenMng";
import Preloader from "../../../Preloader/Preloader";

interface iProps {
  changeScreen: (newScreen: AuthScreenName) => void
}

export default function InsertSMS({changeScreen}: iProps): JSX.Element {
  return (
    <>
      <div className={"insert-phone-cont"}>
        <div>We send sms to + 1 (234) 567 -89 - 00</div>
        <div>
          <input
            type={"number"}
            // value={phoneNumber}
            // className={"error-border" + (showErr ? " active" : "")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              // setShowErr(false);
              // setPhoneNumber(event.target.value)
            }}
          />
          <input
            type={"number"}
            // value={phoneNumber}
            // className={"error-border" + (showErr ? " active" : "")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              // setShowErr(false);
              // setPhoneNumber(event.target.value)
            }}
          />
          <input
            type={"number"}
            // value={phoneNumber}
            // className={"error-border" + (showErr ? " active" : "")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              // setShowErr(false);
              // setPhoneNumber(event.target.value)
            }}
          />
          <input
            type={"number"}
            // value={phoneNumber}
            // className={"error-border" + (showErr ? " active" : "")}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              // setShowErr(false);
              // setPhoneNumber(event.target.value)
            }}
          />
          {/*{isLoading && <Preloader/>}*/}
          {/*{showErr && <div>Wrong code</div>}*/}
          <div>
            <button
              // className={phoneNumber.length === 0 || showErr ? "next-btn-disable" : ""}
              // onClick={(): void => {sendPhone2Server()}}
            >Resend Code</button>
          </div>
          <div>
            <button onClick={(): void => {changeScreen(AuthScreenName.InsertPhone)}}>Back</button>
          </div>
        </div>
      </div>
    </>
  );
}
