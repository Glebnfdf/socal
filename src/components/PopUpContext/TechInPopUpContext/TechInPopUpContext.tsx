import * as React from "react";
import { useRef, useState } from "react";

interface iProps {
  children: React.ReactNode
}

export interface iTechInPopUpContext {
  getMainTechId: () => number | null,
  setMainTechId: (techId: number | null) => void,
  getSecondTechId: () => number | null,
  setSecondTechId: (techId: number | null) => void
}

interface TechInPopUpData {
  mainTechId: number | null,
  secondTechId: number | null
}

export const TechInPopUpContext: React.Context<iTechInPopUpContext> = React.createContext<iTechInPopUpContext>({
  getMainTechId: () => null,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setMainTechId: (techId: number | null) => {},
  getSecondTechId: () => null,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setSecondTechId: (techId: number | null) => {}
});

export default function TechInPopUpProvider({children}: iProps): JSX.Element {
  const techIdData: React.MutableRefObject<TechInPopUpData> = useRef<TechInPopUpData>({
    mainTechId: null,
    secondTechId: null
  });
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [contextState, setContextState]: [st: iTechInPopUpContext, set: (st: iTechInPopUpContext) => void] =
    useState<iTechInPopUpContext>({
      getMainTechId: getMainTechId,
      setMainTechId: setMainTechId,
      getSecondTechId: getSecondTechId,
      setSecondTechId: setSecondTechId
    });

  function getMainTechId(): number | null {
    if (!techIdData.current) {
      return null;
    }
    return techIdData.current.mainTechId;
  }

  function setMainTechId(techId: number | null): void {
    if (!techIdData.current) {
      return;
    }
    techIdData.current.mainTechId = techId;
  }

  function getSecondTechId(): number | null {
    if (!techIdData.current) {
      return null;
    }
    return techIdData.current.secondTechId;
  }

  function setSecondTechId(techId: number | null): void {
    if (!techIdData.current) {
      return;
    }
    techIdData.current.secondTechId = techId;
  }

  return (
    <TechInPopUpContext.Provider value={contextState}>
      {children}
    </TechInPopUpContext.Provider>
  );
}
