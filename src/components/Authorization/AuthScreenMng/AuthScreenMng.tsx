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
  const [phoneNumber, setPhoneNumber]: [st: string, set: (st: string) => void] = useState("");

  return (
    <>
      {currentScreen === AuthScreenName.InsertPhone
        ? <InsertPhone
          changeScreen={setCurrentScreen}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
        : <InsertSMS changeScreen={setCurrentScreen}/>
      }
    </>
  );
}
