import * as React from "react";
import {CSSTransition} from "react-transition-group";
import "./preloader.scss";

export default function Preloader(): JSX.Element {
  return (
    <CSSTransition in={true} timeout={300} classNames={"preload-transition"} appear>
      <div className={"preloader-cont"}>
        <svg width="63" height="64" viewBox="0 0 63 64" className={"gear-big"} fill="none">
          <use href="#preloader-icon"/>
        </svg>
        <svg width="43" height="46" viewBox="0 0 63 64" className={"gear-small"} fill="none">
          <use href="#preloader-icon"/>
        </svg>
      </div>
    </CSSTransition>
  );
}
