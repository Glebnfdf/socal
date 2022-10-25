import * as React from "react";
import { iOrder } from "../../OrderListModel/OrderListModel";
import { useEffect, useRef } from "react";

interface iProps {
  order: iOrder | null,
  mapRef: google.maps.Map | null
}

export default function Marker({order, mapRef}: iProps): JSX.Element {
  const markerRef: React.MutableRefObject<google.maps.Marker | null> = useRef<google.maps.Marker | null>(null);

  useEffect((): () => void => {
    if (order && mapRef) {
      markerRef.current = new google.maps.Marker({
        map: mapRef,
        position: new google.maps.LatLng(
          Number(order.coords.split(";")[0]),
          Number(order.coords.split(";")[1])
        )
      });
    }
    return (): void => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, []);

  return (
    <></>
  );
}
