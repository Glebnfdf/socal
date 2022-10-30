import * as React from "react";
import { useState } from "react";

interface iProps {
  children: React.ReactNode
}

export interface iMapHeightContext {
  height: number,
  increaseMap: () => void,
  decreaseMap: () => void,
  setHeight: (newHeight: number) => void
}

export const MapHeightContext: React.Context<iMapHeightContext> = React.createContext<iMapHeightContext>({
  height: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  increaseMap: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  decreaseMap: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  setHeight: (newHeight: number) => {}
});

export default function MapHeightProvider({children}: iProps): JSX.Element {
  const mapHeightSmall: number = 300;
  const mapHeightBig: number = 550;
  const [contextState, setContextState]: [st: iMapHeightContext, set: (st: iMapHeightContext) => void] =
    useState<iMapHeightContext>({
      height: mapHeightSmall,
      increaseMap: increaseMap,
      decreaseMap: decreaseMap,
      setHeight: setHeight
    });

  function increaseMap(): void {
    setContextState({...contextState, height: mapHeightBig});
  }

  function decreaseMap(): void {
    setContextState({...contextState, height: mapHeightSmall});
  }

  function setHeight(newHeight: number): void {
    if (newHeight > mapHeightBig) {
      newHeight = mapHeightBig;
    }
    setContextState({...contextState, height: newHeight});
  }

  return (
    <MapHeightContext.Provider value={contextState}>
      {children}
    </MapHeightContext.Provider>
  );
}
