import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import "../../../../../source/img/svgIcons/close-icon.svg";
import "../../../../../source/img/svgIcons/point-dark.svg";
import "../../../../../source/img/svgIcons/three-points.svg";
import "../../../../../source/img/svgIcons/calendar-icon.svg";
import "../../../../../source/img/svgIcons/clock-icon.svg";
import "../../../../../source/img/svgIcons/trash.svg";
import "../../../../../source/img/svgIcons/pen.svg";
import { iPopUpContext, PopUpContext } from "../PopUpContext/PopUpContext";
import { iOrder, iOrderListContext, OrderListContext } from "../../OrderListModel/OrderListModel";
import getTagColorClass from "../../../../utils/getTagColorClass";
import { iOrderPopUpContext, OrderPopUpContext } from "../OrderPopUpProvider/OrderPopUpContext";
import { iTechListContext, iTechnician, TechListContext } from "../../TechnicianListModel/TechnicianListModel";
import Scrollbar from "../../../../lib/scrollbar";
import Calendar from "react-calendar";
import TimeDropMenu from "./TimeDropMenu/TimeDropMenu";
import { AddTechOperationType, iAddTechInData } from "../AddTechPopUp/AddTechPopUp";
import { iMapContext, MapContext } from "../../GMap/MapProvider/MapProvider";
import { iMapHeightContext, MapHeightContext } from "../../GMap/MapHeightProvider/MapHeightProvider";
import "./OrderPopUp.scss";
import { iWhiteLayersContext, WhiteLayersContext } from "../../WhiteLayersProvider/WhiteLayersProvider";
import { PopUpName } from "../PopUpList/PopUpListNames";
import TechAvatar from "../../TechAvatar/TechAvatar";
import TechBGCollection from "../../../../utils/TechBGCollection";
import getDateWithSlash from "../../../../utils/getDateWithSlash";
import notCrossNonWorkTimes from "../../../../utils/notCrossNonWorkTimes";
import { iNonWorkTimeErrIdData } from "../TechNonWorkTimeErr/TechNonWorkTimeErr";
import { iTimeSlot } from "../../../../APIInterfaces/iTechResponse";

interface iProps {
  incomingData: iOrderPopUpInData | null
}

export enum OrderPopUpType {
  Small,
  Big
}

export interface iOrderPopUpInData {
  type: OrderPopUpType,
  orderId: number,
  orderElm: HTMLElement | null,
  container: HTMLElement | null,
  isPopUpOnMap: boolean,
  mainTechId?: number | null,
  secondTechId?: number | null
}

