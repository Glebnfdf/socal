import * as React from "react";
import AuthScreenMng from "../AuthScreenMng/AuthScreenMng";
import "./authPage.scss";

export default function AuthPage(): JSX.Element {
  return (
    <div className={"auth-body auth-body-cont"}>
      <div className="auth-screen">
        <div className="left">
        </div>
        <div className="right">
          <AuthScreenMng/>
        </div>
      </div>
    </div>
  );
}
