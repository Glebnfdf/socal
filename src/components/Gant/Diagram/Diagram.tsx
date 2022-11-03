import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { iOrder, iOrderListContext, OrderListContext } from "../OrderListModel/OrderListModel";
import "./diagram.scss";
import { DragItemType } from "../../../utils/DragItemType";
import { iPopUpContext, PopUpContext } from "../PopUp/PopUpContext/PopUpContext";
import { PopUpName } from "../PopUp/PopUpList/PopUpList";
import { iOrderPopUpInData, OrderPopUpType } from "../PopUp/OrderPopUp/OrderPopUp";
import getTagColorClass from "../../../utils/getTagColorClass";
import { iOrderPopUpContext, OrderPopUpContext } from "../PopUp/OrderPopUpProvider/OrderPopUpContext";
import { iWhiteLayersContext, WhiteLayersContext } from "../WhiteLayersProvider/WhiteLayersProvider";

interface iProps {
  orderListProp: iOrder[] | null,
  technicianId: number | null,
  isThisUnDisBlock: boolean
}

interface iOrderWithLine extends iOrder {
  line: number
}

export default function Diagram({orderListProp, technicianId, isThisUnDisBlock}: iProps): JSX.Element {
  const [orderListWithLine, setOrderListWithLine]: [st: iOrderWithLine[] | null, set: (st: iOrderWithLine[] | null) => void] =
    useState<iOrderWithLine[] | null>(addLine2Order(orderListProp));
  const popUpContext: iPopUpContext = useContext(PopUpContext);
  const techInPopUpContext: iOrderPopUpContext = useContext(OrderPopUpContext);
  const orderListContext: iOrderListContext = useContext(OrderListContext);
  const container: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [, setSignal2Rerender]: [st: number, set: (st: number) => void] = useState(0);
  const iterator: React.MutableRefObject<number> = useRef<number>(0);
  const lineHeight: number = 30 + 6; // 30 - высота блока заявки, 6 - отступ между рядами заявок
  const numberOfHours: number = 15;
  const whiteLayerMinHeight: number = isThisUnDisBlock ? 230 : 63;
  const techDiagTopPadding: number = 17;
  const contResizeObserver: React.MutableRefObject<ResizeObserver> =
    useRef<ResizeObserver>(new ResizeObserver((): void => {
      iterator.current++;
      setSignal2Rerender(iterator.current);
      resizeWhiteLayer();
      if (container.current && !isThisUnDisBlock) {
        container.current.style.top = techDiagTopPadding.toString() + "px";
      }
  }));
  const whiteLayersContext: iWhiteLayersContext = useContext<iWhiteLayersContext>(WhiteLayersContext);
  const [clickedOrder, setClickedOrder]: [st: number | null, set: (st: number | null) => void] =
    useState<number | null>(null);
  const [isShowWhiteLayer, setIsShowWhiteLayer]: [st: boolean, set: (st: boolean) => void] =
    useState(whiteLayersContext.data.showUnDisWhite);
  const whiteLayerRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

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

  useEffect((): void => {
    setOrderListWithLine(addLine2Order(orderListProp));
  }, [orderListProp]);

  useEffect((): () => void => {
    if (container.current) {
      contResizeObserver.current.observe(container.current);
    }
    return (): void => {
      contResizeObserver.current.disconnect();
    };
  }, []);

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

    const containerWidth: number = container.current.offsetWidth;
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

  function setAttr2DragElm(event: React.DragEvent<HTMLDivElement>): void {
    const htmlElement: HTMLElement = event.target as HTMLElement;
    const orderId: string | null = htmlElement.getAttribute("data-order-id");
    const techId: string | null = htmlElement.getAttribute("data-tech-id");
    const timeBegin: string | null = htmlElement.getAttribute("data-time-begin");
    const timeEnd: string | null = htmlElement.getAttribute("data-time-end");
    event.dataTransfer.setData("data-order-id", orderId === null ? "-1" : orderId);
    event.dataTransfer.setData("data-tech-id", techId === null ? "-1" : techId);
    event.dataTransfer.setData("time-begin", timeBegin === null ? "-1" : timeBegin);
    event.dataTransfer.setData("time-end", timeEnd === null ? "-1" : timeEnd);
    event.dataTransfer.setData("minute-width", getMinuteWidth().toString());
    event.dataTransfer.setData("before-drag-cur-pos-x", event.pageX.toString());
    localStorage.setItem("dragItemType", DragItemType.Order);
    localStorage.setItem("techIdInDragOrder", techId === null ? "-1" : techId);
    localStorage.setItem("order-time-begin", timeBegin === null ? "-1" : timeBegin);
  }

  useEffect((): void => {
    if (whiteLayersContext.data.showUnDisWhite) {
      if (isThisUnDisBlock) {
        setIsShowWhiteLayer(true);
      } else {
        if (whiteLayersContext.data.techId !== null && whiteLayersContext.data.techId === technicianId) {
          setIsShowWhiteLayer(false);
        } else {
          setIsShowWhiteLayer(true);
        }
      }
    } else {
      setIsShowWhiteLayer(false);
    }
    // setIsShowWhiteLayer(whiteLayersContext.data.showUnDisWhite);
    setClickedOrder(whiteLayersContext.data.orderId);
  }, [whiteLayersContext]);

  function resizeWhiteLayer(): void {
    if (container.current && whiteLayerRef.current) {
      const containerHeight: number = container.current.getBoundingClientRect().height;
      whiteLayerRef.current.style.height =
        (containerHeight < whiteLayerMinHeight ? whiteLayerMinHeight : containerHeight).toString() + "px";
      if (!isThisUnDisBlock) {
        whiteLayerRef.current.style.top = (techDiagTopPadding * -1).toString() + "px";
      }
     }
  }

  return (
    <div
      ref={container}
      className={"diagram cont" + (isShowWhiteLayer ? " show-white" : "")}
      style={{height: getContainerHeight().toString() + "px"}}
    >
      <div ref={whiteLayerRef} className={"undispatched-blur diagram-white" + (isShowWhiteLayer && isThisUnDisBlock ? " show" : "")}></div>
      {orderListWithLine && orderListWithLine.map((order: iOrderWithLine): JSX.Element => {
        return (
          <div
            key={order.id}
            className={`diagram order ${getTagColorClass(order.type)}` + (order.id === clickedOrder ? " clicked-order" : "")}
            data-order-id={order.id}
            data-tech-id={technicianId === null ? "null" : technicianId}
            data-time-begin={order.time_slot_from}
            data-time-end={order.time_slot_to}
            style={{
              left: getXPosition(order.time_slot_from).toString() + "px",
              top: getYPosition(order.line).toString() + "px",
              width: getOrderWidth(order.time_slot_from, order.time_slot_to).toString() + "px",
            }}
            draggable={"true"}
            onDragStart={(event: React.DragEvent<HTMLDivElement>): void => {setAttr2DragElm(event)}}
            onClick={(event: React.MouseEvent): void => {
              techInPopUpContext.setTechIds(
                orderListContext.getMainTechId(order.id),
                orderListContext.getSecondTechId(order.id)
              );
              techInPopUpContext.setTimes(new Date(order.time_slot_from), new Date(order.time_slot_to));
              const transmittedData: iOrderPopUpInData = {
                type: OrderPopUpType.Small,
                orderId: order.id,
                orderElm: event.currentTarget as HTMLElement,
                container: container.current
              }
              popUpContext.setData(PopUpName.orderPopUp, transmittedData);
              whiteLayersContext.setWhite(
                true,
                true,
                true,
                whiteLayersContext.data.techId === null,
                order.id);
          }}
          >
            <div className={"id"}>№ {order.id}</div>
            <div className={"address"}>{order.address}</div>
          </div>
      )})}
    </div>
  );
}
