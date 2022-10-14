import * as React from "react";
import iOrderResponse from "../../../APIInterfaces/iOrderResponse";
import { useContext, useEffect, useRef, useState } from "react";
import { GrantLoaderContext } from "../GantDataLoader/GantDataLoader";

interface iProps {
  children: React.ReactNode
}

export interface iOrder extends iOrderResponse {
  mainTechId: number | null,
  secondTechId: number | null
}

export interface iOrderListContext {
  orderLst: iOrder[] | null,
  getOrdersByTechId: (techId: number | null) => iOrder[] | null
}

export const OrderListContext: React.Context<iOrderListContext> = React.createContext<iOrderListContext>({
  orderLst: null,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  getOrdersByTechId: (techId: number | null): iOrder[] | null => null
})

export default function OrderListModel({children}: iProps): JSX.Element {
  const gantLoaderContext = useContext(GrantLoaderContext);
  const orderList: React.MutableRefObject<iOrder[] | null> = useRef<iOrder[] | null>(null);
  const [OLContext, setOLContext]: [st: iOrderListContext, set: (st: iOrderListContext) => void] =
    useState<iOrderListContext>({
      orderLst: null,
      getOrdersByTechId: getOrdersByTechId
  });

  function getOrdersByTechId(techId: number | null): iOrder[] | null {
    const orders: iOrder[] = [];
    if (orderList.current) {
      orderList.current.forEach((order: iOrder): void => {
        if (order.mainTechId === techId || order.secondTechId === techId) {
          orders.push(order);
        }
      });
    }
    return orders.length === 0 ? null : orders;
  }

  useEffect((): void => {
    orderList.current = [...gantLoaderContext.orderList];
    setOLContext({...OLContext, orderLst: orderList.current});
  }, [gantLoaderContext.orderList]);

  return (
    <OrderListContext.Provider value={OLContext}>
      {children}
    </OrderListContext.Provider>
  );
}
