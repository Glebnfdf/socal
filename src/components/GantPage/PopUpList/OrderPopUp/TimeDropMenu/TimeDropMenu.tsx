import * as React from "react";
import twoDigitOutput from "../../../../../utils/twoDigitsOutput";

interface iProps {
  dateProp: Date
}

export default function TimeDropMenu({dateProp}: iProps): JSX.Element {
  const hoursElemList: JSX.Element[] = [];
  const minutesElemList: JSX.Element[] = [];

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
      >{twoDigitOutput(i)}</li>
    );
  }

  for (let i = 0; i < 60; i++) {
    minutesElemList.push(
      <li
        className={"item" + (dateProp.getMinutes() === i ? " item-select" : "")}
        key={"m" + i.toString()}
      >{twoDigitOutput(i)}</li>
    );
  }

  return (
    <div className="time-popup">
      <ul className="left">
        {
          hoursElemList.map((item: JSX.Element): JSX.Element => {
            return item;
          })
        }
      </ul>
      <ul className="right">
        {
          minutesElemList.map((item: JSX.Element): JSX.Element => {
            return item;
          })
        }
      </ul>
    </div>
  );
}
