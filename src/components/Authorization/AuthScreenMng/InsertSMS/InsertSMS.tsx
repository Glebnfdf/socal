import * as React from "react";
import { AuthScreenName } from "../AuthScreenMng";
import Preloader from "../../../Preloader/Preloader";
import { useContext, useEffect, useRef, useState } from "react";
import { useFetch } from "../../../../hooks/useFetch";
import iLoginResponse from "../../../../APIInterfaces/iLoginResponse";
import { AuthContext, iAuthContext } from "../../Authorization";
import convertPhone2Num from "../../../../utils/convertPhone2Num";

interface iProps {
  changeScreen: (newScreen: AuthScreenName) => void,
  phoneNumber: string
}

export default function InsertSMS({changeScreen, phoneNumber}: iProps): JSX.Element {
  const { data, isLoading, response, requestData }: {
    data?: unknown | undefined,
    isLoading: boolean,
    response?: Response | undefined,
    requestData: (url: string, request?: RequestInit, useRedirectFor401?: boolean) => Promise<void>
  } = useFetch();
  const authContext: iAuthContext = useContext(AuthContext);
  const [wrongSMS, setWrongSMS]: [wrongSMS: boolean, setWrongSMS: (wrongSMS: boolean) => void] = useState(false);
  const num1: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const num2: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const num3: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const num4: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const digits: RegExp = /\d/;
  const forbiddenSymbols: RegExp = /[.,e+-]/i;

  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    const keyIsNotControlKey: boolean = event.key.length === 1;
    if (keyIsNotControlKey) {
      if (forbiddenSymbols.test(event.key)) {
        prohibitSpecialSymbols(event);
      }

      const input: HTMLInputElement = event.target as HTMLInputElement;
      const isInputHaveAlreadyNum: boolean = input.value.length > 0;
      if (digits.test(event.key) && isInputHaveAlreadyNum) {
        remOldNumBeforeAddNew(input);
      }
    }
  }

  function prohibitSpecialSymbols(event: React.KeyboardEvent<HTMLInputElement>): void {
    event.preventDefault();
  }

  function remOldNumBeforeAddNew(input: HTMLInputElement): void {
    input.value = "";
  }

  const keyUpHandler = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    const keyIsNotControlKey: boolean = event.key.length === 1;
    const input: HTMLInputElement = event.target as HTMLInputElement;

    if (keyIsNotControlKey) {
      if (digits.test(event.key)) {
        autoFocusOnNextField(input);
        setWrongSMS(false);

        const isAllInputHaveNum: boolean =
          num1.current?.value.length === 1 &&
          num2.current?.value.length === 1 &&
          num3.current?.value.length === 1 &&
          num4.current?.value.length === 1;
        if (isAllInputHaveNum) {
          sendSMSCode();
        }
      }
    } else {
      if (event.key === "Backspace") {
        const inputIsEmpty: boolean = input.value.length === 0;
        if (inputIsEmpty) {
          autoFocus4Backspace(input);
          setWrongSMS(false);
        }
      }
    }
  }

  function autoFocusOnNextField(input: HTMLInputElement): void {
    switch (input.name) {
      case "num1":
        num2.current?.focus();
        break;
      case "num2":
        num3.current?.focus();
        break;
      case "num3":
        num4.current?.focus();
        break;
    }
  }

  function autoFocus4Backspace(input: HTMLInputElement): void {
    switch (input.name) {
      case "num2":
        num1.current?.focus();
        break;
      case "num3":
        num2.current?.focus();
        break;
      case "num4":
        num3.current?.focus();
        break;
    }
  }

  function sendSMSCode(): void {
    if (num1.current && num2.current && num3.current && num4.current) {
      const smsCode: string = num1.current.value + num2.current.value + num3.current.value + num4.current.value;

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async (): Promise<void> => {
        const url: string = "/api/auth/login";
        const request: RequestInit = {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ "phone": phoneNumber, "code": smsCode })
        };
        await requestData(url, request, false);
      })();
    }
  }

  useEffect((): void => {
    if (!isLoading && response && response.url.includes("/api/auth/login")) {
      switch (response.status) {
        case 201:
          if (data) {
            localStorage.setItem("token", (data as iLoginResponse).access_token);
            authContext.setIsUserHaveAuth(true);
          }
          break;
        case 400:
          setWrongSMS(true);
          break;
      }
    }
  }, [isLoading]);

  function resendSMS(): void {
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
    <>
      <div className={"insert-phone-cont"}>
        <div>We send sms to {phoneNumber}</div>
        <div>
          <input
            type={"number"}
            ref={num1}
            name={"num1"}
            className={"error-border" + (wrongSMS ? " active" : "")}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>): void => {keyDownHandler(event)}}
            onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>): void => {keyUpHandler(event)}}
          />
          <input
            type={"number"}
            ref={num2}
            name={"num2"}
            className={"error-border" + (wrongSMS ? " active" : "")}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>): void => {keyDownHandler(event)}}
            onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>): void => {keyUpHandler(event)}}
          />
          <input
            type={"number"}
            ref={num3}
            name={"num3"}
            className={"error-border" + (wrongSMS ? " active" : "")}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>): void => {keyDownHandler(event)}}
            onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>): void => {keyUpHandler(event)}}
          />
          <input
            type={"number"}
            ref={num4}
            name={"num4"}
            className={"error-border" + (wrongSMS ? " active" : "")}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>): void => {keyDownHandler(event)}}
            onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>): void => {keyUpHandler(event)}}
          />
          {isLoading && <Preloader/>}
          {wrongSMS && <div>Wrong code</div>}
          <div>
            <button
              type={"button"}
              onClick={(): void => {resendSMS()}}
            >Resend Code</button>
          </div>
          <div>
            <button type={"button"} onClick={(): void => {changeScreen(AuthScreenName.InsertPhone)}}>Back</button>
          </div>
        </div>
      </div>
    </>
  );
}
