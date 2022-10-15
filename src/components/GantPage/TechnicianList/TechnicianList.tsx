import * as React from "react";
import "../../../../source/img/svgIcons/points.svg";
import "../../../../source/img/svgIcons/but.svg";
import { useContext, useEffect, useState } from "react";
import { iTechListContext, iTechnician, TechListContext } from "../TechnicianListModel/TechnicianListModel";
import Diagram from "../Diagram/Diagram";
import { iOrderListContext, OrderListContext } from "../OrderListModel/OrderListModel";

export default function TechnicianList(): JSX.Element {
  const techListContext: iTechListContext = useContext(TechListContext);
  const orderListContext: iOrderListContext = useContext(OrderListContext);
  const [techList, setTechList]: [st: iTechnician[] | null, set: (st: iTechnician[] | null) => void] =
    useState<iTechnician[] | null>(null);

  useEffect((): void => {
    setTechList([...techListContext.techList])
  }, [techListContext.techList]);

  function dragOverHandler(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function dropHandler(event: React.DragEvent<HTMLDivElement>, technicianId: number): void {
    event.preventDefault();
    if (event.dataTransfer.getData("data-tech-id") === "-1" ||
        event.dataTransfer.getData("data-order-id") === "-1" ||
        event.dataTransfer.getData("time-begin") === "-1" ||
        event.dataTransfer.getData("time-end") === "-1"
    ) {
          return;
      }
    const orderId: number = Number(event.dataTransfer.getData("data-order-id"));
    const beforeDragCurPosX: number = Number(event.dataTransfer.getData("before-drag-cur-pos-x"));
    const minuteWidth: number = Number(event.dataTransfer.getData("minute-width"));
    const orderTimeBegin: Date = new Date(event.dataTransfer.getData("time-begin"));
    const orderTimeEnd: Date = new Date(event.dataTransfer.getData("time-end"));

    orderListContext.updateOrder(
      orderId,
      technicianId,
      getNewDate(orderTimeBegin, beforeDragCurPosX, event.pageX, minuteWidth),
      getNewDate(orderTimeEnd, beforeDragCurPosX, event.pageX, minuteWidth)
    );
  }

  function getNewDate(date: Date, beforeDragCurPosX: number, afterDragCurPosX: number, minuteWidth: number): Date {
    const minutesDelta: number = Math.round((afterDragCurPosX - beforeDragCurPosX) / minuteWidth);
    date.setMinutes(date.getMinutes() + minutesDelta);
    if (date.getHours() < 7) {
      date.setHours(7,0,0,0);
    }
    if (date.getHours() > 21) {
      date.setHours(21);
    }
    return date;
  }

  return (
    <section className="undispatched-bottom container">
      <div className="content">
        {!techList ? null :
          (
            techList.map((technician: iTechnician): JSX.Element => {
              return (
                <div className="item" key={technician.id}>
                  <div className="item-left">
                    <div className="item-left-top">
                      <div className="dots">
                        <svg width="8" height="19" viewBox="0 0 8 19" fill="none">
                          <use href="#points"/>
                        </svg>
                      </div>
                      <div className="person">
                        <img
                          // src={technician.avatar ? technician.avatar : "https://i.ibb.co/C1ZFCsr/person-1.png"}
                          src={"https://i.ibb.co/C1ZFCsr/person-1.png"}
                          alt="#"
                        />
                      </div>
                      <div className="names">
                        <p className="title">
                          Technicians
                        </p>
                        <p className="post-title">
                          {technician.name}
                        </p>
                      </div>
                      <div className="item-left-bottom">
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
                          <use href="#but"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div
                    className="item-right"
                    onDragOver={(event: React.DragEvent<HTMLDivElement>): void => {dragOverHandler(event)}}
                    onDrop={(event: React.DragEvent<HTMLDivElement>): void => {dropHandler(event, technician.id)}}
                  >
                    <Diagram
                      orderListProp={orderListContext.getOrdersByTechId(technician.id)}
                      technicianId={technician.id}
                    />
                  </div>
                </div>
              )
          }))
        }
      </div>
    </section>
  );
}
