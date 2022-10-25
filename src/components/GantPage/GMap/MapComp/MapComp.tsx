import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { iMapContext, MapContext } from "../../MapProvider/MapProvider";
import Marker from "../Marker/Marker";
import { iOrder, iOrderListContext, OrderListContext } from "../../OrderListModel/OrderListModel";

export default function MapComp(): JSX.Element {
  const div4MapRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const map: React.MutableRefObject<google.maps.Map | null> = useRef<google.maps.Map | null>(null);
  const mapCenter: google.maps.LatLng =
    new google.maps.LatLng(36.65342732855857, -119.89621977146605);
  const defaultZoom: number = 7;
  const [orderId, setOrderId]: [st: number | null, set: (st: number | null) => void] = useState<number | null>(null);
  const mapContext: iMapContext = useContext<iMapContext>(MapContext);
  const orderListContext: iOrderListContext = useContext<iOrderListContext>(OrderListContext);
  const orderList4Tech: React.MutableRefObject<iOrder[] | null> = useRef<iOrder[] | null>(null);

  useEffect((): void => {
    if (div4MapRef.current) {
      map.current = new window.google.maps.Map(div4MapRef.current, {
        center: mapCenter,
        zoom: defaultZoom,
      });
    }
  }, [div4MapRef.current]);

  useEffect((): void => {
    setOrderId(mapContext.getMapContextData().orderId);
    const techId: number | null = mapContext.getMapContextData().techId;
    if (techId) {
      orderList4Tech.current = orderListContext.getOrdersByTechId(techId);
    }
  }, [mapContext]);

  return (
    <>
      <div id={"map"} ref={div4MapRef}></div>
      {orderId && <Marker order={orderListContext.getOrderById(orderId)} mapRef={map.current}/>}
      {orderList4Tech.current && orderList4Tech.current.map((order: iOrder): JSX.Element => {
        return (
          <Marker order={order} mapRef={map.current}/>
        )
      })}
    </>
  );
}
