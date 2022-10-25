import * as React from "react";
import { useEffect, useRef } from "react";

export default function MapComp(): JSX.Element {
  const div4MapRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const map: React.MutableRefObject<google.maps.Map | null> = useRef<google.maps.Map | null>(null);
  const mapCenter: google.maps.LatLng =
    new google.maps.LatLng(36.65342732855857, -119.89621977146605);
  const defaultZoom: number = 7;

  useEffect((): void => {
    if (div4MapRef.current) {
      map.current = new window.google.maps.Map(div4MapRef.current, {
        center: mapCenter,
        zoom: defaultZoom,
      });
    }
  }, [div4MapRef.current]);

  return (
    <div id={"map"} ref={div4MapRef}></div>
  );
}
