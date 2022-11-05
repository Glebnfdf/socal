import * as React from "react";
import AuthScreenMng from "../AuthScreenMng/AuthScreenMng";
import AuthLogo from "../../../../source/img/logo/logo-for-auth.svg";

export default function AuthPage(): JSX.Element {
  return (
    <div className={"auth-body auth-body-cont"}>
      <div className="auth-screen">
        <div className="left" />
        <div>
          <div className="right">
            <div className="auth-logo">
              <img src={AuthLogo} alt={"logo"}/>
            </div>
            <AuthScreenMng/>
          </div>
        </div>
      </div>
    </div>
  );
}
