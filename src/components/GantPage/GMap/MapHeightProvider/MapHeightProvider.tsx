import * as React from "react";
import { useState } from "react";
import MapConstants from "../MapConstants";

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
  const [contextState, setContextState]: [st: iMapHeightContext, set: (st: iMapHeightContext) => void] =
    useState<iMapHeightContext>({
      height: MapConstants.mapHeightSmall,
      increaseMap: increaseMap,
      decreaseMap: decreaseMap,
      setHeight: setHeight
    });

  function increaseMap(): void {
    setContextState({...contextState, height: MapConstants.mapHeightBig});
  }

  function decreaseMap(): void {
    setContextState({...contextState, height: MapConstants.mapHeightSmall});
  }

  function setHeight(newHeight: number): void {
    if (newHeight > MapConstants.mapHeightBig) {
      newHeight = MapConstants.mapHeightBig;
    }
    if (newHeight < MapConstants.mapMinHeight) {
      newHeight = MapConstants.mapMinHeight;
    }
    setContextState({...contextState, height: newHeight});
  }

  return (
    <MapHeightContext.Provider value={contextState}>
      {children}
    </MapHeightContext.Provider>
  );
}
