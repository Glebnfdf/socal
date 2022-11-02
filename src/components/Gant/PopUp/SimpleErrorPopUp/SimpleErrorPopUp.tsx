import * as React from "react";
import "../../../../../source/img/svgIcons/error-icon.svg";
import "../../../../../source/img/svgIcons/close-icon.svg";
import { useContext } from "react";
import { PopUpName } from "../PopUpList/PopUpList";
import { iPopUpContext, PopUpContext } from "../PopUpContext/PopUpContext";
import { CSSTransition } from "react-transition-group";
import {
  iWhiteLayersContext,
  WhiteLayersContext
} from "../../WhiteLayersProvider/WhiteLayersProvider";

export default function SimpleErrorPopUp(): JSX.Element {
  const popUpContext: iPopUpContext = useContext(PopUpContext);
  const whiteLayersContext: iWhiteLayersContext = useContext<iWhiteLayersContext>(WhiteLayersContext);

  function closePopUpHandler(): void {
    popUpContext.setData(PopUpName.none, null);
    whiteLayersContext.hideAllWhite();
  }

  return (
    <CSSTransition in={true} timeout={300} classNames={"popup-transition"} appear unmountOnExit={true}>
      <div className="popup-error">
        <div className="close" onClick={(): void => {closePopUpHandler()}}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <use href="#close-icon"/>
          </svg>
        </div>
        <div className="top">
          <svg width="37" height="38" viewBox="0 0 37 38" fill="none">
            <use href="#error-icon"/>
          </svg>
          <p className="title">Error!</p>
        </div>
        <div className="text">
          You should change time slot in Bitrix24 if you doesn't set a technician
        </div>
        <div className="btn-find" onClick={(): void => {closePopUpHandler()}}>
          Close
        </div>
      </div>
    </CSSTransition>
  );
}
