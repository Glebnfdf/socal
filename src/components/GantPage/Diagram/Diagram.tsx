import * as React from "react";
import { iOrder } from "../OrderListModel/OrderListModel";
import { useRef, useState } from "react";
import "./diagram.scss";

interface iProps {
  technicianId: number | null,
  orderListProp: iOrder[] | null
}

interface iOrderWithLine extends iOrder {
  line: number
}

export default function Diagram({technicianId, orderListProp}: iProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orderListWithLine, setOrderListWithLine]: [st: iOrder[] | null, set: (st: iOrder[] | null) => void] =
    useState<iOrder[] | null>(addLine2Order(orderListProp));
  const container: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  function addLine2Order(orderList: iOrder[] | null): iOrderWithLine[] | null {
    if (!orderList) {
      return null;
    }
    const ordersWithLine: iOrderWithLine[] = [];
    orderList.forEach((order: iOrder): void => {
      ordersWithLine.push({...order, line: getLineNumber(ordersWithLine, order)});
    });
    return ordersWithLine;
  }

  function getLineNumber(ordersWithLine: iOrderWithLine[], order: iOrder): number {
    let lineNumber: number = 1;
    if (ordersWithLine.length === 0) {
      return lineNumber;
    }

    // eslint-disable-next-line no-constant-condition
    while(true) {
      let isCollision = false;
      for (let i = 0; i < ordersWithLine.length; i++) {
        const targetOrderTimeFrom: Date = new Date(order.time_slot_from);
        const targetOrderTimeTo: Date = new Date(order.time_slot_to);

        if (ordersWithLine[i].line === lineNumber) {
          const orderTimeFrom: Date = new Date(ordersWithLine[i].time_slot_from);
          const orderTimeTo: Date = new Date(ordersWithLine[i].time_slot_to);
          if ((targetOrderTimeFrom >= orderTimeFrom && targetOrderTimeFrom <= orderTimeTo) ||
            (targetOrderTimeFrom <= orderTimeFrom && targetOrderTimeTo >= orderTimeFrom)) {
            isCollision = true;
            break;
          }
        }
      }
      if (isCollision) {
        lineNumber++
      } else {
        break;
      }
    }
    return lineNumber;
  }

  if (orderListWithLine) {
    return (
      <div ref={container} className={"diagram cont"}>
        {orderListWithLine.map((order: iOrder): JSX.Element => {
          return (
            <div
              key={order.id}
              className={"diagram order"}
              data-tech-id={technicianId ? technicianId : -1}
              data-order-id={order.id}
            >
              <div className={"id"}>№ {order.id}</div>
              <div className={"address"}>{order.address}</div>
            </div>
        )})}
      </div>
    );
  }  else {
    return <></>;
  }
}
