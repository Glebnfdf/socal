import * as React from "react";
import { useEffect, useRef } from "react";

export default function MapComp(): JSX.Element {
  const mapRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useEffect((): void => {
    if (mapRef.current) {
      new window.google.maps.Map(mapRef.current, {
        center: {lat: -34.397, lng: 150.644},
        zoom: 4,
      });
    }
  }, [mapRef.current]);

  return (
    <div id={"map"} ref={mapRef}></div>
  );
}
