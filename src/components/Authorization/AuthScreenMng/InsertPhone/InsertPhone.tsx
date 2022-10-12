import * as React from "react";
import { AuthScreenName } from "../AuthScreenMng";
import "./insertPhone.scss";
import { useFetch } from "../../../../hooks/useFetch";
import Preloader from "../../../Preloader/Preloader";
import { useEffect, useState } from "react";

interface iProps {
  changeScreen: (screenName: AuthScreenName) => void
  phoneNumber: string,
  setPhoneNumber: (newValue: string) => void
}

export default function InsertPhone({changeScreen, phoneNumber, setPhoneNumber}: iProps): JSX.Element {
  const { isLoading, httpCode, requestData }: {
    isLoading: boolean,
    httpCode?: number | undefined,
    requestData: (url: string, request?: RequestInit, useRedirectFor401?: boolean) => Promise<void>
  } = useFetch();
  const [showErr, setShowErr]: [st: boolean, set: (st: boolean) => void] = useState(false);

  useEffect((): void => {
    if (!isLoading && httpCode) {
      switch (httpCode) {
        case 200:
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
      const url: string = "/auth/register";
      const request: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "phone": phoneNumber })
      };
      await requestData(url, request);
    })();
  }

  return (
    <div className={"insert-phone-cont"}>
      <div>
        <input
          type={"tel"}
          value={phoneNumber}
          className={"error-border" + (showErr ? " active" : "")}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setShowErr(false);
            setPhoneNumber(event.target.value)
          }}
        />
        {isLoading && <Preloader/>}
        {showErr && <div>There is no user with phone +1 403 905 88 78</div>}
        <div>
          <button
            type={"button"}
            className={phoneNumber.length === 0 || showErr ? "next-btn-disable" : ""}
            onClick={(): void => {sendPhone2Server()}}
          >Next</button>
        </div>
      </div>
    </div>
  );
}
