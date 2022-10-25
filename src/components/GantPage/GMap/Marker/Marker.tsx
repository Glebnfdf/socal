import * as React from "react";
import { iOrder } from "../../OrderListModel/OrderListModel";
import { useEffect, useState } from "react";

interface iProps {
  order: iOrder | null,
  mapRef: google.maps.Map | null
}

export default function Marker({order, mapRef}: iProps): JSX.Element {
  const [marker, setMarker]: [st: google.maps.Marker | null, set: (st: google.maps.Marker | null) => void] =
    useState<google.maps.Marker | null>(null);

  useEffect((): () => void => {
    if (order && mapRef) {
      setMarker(new google.maps.Marker({
        map: mapRef,
        position: new google.maps.LatLng(
          Number(order.coords.split(";")[0]),
          Number(order.coords.split(";")[1])
        )
      }));
    }
    return (): void => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, []);

  return (
    <>Hello world</>
  );
}
