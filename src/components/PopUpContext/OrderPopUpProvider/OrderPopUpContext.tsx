import * as React from "react";
import { useRef, useState } from "react";

interface iProps {
  children: React.ReactNode
}

export interface iOrderPopUpContext {
  contextData: iOrderPopUpData,
  getMainTechId: () => number | null,
  getSecondTechId: () => number | null,
  setTechIds: (mainTechId: number | null, secondTechId: number | null) => void,
  getBeginTime: () => Date | null,
  getEndTime: () => Date | null,
  setTimes: (beginOrderTime: Date, endOrderTime: Date) => void
}

interface iOrderPopUpData {
  mainTechId: number | null,
  secondTechId: number | null,
  beginTime: Date,
  endTime: Date
}

export const OrderPopUpContext: React.Context<iOrderPopUpContext> = React.createContext<iOrderPopUpContext>({
  contextData: {
    mainTechId: null,
    secondTechId: null,
    beginTime: new Date(),
    endTime: new Date()
  },
  getMainTechId: () => null,
  getSecondTechId: () => null,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setTechIds: (mainTechId: number | null, secondTechId: number | null) => {},
  //eslint-disable-next-line @typescript-eslint/no-empty-function
  getBeginTime: () => null,
  //eslint-disable-next-line @typescript-eslint/no-empty-function
  getEndTime: () => null,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setTimes: (beginOrderTime: Date, endOrderTime: Date) => {}
});

export default function OrderPopUpProvider({children}: iProps): JSX.Element {
  const orderPopUpData: React.MutableRefObject<iOrderPopUpData> = useRef<iOrderPopUpData>({
    mainTechId: null,
    secondTechId: null,
    beginTime: new Date(),
    endTime: new Date()
  });
  const [contextState, setContextState]: [st: iOrderPopUpContext, set: (st: iOrderPopUpContext) => void] =
    useState<iOrderPopUpContext>({
      contextData: {
        mainTechId: null,
        secondTechId: null,
        beginTime: new Date(),
        endTime: new Date()
      },
      getMainTechId: getMainTechId,
      getSecondTechId: getSecondTechId,
      setTechIds: setTechIds,
      getBeginTime: getBeginTime,
      getEndTime: getEndTime,
      setTimes: setTimes
    });

  function getMainTechId(): number | null {
    if (!orderPopUpData.current) {
      return null;
    }
    return orderPopUpData.current.mainTechId;
  }

  function getSecondTechId(): number | null {
    if (!orderPopUpData.current) {
      return null;
    }
    return orderPopUpData.current.secondTechId;
  }

  function setTechIds(mainTechId: number | null, secondTechId: number | null): void {
    if (!orderPopUpData.current) {
      return;
    }
    orderPopUpData.current.mainTechId = mainTechId;
    orderPopUpData.current.secondTechId = secondTechId;
    setContextState({...contextState, contextData: orderPopUpData.current});
  }

  function getBeginTime(): Date | null {
    if (!orderPopUpData.current) {
      return null;
    }
    return orderPopUpData.current.beginTime;
  }

  function getEndTime(): Date | null {
    if (!orderPopUpData.current) {
      return null;
    }
    return orderPopUpData.current.endTime;
  }

  function setTimes(beginOrderTime: Date, endOrderTime: Date): void {
    if (!orderPopUpData.current) {
      return;
    }
    orderPopUpData.current.beginTime = beginOrderTime;
    orderPopUpData.current.endTime = endOrderTime;
    setContextState({...contextState, contextData: orderPopUpData.current});
  }

  return (
    <OrderPopUpContext.Provider value={contextState}>
      {children}
    </OrderPopUpContext.Provider>
  );
}
