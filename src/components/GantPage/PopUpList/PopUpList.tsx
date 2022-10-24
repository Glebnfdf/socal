import * as React from "react";
import { iPopUpContext, PopUpContext } from "../../PopUpContext/PopUpContext";
import { useContext, useEffect, useRef, useState } from "react";
import "./PopUpList.scss";
import OrderPopUp, { iOrderPopUpInData } from "./OrderPopUp/OrderPopUp";
import SimpleErrorPopUp from "./SimpleErrorPopUp/SimpleErrorPopUp";
import AddTechPopUp, { iAddTechInData } from "./AddTechPopUp";

export enum PopUpName {
  none,
  orderPopUp,
  simpleError,
  addTech
}

export default function PopUpList(): JSX.Element {
  const popUpContext: iPopUpContext = useContext(PopUpContext);
  const [popUpName, setPopUpName]: [st: PopUpName | null, set: (st: PopUpName | null) => void] = useState<PopUpName | null>(null);
  const transmittedData: React.MutableRefObject<unknown> = useRef<unknown>(null);

  useEffect((): void => {
    transmittedData.current = popUpContext.data.transmittedData;
    setPopUpName(popUpContext.data.name);
  }, [popUpContext.data]);

  const popUp: JSX.Element | null = getPopUp();

  function getPopUp(): JSX.Element | null {
    let data4PopUp: unknown = null;
    switch (popUpName) {
      case PopUpName.orderPopUp:
        if (Object.prototype.hasOwnProperty.call(transmittedData.current as object, "type") &&
            Object.prototype.hasOwnProperty.call(transmittedData.current as object, "orderId") &&
            Object.prototype.hasOwnProperty.call(transmittedData.current as object, "orderElm") &&
            Object.prototype.hasOwnProperty.call(transmittedData.current as object, "container")) {
          data4PopUp = transmittedData.current;
        }
        return <OrderPopUp incomingData={data4PopUp as iOrderPopUpInData}/>
      case PopUpName.simpleError:
        return <SimpleErrorPopUp/>
      case PopUpName.addTech:
        if (Object.prototype.hasOwnProperty.call(transmittedData.current as object, "orderId") &&
            Object.prototype.hasOwnProperty.call(transmittedData.current as object, "operationType") &&
            Object.prototype.hasOwnProperty.call(transmittedData.current as object, "mainTechId") &&
            Object.prototype.hasOwnProperty.call(transmittedData.current as object, "secondTechId")) {
          data4PopUp = transmittedData.current;
        }
        return <AddTechPopUp incomingData={data4PopUp as iAddTechInData}/>
      default:
        return null
    }
  }

  return (
    <>
    {popUp &&
       <div className={"popup-container"}>
         {popUp}
       </div>
    }
    </>
  );
}
