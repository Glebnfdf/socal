import * as React from "react";
import { iPopUpContext, PopUpContext } from "../PopUpContext/PopUpContext";
import { useContext, useEffect, useState } from "react";
import { iWhiteLayersContext, WhiteLayersContext } from "../../WhiteLayersProvider/WhiteLayersProvider";
import { PopUpName } from "../PopUpList/PopUpListNames";
import { CSSTransition } from "react-transition-group";
import { iTechListContext, iTechnician, TechListContext } from "../../TechnicianListModel/TechnicianListModel";
import { iTimeSlot } from "../../../../APIInterfaces/iTechResponse";
import getDateWithSlash from "../../../../utils/getDateWithSlash";
import twoDigitOutput from "../../../../utils/twoDigitsOutput";
import { AddTechOperationType, iAddTechInData } from "../AddTechPopUp/AddTechPopUp";
import { iOrderPopUpContext, OrderPopUpContext } from "../OrderPopUpProvider/OrderPopUpContext";

interface iProps {
  incomingData: iNonWorkTimeErrIdData
}

export interface iNonWorkTimeErrIdData {
  orderId: number,
  techId: number,
  orderBeginTime: Date,
  orderEndTime: Date
}

export default function TechNonWorkTimeErr({incomingData}: iProps): JSX.Element {
  const popUpContext: iPopUpContext = useContext(PopUpContext);
  const whiteLayersContext: iWhiteLayersContext = useContext<iWhiteLayersContext>(WhiteLayersContext);
  const orderPopUpContext: iOrderPopUpContext = useContext(OrderPopUpContext);
  const [technicianData, setTechnicianData]: [st: iTechnician | null, set: (st: iTechnician | null) => void] =
    useState<iTechnician | null>(null);
  const techListContext: iTechListContext = useContext(TechListContext);
  const [nonWorkingTime, setNonWorkingTime]: [st: Date | null, set: (st: Date | null) => void] =
    useState<Date | null>(null);

  function closePopUpHandler(): void {
    popUpContext.setData(PopUpName.none, null);
    whiteLayersContext.hideAllWhite();
  }

  useEffect((): void => {
    const technician: iTechnician | null = techListContext.getTechDataById(incomingData.techId);
    if (technician) {
      setTechnicianData(technician);
      if (technician.non_working_times && technician.non_working_times.length > 0) {
        setNonWorkingTime(getNonWorkingTime(technician.non_working_times, incomingData.orderBeginTime, incomingData.orderEndTime));
      }
    }
  }, [incomingData]);

  function getNonWorkingTime(techNonWorkingTimes: iTimeSlot[], orderBeginTime: Date, orderEndTime: Date): Date | null {
    for (let i = 0; i < techNonWorkingTimes.length; i++) {
      const techTmeSlotStart: Date = new Date(techNonWorkingTimes[i].start);
      const techTmeSlotEnd: Date = new Date(techNonWorkingTimes[i].finish);
      if (orderBeginTime.getTime() > techTmeSlotStart.getTime() && orderBeginTime.getTime() < techTmeSlotEnd.getTime() ||
        orderEndTime.getTime() > techTmeSlotStart.getTime() && orderEndTime.getTime() < techTmeSlotEnd.getTime() ||
        orderBeginTime.getTime() <= techTmeSlotStart.getTime() && orderEndTime.getTime() >= techTmeSlotEnd.getTime()
      ) {
        return new Date(techTmeSlotStart.getTime());
      }
    }
  return null;
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
          Technician <span
        >{technicianData ? technicianData.name : ""}</span> must be added to this order <span
        >№ {incomingData.orderId}</span>, but it is busy on <span
        >{nonWorkingTime ? getDateWithSlash(nonWorkingTime) : ""}</span> at <span
        >{nonWorkingTime ? `${twoDigitOutput(nonWorkingTime.getHours())}:${twoDigitOutput(nonWorkingTime.getMinutes())}` : ""}</span>
        </div>
        <div className="btn-find" onClick={(): void => {
          orderPopUpContext.setTechIds(null, null);
          orderPopUpContext.setTimes(incomingData.orderBeginTime, incomingData.orderEndTime);
          const transmittedData: iAddTechInData = {
            orderId: incomingData.orderId,
            operationType: AddTechOperationType.AddMainTech,
            mainTechId: null,
            secondTechId: null
          }
          popUpContext.setData(PopUpName.addTech, transmittedData);
        }}>
          Find a technician
        </div>
      </div>
    </CSSTransition>
  );
}
