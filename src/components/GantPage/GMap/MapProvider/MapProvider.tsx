import * as React from "react";
import { useRef, useState } from "react";

interface iProps {
  children: React.ReactNode
}

export interface iMapContext {
  data: iMapContextData,
  setOrderId: (orderId: number | null) => void,
  setTechId: (techId: number | null) => void,
  getMapContextData: () => iMapContextData
}

export interface iMapContextData {
  orderId: number | null
  techId: number | null
}

export const MapContext: React.Context<iMapContext> = React.createContext<iMapContext>({
  data: {
    orderId: null,
    techId: null
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  setOrderId: (orderId: number | null) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  setTechId: (techId: number | null) => {},
  getMapContextData: () => {
    return {
      orderId: null,
      techId: null
    }
  }
});

export default function MapProvider({children}: iProps): JSX.Element {
  const orderIdRef: React.MutableRefObject<number | null> = useRef<number | null>(null);
  const techIdRef: React.MutableRefObject<number | null> = useRef<number | null>(null);
  const [contextState, setContextState]: [st: iMapContext, set: (st: iMapContext) => void] =
    useState<iMapContext>({
      data: {
        orderId: null,
        techId: null
      },
      setOrderId: setOrderId,
      setTechId: setTechId,
      getMapContextData: getMapContextData
    });

  function setOrderId(orderId: number | null): void {
    orderIdRef.current = orderId;
    setContextState({...contextState, data: {
      orderId: orderId,
      techId: techIdRef.current
    }});
  }

  function setTechId(techId: number | null): void {
    techIdRef.current = techId;
    setContextState({...contextState, data: {
        orderId: orderIdRef.current,
        techId: techId
      }});
  }

  function getMapContextData(): iMapContextData {
    return {
      orderId: orderIdRef.current,
      techId: techIdRef.current
    }
  }

  return (
    <MapContext.Provider value={contextState}>
      {children}
    </MapContext.Provider>
  );
}
