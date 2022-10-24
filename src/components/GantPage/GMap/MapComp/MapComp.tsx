import * as React from "react";
import { useEffect, useRef } from "react";

export default function MapComp(): JSX.Element {
  const mapRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useEffect((): void => {
    if (mapRef.current) {
      new window.google.maps.Map(mapRef.current, {
        center: {lat: 36.75983915395801, lng: -119.78824111455792},
        zoom: 10,
      });
    }
  }, [mapRef.current]);

  return (
    <div id={"map"} ref={mapRef}></div>
  );
}
