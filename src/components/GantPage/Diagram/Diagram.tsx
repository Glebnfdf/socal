import * as React from "react";
import { iOrder } from "../OrderListModel/OrderListModel";
import { useEffect, useRef, useState } from "react";
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
  const [orderListWithLine, setOrderListWithLine]: [st: iOrderWithLine[] | null, set: (st: iOrderWithLine[] | null) => void] =
    useState<iOrderWithLine[] | null>(addLine2Order(orderListProp));
  const container: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  // Т.к. при первом запуске компонента у нас реф не определён, то вывод заявок происходит во втором рендере
  const [firstRenderHappened, setFirstRenderHappened]: [st: boolean, set: (st: boolean) => void] = useState(false);
  const lineHeight: number = 30 + 6; // 30 - высота блока заявки, 6 - отступ между рядами заявок
  const scrollbarWidth: number = 0; // поставить 13, когда будет scrollbar;
  const numberOfHours: number = 15;

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

  useEffect((): void => {
    setFirstRenderHappened(true);
  }, []);

  function getContainerHeight(): number {
    let maxLineNumber: number = 0;
    if (!orderListWithLine) {
      return maxLineNumber;
    }

    orderListWithLine.forEach((order: iOrderWithLine): void => {
      if (order.line > maxLineNumber) {
        maxLineNumber = order.line;
      }
    });

    return maxLineNumber * lineHeight;
  }

  function getMinuteWidth(): number {
    if (!container.current) {
      return 0
    }

    const containerWidth: number = container.current.offsetWidth - scrollbarWidth;
    const hourWidth: number = containerWidth / numberOfHours;
    return hourWidth / 60; // в одном часе 60 минут
  }

  function getOrderWidth(_timeBegin: string, _timeEnd: string): number {
    const timeBegin: Date = new Date(_timeBegin);
    const timeEnd: Date = new Date(_timeEnd);
    const numOfMinutesForOrder: number = (timeEnd.getTime() - timeBegin.getTime()) / 1000 / 60;
    // результат вычитания в миллисекундах делим на 1000, чтобы пучить количество секунд, и потом на 60, чтобы получить минуты

    return Math.round(numOfMinutesForOrder * getMinuteWidth());
  }

  function getDiagramBeginTime(timeBegin: string): Date {
    const diagramBeginTime: Date = new Date(timeBegin);
    diagramBeginTime.setHours(7, 0, 0, 0);
    return diagramBeginTime;
  }

  function getXPosition(_timeBegin: string): number {
    const timeBegin: Date = new Date(_timeBegin);
    const diagramBeginTime: Date = getDiagramBeginTime(_timeBegin);
    const minOfOrderFromBegin: number = (timeBegin.getTime() - diagramBeginTime.getTime()) / 1000 / 60;
    return Math.round(minOfOrderFromBegin * getMinuteWidth());
  }

  function getYPosition(lineNumber: number): number {
    return (lineNumber - 1) * lineHeight;
  }

  function getColorClass(orderType: string): string {
    switch (orderType) {
      case "Recall":
        return "red";
      case "Repair":
        return "orange";
      case "Estimation":
        return "violet";
      default:
        return "unknown-tag";
    }
  }

  if (orderListWithLine) {
    return (
      <div ref={container} className={"diagram cont"} style={{height: getContainerHeight().toString() + "px"}}>
        {firstRenderHappened && orderListWithLine.map((order: iOrderWithLine): JSX.Element => {
          return (
            <div
              key={order.id}
              className={`diagram order ${getColorClass(order.type)}`}
              data-tech-id={technicianId ? technicianId : -1}
              data-order-id={order.id}
              style={{
                left: getXPosition(order.time_slot_from).toString() + "px",
                top: getYPosition(order.line).toString() + "px",
                width: getOrderWidth(order.time_slot_from, order.time_slot_to).toString() + "px"
              }}
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
