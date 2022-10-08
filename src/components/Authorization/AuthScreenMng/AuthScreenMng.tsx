import * as React from "react";
import { useState } from "react";
import InsertSMS from "./InsertSMS/InsertSMS";
import InsertPhone from "./InsertPhone/InsertPhone";

export enum AuthScreenName {
  InsertPhone,
  InsertSMS
}

export default function AuthScreenMng(): JSX.Element {
  const [currentScreen, setCurrentScreen]: [st: AuthScreenName, set: (st: AuthScreenName) => void] =
    useState<AuthScreenName>(AuthScreenName.InsertPhone);

  return (
    <>
      {currentScreen === AuthScreenName.InsertPhone
        ? <InsertPhone changeScreen={setCurrentScreen}></InsertPhone>
        : <InsertSMS changeScreen={setCurrentScreen}></InsertSMS>
      }
    </>
  );
}