export default function OrderPopUp({incomingData}: iProps): JSX.Element {
  const popUpContext: iPopUpContext = useContext(PopUpContext);
  const orderListContext: iOrderListContext = useContext(OrderListContext);
  const orderPopUpContext: iOrderPopUpContext = useContext(OrderPopUpContext);
  const techListContext: iTechListContext = useContext(TechListContext);
  const smallPopUpWidth: number = 354;
  const paddingFromOrder: number = 8;
  const paddingTopFromMap: number = 28;
  const paddingLeftFromMap: number = 10;
  const [popUpType, setPopUpType]: [st: OrderPopUpType, set: (st: OrderPopUpType) => void] =
    useState<OrderPopUpType>(incomingData ? incomingData.type : OrderPopUpType.Small);
  const popUpTypeRef: React.MutableRefObject<OrderPopUpType> =
    useRef<OrderPopUpType>(incomingData ? incomingData.type : OrderPopUpType.Small);
  const [popUpPosition, setPopUpPosition]: [st: React.CSSProperties, set: (st: React.CSSProperties) => void] =
    useState<React.CSSProperties>({display: "none"});
  const [isPopUpOnMap, setIsPopUpOnMap]: [st: boolean, set: (st: boolean) => void] =
    useState(incomingData ? incomingData.isPopUpOnMap : false);
  const isPopUpOnMapRef: React.MutableRefObject<boolean> =
    useRef<boolean>(incomingData ? incomingData.isPopUpOnMap : false);
  const [beginTime, setBeginTime]: [st: Date, set: (st: Date) => void] = useState<Date>(new Date());
  const [endTime, setEndTime]: [st: Date, set: (st: Date) => void] = useState<Date>(new Date());
  const [mainTech, setMainTech]: [st: iTechnician | null, set: (st: iTechnician | null) => void] =
    useState<iTechnician | null>(null);
  const [secondTech, setSecondTech]: [st: iTechnician | null, set: (st: iTechnician | null) => void] =
    useState<iTechnician | null>(null);
  const [isShowScroll4Info, setIsShowScroll4Info]: [st: boolean, set: (st: boolean) => void] = useState(false);
  const isShowCalendar: React.MutableRefObject<boolean> = useRef<boolean>(false);
  const [showCalendar, setShowCalendar]: [st: boolean, set: (st: boolean) => void] = useState(false);
  const [calendarDate, setCalendarDate]: [st: Date, set: (st: Date) => void] = useState(new Date());
  const isShowBeginTimeDrop: React.MutableRefObject<boolean> = useRef<boolean>(false);
  const [showBeginTimeDrop, setShowBeginTimeDrop]: [st: boolean, set: (st: boolean) => void] = useState(false);
  const isShowEndTimeDrop: React.MutableRefObject<boolean> = useRef<boolean>(false);
  const [showEndTimeDrop, setShowEndTimeDrop]: [st: boolean, set: (st: boolean) => void] = useState(false);
  const [isDateWrong, setIsDateWrong]: [st: boolean, set: (st: boolean) => void] = useState(false);
  const [isBeginTimeWrong, setIsBeginTimeWrong]: [st: boolean, set: (st: boolean) => void] = useState(false);
  const [isEndTimeWrong, setIsEndTimeWrong]: [st: boolean, set: (st: boolean) => void] = useState(false);
  const isShowMenu4MainTech: React.MutableRefObject<boolean> = useRef<boolean>(false);
  const [showMenu4MainTech, setShowMenu4MainTech]: [st: boolean, set: (st: boolean) => void] = useState(false);
  const isShowMenu4SecondTech: React.MutableRefObject<boolean> = useRef<boolean>(false);
  const [showMenu4SecondTech, setShowMenu4SecondTech]: [st: boolean, set: (st: boolean) => void] = useState(false);
  const mapContext: iMapContext = useContext<iMapContext>(MapContext);
  const mapHeightContext: iMapHeightContext = useContext<iMapHeightContext>(MapHeightContext);
  const [isShowPopUpAnim, setIsShowPopUpAnim]: [st: boolean, set: (st: boolean) => void] = useState(true);
  const whiteLayersContext: iWhiteLayersContext = useContext<iWhiteLayersContext>(WhiteLayersContext);

  const mapResizeObserver: React.MutableRefObject<ResizeObserver> =
    useRef<ResizeObserver>(new ResizeObserver((): void => {
      const popUpContainer: HTMLElement | null = document.getElementById("popup-order-container");
      const mapElm: HTMLElement | null = document.getElementById("map");
      if (popUpContainer && mapElm) {
        popUpContainer.style.top = (mapElm.getBoundingClientRect().top + paddingTopFromMap).toString() + "px"
      }
  }));

  const docResizeObserver: React.MutableRefObject<ResizeObserver> =
    useRef<ResizeObserver>(new ResizeObserver((): void => {
      if (isPopUpOnMapRef.current) {
        setPopUpPosOnMap();
      }
      if (popUpTypeRef.current === OrderPopUpType.Small && !isPopUpOnMapRef.current) {
        setPopUpPosOnOrder();
      }
  }));

  let orderData: iOrder | null = null;

  if (incomingData) {
    orderData = orderListContext.getOrderById(incomingData.orderId);
  }

  useEffect((): () => void => {
    const pageClickHandler = (): void => {
      // ???????????? ?????? ??????????: ?????????? ???????????????????????? ???????????????? ???? ???????????? ??????????????????, ???? ?????????????????????? ?????????????????? ???? ??????????
      // ????????????????????, ???? ???????????? ?????????? ?????????? ?????????????????????? ?????????????? click ?? ?????????? ?????? ???????? ???????? ???? ?????????????????? ?????? ????????????
      // ?????????????? ???? ?????????????????????? isShowCalendar.current
      if (isShowCalendar.current) {
        isShowCalendar.current = false;
        setShowCalendar(false);
      } else {
        isShowCalendar.current = true;
      }

      if (isShowBeginTimeDrop.current) {
        isShowBeginTimeDrop.current = false;
        setShowBeginTimeDrop(false);
      } else {
        isShowBeginTimeDrop.current = true;
      }

      if (isShowEndTimeDrop.current) {
        isShowEndTimeDrop.current = false;
        setShowEndTimeDrop(false);
      } else {
        isShowEndTimeDrop.current = true;
      }

      if (isShowMenu4MainTech.current) {
        isShowMenu4MainTech.current = false;
        setShowMenu4MainTech(false);
      } else {
        isShowMenu4MainTech.current = true;
      }

      if (isShowMenu4SecondTech.current) {
        isShowMenu4SecondTech.current = false;
        setShowMenu4SecondTech(false);
      } else {
        isShowMenu4SecondTech.current = true;
      }
    }

    if (!isPopUpOnMapRef.current) {
      mapContext.setOrderId(null);
    }
    document.addEventListener("click", pageClickHandler);
    const bodyElm: HTMLElement | null = document.querySelector("body");
    if (bodyElm) {
      docResizeObserver.current.observe(bodyElm);
    }
    return (): void => {
      document.removeEventListener("click", pageClickHandler);
      docResizeObserver.current.disconnect();
      mapResizeObserver.current.disconnect();
    };
  }, []);

  useEffect((): () => void => {
    popUpTypeRef.current = popUpType;
    let scrollbar: Scrollbar | null = null;

    const showScrollHandler = (isShow: boolean): void => {
      setIsShowScroll4Info(isShow);
    }

    if (popUpType === OrderPopUpType.Big) {
      const orderInfoScrollCont: HTMLElement | null = document.getElementById("order-popup-info-scroll");
      if (orderInfoScrollCont) {
        scrollbar = new Scrollbar();
        scrollbar.init(orderInfoScrollCont);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        scrollbar.showScrollListener(showScrollHandler);
      }
    }
    return (): void => {
      if (scrollbar) {
        scrollbar.destroy();
      }
    };
  }, [popUpType]);

  useEffect((): void => {
    if (incomingData) {
      if (incomingData.isPopUpOnMap) {
        setPopUpPosOnMap()
      } else {
        setPopUpPosOnOrder();
      }

      if (incomingData.type === OrderPopUpType.Big) {
        setPopUpPosition({});
      }

      if (incomingData.mainTechId !== undefined && incomingData.secondTechId !== undefined) {
        orderPopUpContext.setTechIds(incomingData.mainTechId, incomingData.secondTechId);
      }
   }
  }, [incomingData]);

  useEffect((): void => {
    const orderBeginTime: Date | null = orderPopUpContext.getBeginTime();
    const orderEndTime: Date | null = orderPopUpContext.getEndTime();
    if (orderBeginTime) {
      setBeginTime(orderBeginTime);
      setCalendarDate(orderBeginTime);
    }
    if (orderEndTime) {
      setEndTime(orderEndTime);
    }
    const mainTechId: number | null = orderPopUpContext.getMainTechId();
    const secondTechId: number | null = orderPopUpContext.getSecondTechId();
    if (mainTechId !== null) {
      setMainTech(techListContext.getTechDataById(mainTechId));
    } else {
      setMainTech(null);
    }
    if (secondTechId !== null) {
      setSecondTech(techListContext.getTechDataById(secondTechId));
    } else {
      setSecondTech(null);
    }
  }, [orderPopUpContext]);

  function getTime(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(date).slice(0, -3);
  }

  function getTimeType(date: Date): string {
    return date.getHours() < 12 ? "am" : "pm";
  }

  useEffect((): void => {
    setIsDateWrong(false);
    if (!showCalendar) {
      return;
    }
    const orderBeginTime: Date | null = orderPopUpContext.getBeginTime();
    const orderEndTime: Date | null = orderPopUpContext.getEndTime();
    if (orderBeginTime && orderEndTime) {
      orderBeginTime.setFullYear(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate());
      orderEndTime.setFullYear(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate());
      orderPopUpContext.setTimes(orderBeginTime, orderEndTime);
    }
    setShowCalendar(false);
  }, [calendarDate]);

  function beginTChangeHour(newHour: number): void {
    setIsBeginTimeWrong(false);
    const orderBeginTime: Date | null = orderPopUpContext.getBeginTime();
    const orderEndTime: Date | null = orderPopUpContext.getEndTime();
    if (orderBeginTime && orderEndTime) {
      orderBeginTime.setHours(convert12To42(orderBeginTime, newHour));
      orderPopUpContext.setTimes(orderBeginTime, orderEndTime);
    }
  }

  function beginTChangeMinute(newMinutes: number): void {
    setIsBeginTimeWrong(false);
    const orderBeginTime: Date | null = orderPopUpContext.getBeginTime();
    const orderEndTime: Date | null = orderPopUpContext.getEndTime();
    if (orderBeginTime && orderEndTime) {
      orderBeginTime.setMinutes(newMinutes);
      orderPopUpContext.setTimes(orderBeginTime, orderEndTime);
    }
  }

  function endTChangeHour(newHour: number): void {
    setIsEndTimeWrong(false);
    const orderBeginTime: Date | null = orderPopUpContext.getBeginTime();
    const orderEndTime: Date | null = orderPopUpContext.getEndTime();
    if (orderBeginTime && orderEndTime) {
      orderEndTime.setHours(convert12To42(orderEndTime, newHour));
      orderPopUpContext.setTimes(orderBeginTime, orderEndTime);
    }
  }

  function endTChangeMinute(newMinutes: number): void {
    setIsEndTimeWrong(false);
    const orderBeginTime: Date | null = orderPopUpContext.getBeginTime();
    const orderEndTime: Date | null = orderPopUpContext.getEndTime();
    if (orderBeginTime && orderEndTime) {
      orderEndTime.setMinutes(newMinutes);
      orderPopUpContext.setTimes(orderBeginTime, orderEndTime);
    }
  }

  function convert12To42(date: Date, hour: number): number {
    const isPM: boolean = date.getHours() >= 12;
    if (isPM && hour < 12) {
      hour += 12;
    }
    if (!isPM && hour === 12) {
      hour = 0;
    }
    return hour;
  }

  function switchHourInBeginT(): void {
    const orderBeginTime: Date | null = orderPopUpContext.getBeginTime();
    const orderEndTime: Date | null = orderPopUpContext.getEndTime();
    if (orderBeginTime && orderEndTime) {
      const isPM: boolean = orderBeginTime.getHours() >= 12;
      if (isPM) {
        orderBeginTime.setHours(orderBeginTime.getHours() - 12);
      } else {
        orderBeginTime.setHours(orderBeginTime.getHours() + 12);
      }
      orderPopUpContext.setTimes(orderBeginTime, orderEndTime);
    }
  }

  function switchHourInEndT(): void {
    const orderBeginTime: Date | null = orderPopUpContext.getBeginTime();
    const orderEndTime: Date | null = orderPopUpContext.getEndTime();
    if (orderBeginTime && orderEndTime) {
      const isPM: boolean = orderEndTime.getHours() >= 12;
      if (isPM) {
        orderEndTime.setHours(orderEndTime.getHours() - 12);
      } else {
        orderEndTime.setHours(orderEndTime.getHours() + 12);
      }
      orderPopUpContext.setTimes(orderBeginTime, orderEndTime);
    }
  }

  function saveBtnHandler(): void {
    let isValid: boolean = true;
    const today: Date = new Date();
    today.setHours(0,0,0,0);
    const orderBeginTime: Date | null = orderPopUpContext.getBeginTime();
    const orderEndTime: Date | null = orderPopUpContext.getEndTime();
    const mainTechId: number | null = orderPopUpContext.getMainTechId();
    const secondTechId: number | null = orderPopUpContext.getSecondTechId();

    if (!orderBeginTime || !orderEndTime) {
      return
    }
    if (today.getTime() > orderBeginTime.getTime()) {
      isValid = false;
      setIsDateWrong(true);
    }

    if (orderBeginTime.getHours() < 7 || orderBeginTime.getHours() > 21) {
      isValid = false;
      setIsBeginTimeWrong(true);
    }

    if (orderEndTime.getHours() < 7 || orderEndTime.getHours() > 21) {
      isValid = false;
      setIsEndTimeWrong(true);
    }

    if (orderBeginTime.getTime() > orderEndTime.getTime()) {
      isValid = false;
      setIsEndTimeWrong(true);
    }

    if (mainTechId === null) {
      isValid = false;
      popUpContext.setData(PopUpName.simpleError, null);
      mapContext.setOrderId(null);
      mapContext.setTechId(null);
      mapHeightContext.decreaseMap();
    }

    if (!checkTechNonWorkTime(mainTechId, orderBeginTime, orderEndTime)) {
      isValid = false;
    }

    if (!checkTechNonWorkTime(secondTechId, orderBeginTime, orderEndTime)) {
      isValid = false;
    }

    if (!orderData || !isValid) {
      return;
    }

    whiteLayersContext.setWhite(
      false,
      false,
      whiteLayersContext.data.techId !== null,
      false,
      null
    );
    orderListContext.updateOrder(orderData.id, mainTechId, secondTechId, orderBeginTime, orderEndTime);
    popUpContext.setData(PopUpName.none, null)
  }

  function checkTechNonWorkTime(techId: number | null, orderBeginTime: Date, orderEndTime: Date): boolean {
    if (techId === null || !incomingData) {
      return true;
    }
    const techData: iTechnician | null = techListContext.getTechDataById(techId);
    if (!techData) {
      return true;
    }
    const techNonWorkingTime: iTimeSlot[] | null = techData.non_working_times;
    if (!techNonWorkingTime || techNonWorkingTime.length === 0) {
      return true;
    }
    if (!notCrossNonWorkTimes(techNonWorkingTime, orderBeginTime, orderEndTime)) {
      mapContext.setOrderId(null);
      mapContext.setTechId(null);
      mapHeightContext.decreaseMap();
      whiteLayersContext.showAllWhite();
      const transmittedData: iNonWorkTimeErrIdData = {
        orderId: incomingData.orderId,
        techId: techId,
        orderBeginTime: orderBeginTime,
        orderEndTime: orderEndTime
      }
      popUpContext.setData(PopUpName.techTimeErr, transmittedData);
      return false;
    }
    return true;
  }

  function removeSecondTech(): void {
    const mainTechId: number | null = orderPopUpContext.getMainTechId();
    orderPopUpContext.setTechIds(mainTechId, null);
  }

  useEffect((): void => {
    isPopUpOnMapRef.current = isPopUpOnMap;
    const mapElm: HTMLElement | null = document.getElementById("map");
    if (isPopUpOnMap && mapElm) {
      mapResizeObserver.current.observe(mapElm);
    }
    if (!isPopUpOnMap) {
      mapResizeObserver.current.disconnect();
    }
  }, [isPopUpOnMap]);

  function detailsClickHandler(orderData: iOrder | null): void {
    setPopUpPosition({});
    setIsShowPopUpAnim(true);
    setIsPopUpOnMap(false);
    setPopUpType(OrderPopUpType.Big);
    if (orderData) {
      whiteLayersContext.setWhite(
        true,
        true,
        true,
        undefined,
        orderData.id
      );
    }
  }

  function setPopUpPosOnMap(): void {
    const map: HTMLElement | null = document.getElementById("map");
    if (map) {
      const mapRect: DOMRect = map.getBoundingClientRect();
      setPopUpPosition({
        position: "absolute",
        left: (mapRect.x + paddingLeftFromMap).toString() + "px",
        top: (mapRect.top + paddingTopFromMap).toString() + "px"
      });
    }
  }

  function setPopUpPosOnOrder(): void {
    if (incomingData) {
      if (incomingData.orderElm && incomingData.container && popUpType === OrderPopUpType.Small) {
        const orderElmRect: DOMRect = incomingData.orderElm.getBoundingClientRect();
        const container4Order: DOMRect = incomingData.container.getBoundingClientRect();
        const sizeFromLeftOfOrder: number = orderElmRect.x - container4Order.x;
        const sizeFromRightOfOrder: number =
          (container4Order.x + container4Order.width) - (orderElmRect.x + orderElmRect.width);
        setPopUpPosition({
          position: "absolute",
          left: sizeFromLeftOfOrder >= sizeFromRightOfOrder
            ? (orderElmRect.x - smallPopUpWidth - paddingFromOrder).toString() + "px"
            : (orderElmRect.x + orderElmRect.width + paddingFromOrder).toString() + "px",
          top: orderElmRect.y
        });
      }
    }
  }

  return (
    <>
      {incomingData && orderData &&
        <div
          id={"popup-order-container"}
          className={"popup" +
            (popUpType === OrderPopUpType.Big ? " big" : " small") +
            (isShowPopUpAnim ? " popup-show-anim" : "")}
          style={popUpPosition}
          onAnimationEnd={(): void => {setIsShowPopUpAnim(false)}}
        >
          <div className="close">
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              onClick={(): void => {
                popUpContext.setData(PopUpName.none, null);
                mapContext.setOrderId(null);
                if (mapContext.getMapContextData().techId === null) {
                  mapHeightContext.decreaseMap();
                  whiteLayersContext.hideAllWhite();
                } else {
                  whiteLayersContext.setWhite(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    null
                  );
                }
              }}
            >
              <use href="#close-icon"/>
            </svg>
          </div>
          <div className="status">
            <div className="number">??? {orderData.id}</div>
            <div className={`btn-recall ${getTagColorClass(orderData.type)}`}>{orderData.type}</div>
          </div>
          <div className="info">
            <div className="address">
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                <use href="#point-dark"/>
              </svg>
              <p
                className="txt"
                onClick={(): void => {
                  const popUpContainer: HTMLElement | null = document.getElementById("popup-order-container");
                  if (popUpContainer && !isPopUpOnMap) {
                    const popUpRect: DOMRect = popUpContainer.getBoundingClientRect();
                    // ???????????????????? ?????????? ???????????? ???????????????? popUp ?? ???????????? ???????????????? ????????????????
                    const deltaHeight: number = window.innerHeight - (popUpRect.y + popUpRect.height);
                    if (orderData) {
                      mapContext.setOrderId(orderData.id);
                      mapHeightContext.setHeight(deltaHeight);
                      whiteLayersContext.setWhite(
                        true,
                        true,
                        undefined,
                        false,
                        orderData.id
                      );
                    }
                  }
                }}
              >{orderData.address}</p>
            </div>
            <div className="contacts">
              <div className="top">
                <div className="name">{orderData.main_contact_name}</div>
                {
                  orderData.appliance && orderData.appliance.length > 0 &&
                    <>
                      <div className={"dot-separator"}>&#9679;</div>
                      <div className="description">{orderData.appliance}</div>
                    </>
                }
              </div>
              <div className="bottom">
                <div className="phone">{orderData.main_contact_phone}</div>
                {
                  orderData.main_contact_email && orderData.main_contact_email.length > 0 &&
                  <>
                    <div className={"dot-separator"}>&#9679;</div>
                    <div className="mail">{orderData.main_contact_email}</div>
                  </>
                }
              </div>
            </div>
          </div>
          {popUpType === OrderPopUpType.Big
            ?
            <>
              <div className={"main-text" + (isShowScroll4Info ? " main-text-go-scroll" : "")}>
                <div className="main-container">
                  <div id="order-popup-info-scroll" className="scroll-cont scroll-cont-popup">
                    <div className="scroll-content-wrapper">
                      <div className="content">{orderData.description}</div>
                    </div>
                    <div className="scroll-vtrack border-radius">
                      <div className="scroll-thumb"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inputs">
                <div className={"date" + (isDateWrong ? " time-error": "")} onClick={(): void => {
                  isShowCalendar.current = false;
                  setShowCalendar(true);
                }}>
                  <p className="title">{getDateWithSlash(beginTime)}</p>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <use href="#calendar-icon"/>
                  </svg>
                  <div className={"popup-calendar-cont" + (showCalendar ? "" : " hide")}>
                    <Calendar calendarType={"US"} locale={"en"} value={calendarDate} onChange={setCalendarDate} />
                  </div>
                </div>
                <div className={"time-from time" + (isBeginTimeWrong ? " time-error" : "")}>
                  <div>
                    <div className={"time-inline-block time-padding-right"} onClick={(): void => {
                      isShowBeginTimeDrop.current = false;
                      setShowBeginTimeDrop(true);
                    }}>
                      {getTime(beginTime)}
                    </div>
                    <div className={"time-inline-block"} onClick={(): void => {
                      switchHourInBeginT();
                    }}>
                      {getTimeType(beginTime)}
                    </div>
                  </div>
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <use href="#clock-icon"/>
                  </svg>
                  <div className={"time-drop-menu-cont" + (showBeginTimeDrop ? "" : " hide")}>
                    <TimeDropMenu
                      dateProp={beginTime}
                      changeHour={beginTChangeHour}
                      changeMinute={beginTChangeMinute}
                      isMenuShow={showBeginTimeDrop}
                    />
                  </div>
                </div>
                <div className={"time-to time" + (isEndTimeWrong ? " time-error" : "")}>
                  <div>
                    <div className={"time-inline-block time-padding-right"} onClick={(): void => {
                      isShowEndTimeDrop.current = false;
                      setShowEndTimeDrop(true);
                    }}>
                      {getTime(endTime)}
                    </div>
                    <div className={"time-inline-block"} onClick={(): void => {
                      switchHourInEndT();
                    }}>
                      {getTimeType(endTime)}
                    </div>
                  </div>
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <use href="#clock-icon"/>
                  </svg>
                  <div className={"time-drop-menu-cont" + (showEndTimeDrop ? "" : " hide")}>
                    <TimeDropMenu
                      dateProp={endTime}
                      changeHour={endTChangeHour}
                      changeMinute={endTChangeMinute}
                      isMenuShow={showEndTimeDrop}
                    />
                  </div>
                </div>
              </div>
              <div className="add-block">
                {mainTech &&
                  <div className="added-technical">
                    <div className="left">
                      <div className="person">
                        <TechAvatar
                          url={mainTech.avatar}
                          techName={mainTech.name}
                          bgColor={TechBGCollection.getInstance().getBGColor(mainTech.id)}
                        />
                      </div>
                      <div className="names">
                        <p className="top">Technicianc</p>
                        <p className="name">{mainTech.name}</p>
                      </div>
                    </div>
                    <div className="right">
                      <svg width="37" height="38" viewBox="0 0 37 38" fill="none" onClick={(): void => {
                        isShowMenu4MainTech.current = false;
                        setShowMenu4MainTech(true);
                      }}>
                        <use href="#three-points" />
                      </svg>
                      <div className={"tech-drop-menu-cont" + (showMenu4MainTech ? "" : " hide")}>
                        <div className="delete-popup">
                          <div className="bottom" onClick={(): void => {
                            if (!orderData) {
                              return;
                            }
                            const transmittedData: iAddTechInData = {
                              orderId: orderData.id,
                              operationType: AddTechOperationType.AddMainTech,
                              mainTechId: mainTech ? mainTech.id : null,
                              secondTechId: secondTech ? secondTech.id : null
                            }
                            popUpContext.setData(PopUpName.addTech, transmittedData);
                          }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <use href="#pen" />
                            </svg>
                            <p className="title">Edit</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                {secondTech &&
                  <div className="added-technical">
                    <div className="left">
                      <div className="person">
                        <TechAvatar
                          url={secondTech.avatar}
                          techName={secondTech.name}
                          bgColor={TechBGCollection.getInstance().getBGColor(secondTech.id)}
                        />
                      </div>
                      <div className="names">
                        <p className="top">Technicianc</p>
                        <p className="name">{secondTech.name}</p>
                      </div>
                    </div>
                    <div className="right">
                      <svg width="37" height="38" viewBox="0 0 37 38" fill="none" onClick={(): void => {
                        isShowMenu4SecondTech.current = false;
                        setShowMenu4SecondTech(true);
                      }}>
                        <use href="#three-points" />
                      </svg>
                      <div className={"tech-drop-menu-cont" + (showMenu4SecondTech ? "" : " hide")}>
                        <div className="delete-popup">
                          <div className="top" onClick={(): void => {removeSecondTech();}}>
                            <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                              <use href="#trash" />
                            </svg>
                            <p className="title">Delete</p>
                          </div>
                          <div className="bottom" onClick={(): void => {
                            if (!orderData) {
                              return;
                            }
                            const transmittedData: iAddTechInData = {
                              orderId: orderData.id,
                              operationType: AddTechOperationType.AddSecondTech,
                              mainTechId: mainTech ? mainTech.id : null,
                              secondTechId: secondTech ? secondTech.id : null
                            }
                            popUpContext.setData(PopUpName.addTech, transmittedData);
                          }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <use href="#pen" />
                            </svg>
                            <p className="title">Edit</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                {secondTech === null
                  ?
                  <div
                    className="btn-add"
                    onClick={(): void => {
                      if (!orderData) {
                        return;
                      }
                      const transmittedData: iAddTechInData = {
                        orderId: orderData.id,
                        operationType: mainTech ? AddTechOperationType.AddSecondTech : AddTechOperationType.AddMainTech,
                        mainTechId: mainTech ? mainTech.id : null,
                        secondTechId: null
                      }
                      popUpContext.setData(PopUpName.addTech, transmittedData);
                    }}
                  >Add technician</div>
                  : null
                }
              </div>
              <div className="btn-save" onClick={(): void => {saveBtnHandler()}}>Save</div>
            </>
            :
            <div className={"button-row"}>
              {
                isPopUpOnMap
                  ?
                  <>
                    <div className="btn-save" onClick={(): void => {detailsClickHandler(orderData)}}>Details</div>
                    <div className="white-btn" onClick={(): void => {
                      popUpContext.setData(PopUpName.none, null);
                      mapContext.setOrderId(null);
                      mapContext.setTechId(null);
                      mapHeightContext.decreaseMap();
                      whiteLayersContext.hideAllWhite();
                    }}
                    >Delete search</div>
                  </>
                  :
                  <>
                    <div className="btn-save" onClick={(): void => {detailsClickHandler(orderData)}}>Details</div>
                    <div className="btn-add-2" onClick={(): void => {
                      setPopUpPosOnMap()
                      setIsShowPopUpAnim(true);
                      setPopUpType(OrderPopUpType.Small);
                      setIsPopUpOnMap(true);
                      if (orderData) {
                        mapContext.setOrderId(orderData.id);
                        mapHeightContext.increaseMap();
                        whiteLayersContext.setWhite(
                          true,
                          true,
                          false,
                          false,
                          orderData.id
                        );
                      }
                    }}
                    >Mark on the map</div>
                  </>
              }
            </div>
          }
        </div>
      }
    </>
  );
}
