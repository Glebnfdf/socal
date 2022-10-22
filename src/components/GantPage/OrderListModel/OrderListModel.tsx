import * as React from "react";
import iOrderResponse from "../../../APIInterfaces/iOrderResponse";
import { useContext, useEffect, useRef, useState } from "react";
import { GrantLoaderContext } from "../GantDataLoader/GantDataLoader";
import { useFetch } from "../../../hooks/useFetch";
import twoDigitOutput from "../../../utils/twoDigitsOutput";
import { IOrderUpdateReqData } from "../../../APIInterfaces/iOrderUpdateReqData";

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
  doOrderHaveThatTech: (orderId: number, techId: number | null) => boolean,
  getMainTechId: (orderId: number) => number | null,
  getSecondTechId: (orderId: number) => number | null,
  updateOrder: (
    orderId: number,
    technicianId: number | null,
    secondTechId: number | null,
    orderTimeBegin: Date,
    orderTmeEnd: Date
  ) => void,
}

export const OrderListContext: React.Context<iOrderListContext> = React.createContext<iOrderListContext>({
  orderLst: null,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  getOrdersByTechId: (techId: number | null): iOrder[] | null => null,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  doOrderHaveThatTech: (orderId: number, techId: number | null) => false,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMainTechId: (orderId: number) => null,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSecondTechId: (orderId: number) => null,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  updateOrder: (orderId: number, technicianId: number | null, secondTechId: number | null, orderTimeBegin: Date, orderTmeEnd: Date) => {}
})

export default function OrderListModel({children}: iProps): JSX.Element {
  const gantLoaderContext = useContext(GrantLoaderContext);
  const orderList: React.MutableRefObject<iOrder[] | null> = useRef<iOrder[] | null>(null);
  const [OLContext, setOLContext]: [st: iOrderListContext, set: (st: iOrderListContext) => void] =
    useState<iOrderListContext>({
      orderLst: null,
      getOrdersByTechId: getOrdersByTechId,
      doOrderHaveThatTech: doOrderHaveThatTech,
      getMainTechId: getMainTechId,
      getSecondTechId: getSecondTechId,
      updateOrder: updateOrderHandler
  });
  const { requestData }: {
    data?: unknown | undefined,
    isLoading: boolean,
    httpCode?: number | undefined,
    requestData: (url: string, request?: RequestInit, useRedirectFor401?: boolean) => Promise<void>
  } = useFetch();

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
    secondTechId: number | null,
    orderTimeBegin: Date,
    orderTmeEnd: Date
  ): void {
    const orders: iOrder[] = [];
    if (orderList.current) {
      orderList.current.forEach((order: iOrder): void => {
        orders.push({
          ...order,
          mainTechId: orderId === order.id ? technicianId : order.mainTechId,
          secondTechId: orderId === order.id ? secondTechId : order.secondTechId,
          time_slot_from: orderId === order.id ? orderTimeBegin.toJSON() : order.time_slot_from,
          time_slot_to: orderId === order.id ? orderTmeEnd.toJSON() : order.time_slot_to
        });
      })
    }
    orderList.current = orders;
    setOLContext({...OLContext, orderLst: orders});
    updateOrderOnServer(orderId, technicianId, secondTechId, orderTimeBegin, orderTmeEnd);
  }

  function updateOrderOnServer(
    orderId: number,
    technicianId: number | null,
    secondTechId: number | null,
    orderTimeBegin: Date,
    orderTmeEnd: Date
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async (): Promise<void> => {
      const url: string = "/api/schedule/update";
      if (technicianId === null) {
        return;
      }
      const data: IOrderUpdateReqData = {
        task_id: orderId,
        technician_id: technicianId,
        time_slot_from: shortDateFormat(orderTimeBegin),
        time_slot_to: shortDateFormat(orderTmeEnd)
      }
      if (secondTechId !== null) {
        data.second_technician_id = secondTechId;
      }

      const request: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      };
      await requestData(url, request);
    })();
  }

  function shortDateFormat(date: Date): string {
    return `${
      date.getFullYear()}-${
      twoDigitOutput(date.getMonth() + 1)}-${
      twoDigitOutput(date.getDate())} ${
      twoDigitOutput(date.getHours())}:${
      twoDigitOutput(date.getMinutes())}:${
      twoDigitOutput(date.getSeconds())}`
  }

  function doOrderHaveThatTech(orderId: number, techId: number | null): boolean {
    if (orderList.current) {
      for (let i = 0; i < orderList.current.length; i++) {
        if (orderList.current[i].id === orderId &&
           (orderList.current[i].mainTechId === techId || orderList.current[i].secondTechId == techId)) {
          return true;
        }
      }
    }
    return false;
  }

  function getMainTechId(orderId: number): number | null {
    if (!orderList.current) {
      return null
    }
    for (let i = 0; i < orderList.current.length; i++) {
      if (orderList.current[i].id === orderId) {
        return orderList.current[i].mainTechId;
      }
    }
    return null;
  }

  function getSecondTechId(orderId: number): number | null {
    if (!orderList.current) {
      return null
    }
    for (let i = 0; i < orderList.current.length; i++) {
      if (orderList.current[i].id === orderId) {
        return orderList.current[i].secondTechId;
      }
    }
    return null;
  }

  return (
    <OrderListContext.Provider value={OLContext}>
      {children}
    </OrderListContext.Provider>
  );
}
