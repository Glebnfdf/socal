import * as React from "react";
import "./GMap.scss";
import "../../../../source/img/svgIcons/points.svg";
import { Wrapper } from "@googlemaps/react-wrapper";
import MapComp from "./MapComp/MapComp";

export default function GMap(): JSX.Element {
  return (
    <div className={"map-container"}>
      <div className={"map-top-ine"}>
        <div className={"dots-icon"}>
          <svg width="8" height="19" viewBox="0 0 8 19" fill="none">
            <use href="#points"/>
          </svg>
        </div>
      </div>
      <Wrapper apiKey={`${process.env.mapkey ? process.env.mapkey : ""}`} language={"en"}>
        <MapComp/>
      </Wrapper>
    </div>
  );
}
