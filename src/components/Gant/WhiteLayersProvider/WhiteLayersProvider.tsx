import * as React from "react";
import { useRef, useState } from "react";

interface iProps {
  children: React.ReactNode;
}

export interface iWhiteLayersContext {
  data: iWhiteLayersData,
  showAllWhite: () => void,
  hideAllWhite: () => void,
  setWhite: (
    showHeaderWhite?: boolean,
    showUnDisWhite?: boolean,
    showTechWhite?: boolean,
    showMapWhite?: boolean,
    techId?: number | null
  ) => void
}

interface iWhiteLayersData {
  showHeaderWhite: boolean,
  showUnDisWhite: boolean,
  showTechWhite: boolean,
  showMapWhite: boolean,
  techId: number | null
}

const contextInitialData: iWhiteLayersData = {
  showHeaderWhite: false,
  showUnDisWhite: false,
  showTechWhite: false,
  showMapWhite: false,
  techId: null
}

export const WhiteLayersContext: React.Context<iWhiteLayersContext> = React.createContext<iWhiteLayersContext>({
  data: contextInitialData,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showAllWhite: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  hideAllWhite: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  setWhite: (showHeaderWhite?: boolean, showUnDisWhite?: boolean, showTechWhite?: boolean, showMapWhite?: boolean, techId?: number | null) => {}
});

export default function WhiteLayersProvider({ children }: iProps): JSX.Element {
  const [contextState, setContextState]: [st: iWhiteLayersContext, set: (st: iWhiteLayersContext) => void] =
    useState<iWhiteLayersContext>({
      data: contextInitialData,
      showAllWhite: showAllWhite,
      hideAllWhite: hideAllWhite,
      setWhite: setWhite
    });
  const contextData: React.MutableRefObject<iWhiteLayersData> = useRef<iWhiteLayersData>(contextInitialData);

  function showAllWhite(): void {
    contextData.current = {
      showHeaderWhite: true,
      showUnDisWhite: true,
      showTechWhite: true,
      showMapWhite: true,
      techId: null
    }
    setContextState({...contextState, data: contextData.current});
  }

  function hideAllWhite(): void {
    contextData.current = {
      showHeaderWhite: false,
      showUnDisWhite: false,
      showTechWhite: false,
      showMapWhite: false,
      techId: null
    }
    setContextState({...contextState, data: contextData.current});
  }

  function setWhite(
    showHeaderWhite?: boolean,
    showUnDisWhite?: boolean,
    showTechWhite?: boolean,
    showMapWhite?: boolean,
    techId?: number | null): void {
    contextData.current = {
      showHeaderWhite: showHeaderWhite !== undefined ? showHeaderWhite : contextData.current.showHeaderWhite,
      showUnDisWhite: showUnDisWhite !== undefined ? showUnDisWhite : contextData.current.showUnDisWhite,
      showTechWhite: showTechWhite !== undefined ? showTechWhite : contextData.current.showTechWhite,
      showMapWhite: showMapWhite !== undefined ? showMapWhite : contextData.current.showMapWhite,
      techId: techId !== undefined ? techId : contextData.current.techId
    }
    setContextState({...contextState, data: contextData.current});
  }

  return (
    <WhiteLayersContext.Provider value={contextState}>
      {children}
    </WhiteLayersContext.Provider>
  );
}
