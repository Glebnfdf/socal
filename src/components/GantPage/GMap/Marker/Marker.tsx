import * as React from "react";
import { iOrder } from "../../OrderListModel/OrderListModel";
import { useEffect, useRef } from "react";

interface iProps {
  order: iOrder | null,
  mapRef: google.maps.Map | null
}

export default function Marker({order, mapRef}: iProps): JSX.Element {
  const markerRef: React.MutableRefObject<google.maps.Marker | null> = useRef<google.maps.Marker | null>(null);
  const infoWindow: React.MutableRefObject<google.maps.InfoWindow | null> = useRef<google.maps.InfoWindow | null>(null);

  useEffect((): () => void => {
    if (order && mapRef) {
      markerRef.current = new google.maps.Marker({
        map: mapRef,
        position: new google.maps.LatLng(
          Number(order.coords.split(";")[0]),
          Number(order.coords.split(";")[1])
        )
      });
      infoWindow.current = new google.maps.InfoWindow({
        content: `${getTime12Format(new Date(order.time_slot_from))} - ${getTime12Format(new Date(order.time_slot_to))}`,
        disableAutoPan: true
      });
      infoWindow.current.open(mapRef, markerRef.current);
    }
    return (): void => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (infoWindow.current) {
        infoWindow.current.close();
      }
    };
  }, []);

  function getTime12Format(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(date).toLowerCase();
  }

  return (
    <></>
  );
}
