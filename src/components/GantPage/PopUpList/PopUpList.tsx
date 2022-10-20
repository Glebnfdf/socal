import * as React from "react";
import { iPopUpContext, PopUpContext } from "../../PopUpContext/PopUpContext";
import { useContext, useEffect, useRef, useState } from "react";
import "./PopUpList.scss";

export enum PopUpName {
  testPopUp
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
    switch (popUpName) {
      case PopUpName.testPopUp:
        return <>Hello world!</>
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
