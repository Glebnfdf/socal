import * as React from "react";
import { AuthScreenName } from "../AuthScreenMng";
import "./insertPhone.scss";
import { useFetch } from "../../../../hooks/useFetch";
import Preloader from "../../../Preloader/Preloader";
import { useEffect } from "react";

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

  useEffect((): void => {
    if (httpCode && httpCode === 200) {
      changeScreen(AuthScreenName.InsertSMS);
    }
  }, [httpCode]);

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
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {setPhoneNumber(event.target.value)}}
        />
        {isLoading && <Preloader/>}
        <div>There is no user with phone +1 403 905 88 78</div>
        <button
          className={phoneNumber.length === 0 ? "next-btn-disable" : ""}
          onClick={(): void => {sendPhone2Server()}}
        >Next</button>
      </div>
    </div>
  );
}
