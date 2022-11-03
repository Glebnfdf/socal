import * as React from "react";
import twoDigitOutput from "../../../../../utils/twoDigitsOutput";
import { useEffect, useRef } from "react";

interface iProps {
  dateProp: Date,
  changeHour: (newHour: number) => void
  changeMinute: (newMinutes: number) => void,
  isMenuShow: boolean
}

export default function TimeDropMenu({dateProp, changeHour, changeMinute, isMenuShow}: iProps): JSX.Element {
  const hoursElemList: JSX.Element[] = [];
  const minutesElemList: JSX.Element[] = [];
  const hoursContainer: React.RefObject<HTMLUListElement> = useRef<HTMLUListElement>(null);
  const minutesContainer: React.RefObject<HTMLUListElement> = useRef<HTMLUListElement>(null);

  function convert24to12(date: Date): number {
    let hour: number = date.getHours();
    if (hour > 12) {
      hour -= 12;
    }
    if (hour === 0) {
      hour = 12;
    }
    return hour;
  }

  for (let i = 1; i <= 12; i++) {
    hoursElemList.push(
      <li
        className={"item" + (convert24to12(dateProp) === i ? " item-select" : "")}
        key={"h" + i.toString()}
        onClick={(): void => {changeHour(i);}}
      >{twoDigitOutput(i)}</li>
    );
  }

  for (let i = 0; i < 60; i++) {
    minutesElemList.push(
      <li
        className={"item" + (dateProp.getMinutes() === i ? " item-select" : "")}
        key={"m" + i.toString()}
        onClick={(): void => {changeMinute(i);}}
      >{twoDigitOutput(i)}</li>
    );
  }

  useEffect((): void => {
    if (hoursContainer.current && minutesContainer.current) {
      if (isMenuShow) {
        const hoursContainerRect: DOMRect = hoursContainer.current.getBoundingClientRect();
        const minutesContainerRect: DOMRect = minutesContainer.current.getBoundingClientRect();
        const selectedHourElm: HTMLLIElement | null = hoursContainer.current.querySelector(".item-select");
        const selectedMinuteElm: HTMLLIElement | null = minutesContainer.current.querySelector(".item-select");
        if (selectedHourElm && selectedMinuteElm) {
          const selectedHourRect: DOMRect = selectedHourElm.getBoundingClientRect();
          const selectedMinuteRect: DOMRect = selectedMinuteElm.getBoundingClientRect();
          if (selectedHourElm.offsetTop + selectedHourRect.height > hoursContainerRect.height) {
            hoursContainer.current.scrollTop = selectedHourElm.offsetTop + selectedHourRect.height - hoursContainerRect.height;
          }
          if (selectedMinuteElm.offsetTop + selectedMinuteRect.height > minutesContainerRect.height) {
            minutesContainer.current.scrollTop = selectedMinuteElm.offsetTop + selectedMinuteRect.height - minutesContainerRect.height;
          }
        }
      } else {
        hoursContainer.current.scrollTop = 0;
        minutesContainer.current.scrollTop = 0;
      }
    }
  }, [isMenuShow]);

  return (
    <div className="time-popup">
      <ul className="left" ref={hoursContainer}>
        {
          hoursElemList.map((item: JSX.Element): JSX.Element => {
            return item;
          })
        }
      </ul>
      <ul className="right" ref={minutesContainer}>
        {
          minutesElemList.map((item: JSX.Element): JSX.Element => {
            return item;
          })
        }
      </ul>
    </div>
  );
}
