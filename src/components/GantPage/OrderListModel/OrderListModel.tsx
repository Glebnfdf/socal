import * as React from "react";
import iOrderResponse from "../../../APIInterfaces/iOrderResponse";
import { useContext, useEffect, useRef } from "react";
import { GrantLoaderContext } from "../GantDataLoader/GantDataLoader";

interface iProps {
  children: React.ReactNode
}

export interface iOrder extends iOrderResponse {
  mainTechId: number | null,
  secondTechId: number | null
}

export default function OrderListModel({children}: iProps): JSX.Element {
  const gantLoaderContext = useContext(GrantLoaderContext);
  const orderList: React.MutableRefObject<iOrder[] | null> = useRef<iOrder[] | null>(null);

  useEffect((): void => {
    orderList.current = [...gantLoaderContext.orderList];
  }, [gantLoaderContext.orderList]);

  return (
    <>{children}</>
  );
}
