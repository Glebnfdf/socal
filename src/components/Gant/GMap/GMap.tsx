import * as React from "react";
import "../../../../source/img/svgIcons/points.svg";
import { Wrapper } from "@googlemaps/react-wrapper";
import MapComp from "./MapComp/MapComp";
import { useContext, useEffect, useRef } from "react";
import { iMapHeightContext, MapHeightContext } from "./MapHeightProvider/MapHeightProvider";
import MapConstants from "./MapConstants";

export default function GMap(): JSX.Element {
  const mapHeightContext: iMapHeightContext = useContext<iMapHeightContext>(MapHeightContext);
  const mapContainerRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const initialMouseY: React.MutableRefObject<number> = useRef<number>(0);
  const initialMapHeight: React.MutableRefObject<number> = useRef<number>(0);
  const isMapHeightChange: React.MutableRefObject<boolean> = useRef<boolean>(false);

  useEffect((): void => {
    if (!mapContainerRef.current) {
      return;
    }
    mapContainerRef.current.style.height = mapHeightContext.height.toString() + "px";
    initialMapHeight.current = mapHeightContext.height;
  }, [mapHeightContext.height]);

  function startMoveMapHandler(event: React.MouseEvent): void {
    if (mapContainerRef.current) {
      if (mapContainerRef.current.classList.contains("transition")) {
        mapContainerRef.current.classList.remove("transition");
      }

      isMapHeightChange.current = true;
      initialMouseY.current = event.screenY;
      window.addEventListener("mousemove", moveMapHandler);
      window.addEventListener("mouseup", stopMoveMapHandler);
      window.addEventListener("mouseleave", stopMoveMapHandler);
    }
  }

  const moveMapHandler = (event: MouseEvent): void => {
    event.stopPropagation();
    event.preventDefault();
    if (isMapHeightChange.current && mapContainerRef.current) {
      const mouseYDelta: number = event.screenY - initialMouseY.current;
      let newMapHeight: number = initialMapHeight.current - mouseYDelta;
      if (newMapHeight > MapConstants.mapHeightBig) {
        newMapHeight = MapConstants.mapHeightBig;
      }
      if (newMapHeight < MapConstants.mapMinHeight) {
        newMapHeight = MapConstants.mapMinHeight;
      }
      mapContainerRef.current.style.height = newMapHeight.toString() + "px";
    }
  }

  const stopMoveMapHandler = (): void => {
    if (mapContainerRef.current) {
      if (!mapContainerRef.current.classList.contains("transition")) {
        mapContainerRef.current.classList.add("transition");
      }
      isMapHeightChange.current = false;
      window.removeEventListener("mousemove", moveMapHandler);
      window.removeEventListener("mouseup", stopMoveMapHandler);
      window.removeEventListener("mouseleave", stopMoveMapHandler);

      const newMapHeight: number = mapContainerRef.current.getBoundingClientRect().height;
      mapHeightContext.setHeight(newMapHeight);
    }
  }

  return (
    <div className={"map-container transition"} ref={mapContainerRef}>
      <div className={"map-top-ine"}>
        <div
          className={"dots-icon"}
          onMouseDown={(event: React.MouseEvent): void => {startMoveMapHandler(event);}}
        >
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
