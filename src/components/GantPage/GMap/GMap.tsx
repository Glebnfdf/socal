import * as React from "react";
import "../../../../source/img/svgIcons/points.svg";
import { Wrapper } from "@googlemaps/react-wrapper";
import MapComp from "./MapComp/MapComp";
import { useContext, useEffect, useRef } from "react";
import { iMapHeightContext, MapHeightContext } from "../MapHeightProvider/MapHeightProvider";

export default function GMap(): JSX.Element {
  const mapHeightContext: iMapHeightContext = useContext<iMapHeightContext>(MapHeightContext);
  const mapContainerRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useEffect((): void => {
    if (!mapContainerRef.current) {
      return;
    }
    mapContainerRef.current.style.height = mapHeightContext.height.toString() + "px";
  }, [mapHeightContext.height]);

  return (
    <div className={"map-container"} ref={mapContainerRef}>
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
