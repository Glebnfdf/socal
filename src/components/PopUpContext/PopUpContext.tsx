import * as React from "react";
import { PopUpName } from "../GantPage/PopUpList/PopUpList";
import { useState } from "react";

interface iProps {
  children: React.ReactNode
}

export interface iPopUpContext {
  data: iPopUpData
  setData: (popUpName: PopUpName | null, transmittedData: unknown) => void
}

export interface iPopUpData {
  popUpName: PopUpName | null,
  transmittedData: unknown
}

export const PopUpContext: React.Context<iPopUpContext> = React.createContext<iPopUpContext>({
  data: {
    popUpName: null,
    transmittedData: null
  },
  //eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setData: (popUpName: PopUpName | null, transmittedData: unknown) => {}
})

export default function PopUpContextProvider({children}: iProps): JSX.Element {
  const [contextState, setContextState]: [st: iPopUpContext, set: (st: iPopUpContext) => void] =
    useState<iPopUpContext>({
      data: {
        popUpName: null,
        transmittedData: null
      },
      setData: setPopUpData
    });

  function setPopUpData(_popUpName: PopUpName | null, _transmittedData: unknown): void {
    setContextState({
      ...contextState, data:{
        popUpName: _popUpName,
        transmittedData: _transmittedData
    }});
  }

  return (
    <PopUpContext.Provider value={contextState}>
      {children}
    </PopUpContext.Provider>
  );
}
