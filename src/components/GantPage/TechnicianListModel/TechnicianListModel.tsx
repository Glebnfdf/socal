import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { GrantLoaderContext } from "../GantDataLoader/GantDataLoader";
import iTechResponse from "../../../APIInterfaces/iTechResponse";

interface iProps {
  children: React.ReactNode
}

export interface iTechnician extends iTechResponse {
  sequenceNumber: number
}

export interface iTechListContext {
  techList: iTechnician[],
  changeTechSequence: (dragTechId: number, targetTechId: number) => void
}

export const TechListContext: React.Context<iTechListContext> = React.createContext<iTechListContext>({
  techList: [],
  //eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  changeTechSequence: (dragTechId: number, targetTechId: number): void => {}
})

export default function TechnicianListModel({children}: iProps): JSX.Element {
  const gantLoaderContext = useContext(GrantLoaderContext);
  const techList: React.MutableRefObject<iTechnician[] | null> = useRef<iTechnician[] | null>(null);
  const [TLContext, setTLContext]: [st: iTechListContext, set: (st: iTechListContext) => void] =
    useState<iTechListContext>({
      techList: [],
      changeTechSequence: changeTechSeqHandler
    });

  useEffect((): void => {
    techList.current = [...gantLoaderContext.techList];
    setTLContext({
      ...TLContext,
      techList: [...gantLoaderContext.techList]
    });
  }, [gantLoaderContext.techList]);

  function changeTechSeqHandler(dragTechId: number, targetTechId: number): void {
    if (!techList.current) {
      return;
    }
    const newTechList: iTechnician[] = [...techList.current];
    const sequenceNumber: number = getSequence(techList.current, targetTechId);
    changeSequence(newTechList, sequenceNumber, dragTechId);
    sortBySequence(newTechList);
    setTLContext({
      ...TLContext,
      techList: newTechList
    });
  }

  function getSequence(_techList: iTechnician[], targetTechId: number): number {
    let sequenceNumber: number = 0;
    _techList.forEach((technician: iTechnician): void => {
      if (technician.id === targetTechId) {
        sequenceNumber = technician.sequenceNumber;
      }
    });
    return sequenceNumber;
  }

  function changeSequence(newTechList: iTechnician[], sequenceNumber: number, dragTechId: number): void {
    let newSequenceNum: number = -1;
    newTechList.forEach((technician: iTechnician): void => {
      if (technician.id === dragTechId) {
        technician.sequenceNumber = sequenceNumber;
      } else {
        newSequenceNum++;
        if (newSequenceNum === sequenceNumber) {
          newSequenceNum++;
        }
        technician.sequenceNumber = newSequenceNum;
      }
    });
  }

  function sortBySequence(newTechList: iTechnician[]): void {
    newTechList.sort((tech1, tech2): number => {
      if (tech1.sequenceNumber < tech2.sequenceNumber) {
        return -1
      } else {
        return 1
      }
    })
  }

  return (
    <TechListContext.Provider value={TLContext}>
      {children}
    </TechListContext.Provider>
  );
}
