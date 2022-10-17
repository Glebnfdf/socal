import * as React from "react";
import { AuthScreenName } from "../AuthScreenMng";
import { useFetch } from "../../../../hooks/useFetch";
import Preloader from "../../../Preloader/Preloader";
import { useEffect, useState } from "react";
import convertPhone2Num from "../../../../utils/convertPhone2Num";

interface iProps {
  changeScreen: (screenName: AuthScreenName) => void
  phoneNumber: string,
  setPhoneNumber: (newValue: string) => void
}

export default function InsertPhone({changeScreen, phoneNumber, setPhoneNumber}: iProps): JSX.Element {
  const { isLoading, response, requestData }: {
    isLoading: boolean,
    response?: Response | undefined,
    requestData: (url: string, request?: RequestInit, useRedirectFor401?: boolean) => Promise<void>
  } = useFetch();
  const [showErr, setShowErr]: [st: boolean, set: (st: boolean) => void] = useState(false);

  useEffect((): void => {
    if (!isLoading && response) {
      switch (response.status) {
        case 201:
          changeScreen(AuthScreenName.InsertSMS);
          break;
        case 400:
          setShowErr(true);
          break;
      }
    }
  }, [isLoading]);

  function sendPhone2Server(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async (): Promise<void> => {
      const url: string = "/api/auth/register";
      const request: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "phone": convertPhone2Num(phoneNumber) })
      };
      await requestData(url, request);
    })();
  }

  return (
    <div className={"auth-form-cont"}>
      <p className="title">Login in to your account</p>
      <p className="action-label">Insert your phone number</p>
      <input
        className={"auth-input phone-input" + (showErr ? " error" : "")}
        type="tel"
        value={phoneNumber}
        placeholder="+ 1 (___) ___-__-__"
        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
          setShowErr(false);
          setPhoneNumber(event.target.value)
        }}
      />
      <div className={"error-and-preloader-cont"}>
        {isLoading && <div className={"insert-phone-preloader"}><Preloader/></div>}
        {showErr &&
          <p className="error">There is no user with phone<br/>{phoneNumber}</p>
        }
      </div>
      <button
        type={"button"}
        className={"button auth-btn blue-btn" + (phoneNumber.length === 0 || showErr ? " disable" : "")}
        onClick={(): void => {sendPhone2Server()}}
      >
        Next
      </button>
    </div>
  );
}
