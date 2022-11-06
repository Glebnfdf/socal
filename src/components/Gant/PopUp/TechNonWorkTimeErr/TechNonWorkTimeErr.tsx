import * as React from "react";
import { iPopUpContext, PopUpContext } from "../PopUpContext/PopUpContext";
import { useContext, useEffect, useState } from "react";
import { iWhiteLayersContext, WhiteLayersContext } from "../../WhiteLayersProvider/WhiteLayersProvider";
import { PopUpName } from "../PopUpList/PopUpListNames";
import { CSSTransition } from "react-transition-group";
import { iTechListContext, iTechnician, TechListContext } from "../../TechnicianListModel/TechnicianListModel";

interface iProps {
  incomingData: iNonWorkTimeErrIdData
}

export interface iNonWorkTimeErrIdData {
  orderId: number,
  techId: number
}

export default function TechNonWorkTimeErr({incomingData}: iProps): JSX.Element {
  const popUpContext: iPopUpContext = useContext(PopUpContext);
  const whiteLayersContext: iWhiteLayersContext = useContext<iWhiteLayersContext>(WhiteLayersContext);
  const [technicianData, setTechnicianData]: [st: iTechnician | null, set: (st: iTechnician | null) => void] =
    useState<iTechnician | null>(null);
  const techListContext: iTechListContext = useContext(TechListContext);

  function closePopUpHandler(): void {
    popUpContext.setData(PopUpName.none, null);
    whiteLayersContext.hideAllWhite();
  }

  useEffect((): void => {
    setTechnicianData(techListContext.getTechDataById(incomingData.techId));
  }, [incomingData]);

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
          Technician <span>{technicianData ? technicianData.name : ""}</span> must be added to this order <span>№ {incomingData.orderId}</span>, but it is busy on <span>04/14/2022</span> at <span>16:00</span>
        </div>
        <div className="btn-find" onClick={(): void => {closePopUpHandler()}}>
          Find a technician
        </div>
      </div>
    </CSSTransition>
  );
}
