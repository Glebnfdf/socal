import * as React from "react";
import { useContext, useEffect, useRef } from "react";
import { GrantLoaderContext } from "../GantDataLoader/GantDataLoader";
import iTechResponse from "../../../APIInterfaces/iTechResponse";

interface iProps {
  children: React.ReactNode
}

export default function TechnicianListModel({children}: iProps): JSX.Element {
  const gantLoaderContext = useContext(GrantLoaderContext);
  const techList: React.MutableRefObject<iTechResponse[] | null> = useRef<iTechResponse[] | null>(null);

  useEffect((): void => {
    techList.current = gantLoaderContext.techList;
  }, [gantLoaderContext.techList]);

  return (
    <>{children}</>
  );
}
