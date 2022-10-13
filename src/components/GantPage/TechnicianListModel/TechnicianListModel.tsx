import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { GrantLoaderContext } from "../GantDataLoader/GantDataLoader";
import iTechResponse from "../../../APIInterfaces/iTechResponse";

interface iProps {
  children: React.ReactNode
}

export interface iTechnician extends iTechResponse {
  sequenceNumber: number
}

export interface iTechListContext {
  techList: iTechnician[]
}

export const TechListContext: React.Context<iTechListContext> = React.createContext<iTechListContext>({
  techList: []
})

export default function TechnicianListModel({children}: iProps): JSX.Element {
  const gantLoaderContext = useContext(GrantLoaderContext);
  const [techList, setTechList]: [st: iTechListContext, set: (st: iTechListContext) => void] =
    useState<iTechListContext>({
      techList: []
    });

  useEffect((): void => {
    setTechList({
      techList: [...gantLoaderContext.techList]
    });
  }, [gantLoaderContext.techList]);

  return (
    <TechListContext.Provider value={techList}>
      {children}
    </TechListContext.Provider>
  );
}
