import * as React from "react";
import { iPopUpContext, PopUpContext } from "../PopUpContext/PopUpContext";
import { useContext, useEffect, useRef, useState } from "react";
import "./PopUpList.scss";
import OrderPopUp, { iOrderPopUpInData } from "../OrderPopUp/OrderPopUp";
import SimpleErrorPopUp from "../SimpleErrorPopUp/SimpleErrorPopUp";
import AddTechPopUp, { iAddTechInData } from "../AddTechPopUp/AddTechPopUp";

export enum PopUpName {
  none,
  orderPopUp,
  simpleError,
  addTech
}

export default function PopUpList(): JSX.Element {
  const popUpContext: iPopUpContext = useContext(PopUpContext);
  const [popUpName, setPopUpName]: [st: PopUpName, set: (st: PopUpName) => void] = useState<PopUpName>(PopUpName.none);
  const transmittedData: React.MutableRefObject<unknown> = useRef<unknown>(null);
  const [newPopUpName, setNewPopUpName]: [st: PopUpName, set: (st: PopUpName) => void] = useState<PopUpName>(PopUpName.none);

  useEffect((): void => {
    transmittedData.current = popUpContext.data.transmittedData;
    setNewPopUpName(popUpContext.data.name);
    setPopUpName(PopUpName.none);
  }, [popUpContext.data]);

  useEffect((): void => {
    // логика такая: если открыт popUp и пользователь нажимает на открытие второго, то сперва сбрасываем первый путём
    // установки popUpName в PopUpName.none, а уже после перерендера, устанавливаем нужное имя, иначе react будет
    // использовать старую версию компонента
    if (popUpName === PopUpName.none && newPopUpName !== PopUpName.none) {
      setPopUpName(newPopUpName);
    }
  }, [popUpName, newPopUpName]);

  const popUp: JSX.Element | null = getPopUp();

  function getPopUp(): JSX.Element | null {
    let data4PopUp: unknown = null;
    switch (popUpName) {
      case PopUpName.orderPopUp:
        if (Object.prototype.hasOwnProperty.call(transmittedData.current as object, "type") &&
            Object.prototype.hasOwnProperty.call(transmittedData.current as object, "orderId") &&
            Object.prototype.hasOwnProperty.call(transmittedData.current as object, "orderElm") &&
            Object.prototype.hasOwnProperty.call(transmittedData.current as object, "container") &&
            Object.prototype.hasOwnProperty.call(transmittedData.current as object, "isPopUpOnMap")) {
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
