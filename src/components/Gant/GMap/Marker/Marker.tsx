import * as React from "react";
import { useContext, useEffect, useRef } from "react";
import { iOrder, iOrderListContext, OrderListContext } from "../../OrderListModel/OrderListModel";
import markerIconRed from "../../../../../source/img/map-marker-red.svg";
import markerIconBlue from "../../../../../source/img/map-marker-blue.svg";
import { iOrderPopUpInData, OrderPopUpType } from "../../PopUp/OrderPopUp/OrderPopUp";
import { PopUpName } from "../../PopUp/PopUpList/PopUpList";
import { iOrderPopUpContext, OrderPopUpContext } from "../../PopUp/OrderPopUpProvider/OrderPopUpContext";
import { iPopUpContext, PopUpContext } from "../../PopUp/PopUpContext/PopUpContext";
import { iWhiteLayersContext, WhiteLayersContext } from "../../WhiteLayersProvider/WhiteLayersProvider";
import { iMapContext, MapContext } from "../MapProvider/MapProvider";

interface iProps {
  order: iOrder | null,
  mapRef: google.maps.Map | null
  markerType: MarkerType
}

export enum MarkerType {
  Blue,
  Red
}

export default function Marker({order, mapRef, markerType}: iProps): JSX.Element {
  const markerRef: React.MutableRefObject<google.maps.Marker | null> = useRef<google.maps.Marker | null>(null);
  const infoWindow: React.MutableRefObject<google.maps.InfoWindow | null> = useRef<google.maps.InfoWindow | null>(null);
  const orderListContext: iOrderListContext = useContext(OrderListContext);
  const techInPopUpContext: iOrderPopUpContext = useContext(OrderPopUpContext);
  const popUpContext: iPopUpContext = useContext(PopUpContext);
  const whiteLayersContext: iWhiteLayersContext = useContext<iWhiteLayersContext>(WhiteLayersContext);
  const mapContext: iMapContext = useContext<iMapContext>(MapContext);

  useEffect((): () => void => {
    const markerClickHandler = (): void => {
      if (order && order.id !== mapContext.getMapContextData().orderId) {
        mapContext.setOrderId(null);

        techInPopUpContext.setTechIds(
          orderListContext.getMainTechId(order.id),
          orderListContext.getSecondTechId(order.id)
        );
        techInPopUpContext.setTimes(new Date(order.time_slot_from), new Date(order.time_slot_to));
        const transmittedData: iOrderPopUpInData = {
          type: OrderPopUpType.Small,
          orderId: order.id,
          orderElm: null,
          container: null,
          isPopUpOnMap: true
        }
        popUpContext.setData(PopUpName.orderPopUp, transmittedData);
        whiteLayersContext.setWhite(
          undefined,
          undefined,
          undefined,
          false,
          order.id
        );
      }
    }

    if (order && mapRef) {
      markerRef.current = new google.maps.Marker({
        map: mapRef,
        position: new google.maps.LatLng(
          Number(order.coords.split(";")[0]),
          Number(order.coords.split(";")[1])
        ),
        icon: markerType === MarkerType.Red ? markerIconRed : markerIconBlue
      });
      infoWindow.current = new google.maps.InfoWindow({
        content: `${getTime12Format(new Date(order.time_slot_from))} - ${getTime12Format(new Date(order.time_slot_to))}`,
        disableAutoPan: true
      });
      infoWindow.current.open(mapRef, markerRef.current);
      if (markerRef.current) {
        markerRef.current.addListener("click", markerClickHandler);
      }
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
