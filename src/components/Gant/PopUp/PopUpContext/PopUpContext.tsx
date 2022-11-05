import * as React from "react";
import { PopUpName } from "../PopUpList/PopUpListNames";
import { useState } from "react";

interface iProps {
  children: React.ReactNode
}

export interface iPopUpContext {
  data: iPopUpData
  setData: (name: PopUpName, transmittedData: unknown) => void
}

export interface iPopUpData {
  name: PopUpName,
  transmittedData: unknown
}

export const PopUpContext: React.Context<iPopUpContext> = React.createContext<iPopUpContext>({
  data: {
    name: PopUpName.none,
    transmittedData: null
  },
  //eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setData: (name: PopUpName, transmittedData: unknown) => {}
})

export default function PopUpContextProvider({children}: iProps): JSX.Element {
  const [contextState, setContextState]: [st: iPopUpContext, set: (st: iPopUpContext) => void] =
    useState<iPopUpContext>({
      data: {
        name: PopUpName.none,
        transmittedData: null
      },
      setData: setPopUpData
    });

  function setPopUpData(_name: PopUpName, _transmittedData: unknown): void {
    setContextState({
      ...contextState,
      data: {
        name: _name,
        transmittedData: _transmittedData
    }});
  }

  return (
    <PopUpContext.Provider value={contextState}>
      {children}
    </PopUpContext.Provider>
  );
}
