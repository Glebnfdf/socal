import * as React from "react";

interface iProps {
  dateProp: Date
}

export default function TimeDropMenu({dateProp}: iProps): JSX.Element {
  return (
    <div className="time-popup">
      <ul className="left">
        <li className="item item-select">
          12
        </li>
        <li className="item">
          01
        </li>
        <li className="item">
          02
        </li>
        <li className="item">
          03
        </li>
        <li className="item">
          04
        </li>
        <li className="item">
          05
        </li>
      </ul>
      <ul className="right">
        <li className="item item-select">
          00
        </li>
        <li className="item">
          01
        </li>
        <li className="item">
          02
        </li>
        <li className="item">
          03
        </li>
        <li className="item">
          04
        </li>
        <li className="item">
          05
        </li>
      </ul>
    </div>
  );
}
