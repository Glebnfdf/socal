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
  getOrdersByTechId: (techId: number | null) => iOrder[] | null,
  updateOrder: (orderId: number, technicianId: number | null, orderTimeBegin: Date, orderTmeEnd: Date) => void
}

export const OrderListContext: React.Context<iOrderListContext> = React.createContext<iOrderListContext>({
  orderLst: null,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  getOrdersByTechId: (techId: number | null): iOrder[] | null => null,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  updateOrder: (orderId: number, technicianId: number | null, orderTimeBegin: Date, orderTmeEnd: Date) => {}
})

export default function OrderListModel({children}: iProps): JSX.Element {
  const gantLoaderContext = useContext(GrantLoaderContext);
  const orderList: React.MutableRefObject<iOrder[] | null> = useRef<iOrder[] | null>(null);
  const [OLContext, setOLContext]: [st: iOrderListContext, set: (st: iOrderListContext) => void] =
    useState<iOrderListContext>({
      orderLst: null,
      getOrdersByTechId: getOrdersByTechId,
      updateOrder: updateOrderHandler
  });

  function getOrdersByTechId(techId: number | null): iOrder[] | null {
    const orders: iOrder[] = [];
    if (orderList.current) {
      orderList.current.forEach((order: iOrder): void => {
        if (techId === null) {
          if (order.mainTechId === null) {
            orders.push(order);
          }
        } else {
          if (order.mainTechId === techId || order.secondTechId === techId) {
            orders.push(order);
          }
        }
      });
    }
    return orders.length === 0 ? null : orders;
  }

  useEffect((): void => {
    orderList.current = [...gantLoaderContext.orderList];
    setOLContext({...OLContext, orderLst: orderList.current});
  }, [gantLoaderContext.orderList]);

  function updateOrderHandler(
    orderId: number,
    technicianId: number | null,
    orderTimeBegin: Date,
    orderTmeEnd: Date
  ): void {
    const orders: iOrder[] = [];
    if (orderList.current) {
      orderList.current.forEach((order: iOrder): void => {
        orders.push({
          ...order,
          mainTechId: orderId === order.id ? technicianId : order.mainTechId,
          secondTechId: orderId === order.id ? null : order.secondTechId,
          time_slot_from: orderId === order.id ? orderTimeBegin.toJSON() : order.time_slot_from,
          time_slot_to: orderId === order.id ? orderTmeEnd.toJSON() : order.time_slot_to
        });
      })
    }
    orderList.current = orders;
    setOLContext({...OLContext, orderLst: orders});
  }

  return (
    <OrderListContext.Provider value={OLContext}>
      {children}
    </OrderListContext.Provider>
  );
}
