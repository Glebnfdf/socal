import * as React from "react";

export interface iOrderDropData {
  dataIsValid: boolean,
  orderId: number,
  techInDragOrder: number,
  timeBegin: Date,
  timeEnd: Date
}

export function OrderDropData(event: React.DragEvent<HTMLDivElement>): iOrderDropData {
  let dataIsValid: boolean = true;
  let techInDragOrder = 0;
  let orderId = 0;
  let timeBegin = new Date();
  let timeEnd = new Date();

  if (event.dataTransfer.getData("data-tech-id")  === "-1" ||
      event.dataTransfer.getData("data-order-id") === "-1" ||
      event.dataTransfer.getData("time-begin")    === "-1" ||
      event.dataTransfer.getData("time-end")      === "-1"
  ) {
    dataIsValid = false;
  }

  if (dataIsValid) {
    techInDragOrder = Number(event.dataTransfer.getData("data-tech-id"));
    orderId = Number(event.dataTransfer.getData("data-order-id"));
    const beforeDragCurPosX: number = Number(event.dataTransfer.getData("before-drag-cur-pos-x"));
    const minuteWidth: number = Number(event.dataTransfer.getData("minute-width"));
    timeBegin = getNewDate(
      new Date(event.dataTransfer.getData("time-begin")),
      beforeDragCurPosX,
      event.pageX,
      minuteWidth
    )
    timeEnd = getNewDate(
      new Date(event.dataTransfer.getData("time-end")),
      beforeDragCurPosX,
      event.pageX,
      minuteWidth
    )
  }

  return {
    dataIsValid,
    orderId,
    techInDragOrder,
    timeBegin,
    timeEnd
  }
}

function getNewDate(date: Date, beforeDragCurPosX: number, afterDragCurPosX: number, minuteWidth: number): Date {
  const minutesDelta: number = Math.round((afterDragCurPosX - beforeDragCurPosX) / minuteWidth);
  date.setMinutes(date.getMinutes() + minutesDelta);
  if (date.getHours() < 7) {
    date.setHours(7,0,0,0);
  }
  if (date.getHours() >= 22) {
    date.setHours(21, 59,59);
  }
  return date;
}
