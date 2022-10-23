import * as React from "react";
import { useContext, useEffect, useState } from "react";
import "../../../../../source/img/svgIcons/close-icon.svg";
import "../../../../../source/img/svgIcons/point-dark.svg";
import "../../../../../source/img/svgIcons/three-points.svg";
import "../../../../../source/img/svgIcons/calendar-icon.svg";
import "../../../../../source/img/svgIcons/clock-icon.svg";
import { iPopUpContext, PopUpContext } from "../../../PopUpContext/PopUpContext";
import { PopUpName } from "../PopUpList";
import { iOrder, iOrderListContext, OrderListContext } from "../../OrderListModel/OrderListModel";
import getTagColorClass from "../../../../utils/getTagColorClass";
import { iTechInPopUpContext, TechInPopUpContext } from "../../../PopUpContext/TechInPopUpContext/TechInPopUpContext";
import { iTechListContext, iTechnician, TechListContext } from "../../TechnicianListModel/TechnicianListModel";

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
  mainTechId?: number | null,
  secondTechId?: number | null
}

export default function OrderPopUp({incomingData}: iProps): JSX.Element {
  const popUpContext: iPopUpContext = useContext(PopUpContext);
  const orderListContext: iOrderListContext = useContext(OrderListContext);
  const techInPopUpContext: iTechInPopUpContext = useContext(TechInPopUpContext);
  const techListContext: iTechListContext = useContext(TechListContext);
  const smallPopUpWidth: number = 354;
  const paddingFromOrder: number = 8;
  const paddingTopFromMap: number = 28;
  const paddingLeftFromMap: number = 10;
  const [popUpType, setPopUpType]: [st: OrderPopUpType, set: (st: OrderPopUpType) => void] =
    useState<OrderPopUpType>(incomingData ? incomingData.type : OrderPopUpType.Small);
  const [popUpPosition, setPopUpPosition]: [st: React.CSSProperties, set: (st: React.CSSProperties) => void] =
    useState<React.CSSProperties>({display: "none"});
  const [isPopUpOnMap, setIsPopUpOnMap]: [st: boolean, set: (st: boolean) => void] = useState(false);
  const [beginTime, setBeginTime]: [st: Date, set: (st: Date) => void] = useState<Date>(new Date());
  const [endTime, setEndTime]: [st: Date, set: (st: Date) => void] = useState<Date>(new Date());
  const [mainTech, setMainTech]: [st: iTechnician | null, set: (st: iTechnician | null) => void] =
    useState<iTechnician | null>(null);
  const [secondTech, setSecondTech]: [st: iTechnician | null, set: (st: iTechnician | null) => void] =
    useState<iTechnician | null>(null);

  let orderData: iOrder | null = null;

  if (incomingData) {
    orderData = orderListContext.getOrderById(incomingData.orderId);
  }

  useEffect((): () => void => {
    const pageClickHandler = (event: MouseEvent): void => {
      if ((event.target as HTMLElement).closest(".popup") === null &&
        (event.target as HTMLElement).closest(".btn-save") === null) {
        popUpContext.setData(PopUpName.none, null)
      }
    }

    document.addEventListener("click", pageClickHandler);
    return (): void => {
      document.removeEventListener("click", pageClickHandler);
    };
  }, []);

  useEffect((): void => {
    if (incomingData) {
      if (incomingData.orderElm && incomingData.container && popUpType === OrderPopUpType.Small) {
        const orderElmRect: DOMRect = incomingData.orderElm.getBoundingClientRect();
        const container4Order: DOMRect = incomingData.container.getBoundingClientRect();
        const sizeFromLeftOfOrder: number = orderElmRect.x - container4Order.x;
        const sizeFromRightOfOrder: number =
          (container4Order.x +  container4Order.width) - (orderElmRect.x + orderElmRect.width);
        setPopUpPosition({
          position: "absolute",
          left: sizeFromLeftOfOrder >= sizeFromRightOfOrder
            ? (orderElmRect.x - smallPopUpWidth - paddingFromOrder).toString() + "px"
            : (orderElmRect.x + orderElmRect.width + paddingFromOrder).toString() + "px",
          top: orderElmRect.y
        });
      }

      const order: iOrder | null = orderListContext.getOrderById(incomingData.orderId);
      if (order) {
        setBeginTime(new Date(order.time_slot_from));
        setEndTime(new Date(order.time_slot_to));
        const mainTechId: number | null = techInPopUpContext.getMainTechId();
        const secondTechId: number | null = techInPopUpContext.getSecondTechId();
        if (mainTechId !== null) {
          setMainTech(techListContext.getTechDataById(mainTechId));
        }
        if (secondTechId !== null) {
          setSecondTech(techListContext.getTechDataById(secondTechId));
        }
      }
    }
  }, [incomingData]);

  function getDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  }

  function getTime(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(date).slice(0, -2);
  }

  function getTimeType(date: Date): string {
    return date.getHours() < 12 ? "am" : "pm";
  }

  return (
    <>
      {incomingData && orderData &&
        <div className={"popup" + (popUpType === OrderPopUpType.Big ? " big" : " small")} style={popUpPosition}>
          <div className="close">
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              onClick={(): void => {popUpContext.setData(PopUpName.none, null)}}
            >
              <use href="#close-icon"/>
            </svg>
          </div>
          <div className="status">
            <div className="number">№ {orderData.id}</div>
            <div className={`btn-recall ${getTagColorClass(orderData.type)}`}>{orderData.type}</div>
          </div>
          <div className="info">
            <div className="address">
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                <use href="#point-dark"/>
              </svg>
              <p className="txt">{orderData.address}</p>
            </div>
            <div className="contacts">
              <div className="top">
                <div className="name">{orderData.main_contact_name}</div>
                <div className="description"><span className={"dot-separator"}>&#9679;</span> Service#3 (Toshiba)</div>
              </div>
              <div className="bottom">
                <div className="phone">{orderData.main_contact_phone}</div>
                <div className="mail"><span className={"dot-separator"}>&#9679;</span> mail@mail.com</div>
              </div>
            </div>
          </div>
          {popUpType === OrderPopUpType.Big
            ?
            <>
              <div className="main-text">
                <main className="main-container">
                  <div className="scroll-cont-popup">
                    <div className="scroll-content-wrapper">
                      <article className="content">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                        deleniti atque
                        Corpti quos dolores et quas molestias excuri sint occaecati cupiditate non Provident, similique
                        sunt in
                        culpa qui
                        officia deserunt mollitia animi, id est Laborum et dolorum fuga.
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                        deleniti atque
                        Corpti quos dolores et quas molestias excuri sint occaecati cupiditate non Provident, similique
                        sunt in
                        culpa qui
                        officia deserunt mollitia animi, id est Laborum et dolorum fuga.
                      </article>
                    </div>
                    <div className="scroll-vtrack">
                      <div className="scroll-thumb"></div>
                    </div>
                  </div>
                </main>
              </div>
              <div className="inputs">
                <div className="date">
                  <p className="title">{getDate(beginTime)}</p>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <use href="#calendar-icon"/>
                  </svg>
                </div>
                <div className="time-from time">
                  <p className="title">
                    {getTime(beginTime)} <span>{getTimeType(beginTime)}</span>
                  </p>
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <use href="#clock-icon"/>
                  </svg>
                </div>
                <div className="time-to time">
                  <p className="title">
                    {getTime(endTime)} <span>{getTimeType(endTime)}</span>
                  </p>
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <use href="#clock-icon"/>
                  </svg>
                </div>
              </div>
              <div className="add-block">
                {mainTech &&
                  <div className="added-technical">
                    <div className="left">
                      <div className="person"><img src="https://i.ibb.co/C1ZFCsr/person-1.png" alt="#" /></div>
                      <div className="names">
                        <p className="top">Technicianc</p>
                        <p className="name">{mainTech.name}</p>
                      </div>
                    </div>
                    <div className="right">
                      <svg width="37" height="38" viewBox="0 0 37 38" fill="none">
                        <use href="#three-points" />
                      </svg>
                    </div>
                  </div>
                }
                {secondTech &&
                  <div className="added-technical">
                    <div className="left">
                      <div className="person"><img src="https://i.ibb.co/C1ZFCsr/person-1.png" alt="#" /></div>
                      <div className="names">
                        <p className="top">Technicianc</p>
                        <p className="name">{secondTech.name}</p>
                      </div>
                    </div>
                    <div className="right">
                      <svg width="37" height="38" viewBox="0 0 37 38" fill="none">
                        <use href="#three-points" />
                      </svg>
                    </div>
                  </div>
                }
                {secondTech === null ? <div className="btn-add">Add technicial</div> : null}
              </div>
              <div className="btn-save">Save</div>
            </>
            :
            <div className={"button-row"}>
              {
                isPopUpOnMap
                  ?
                  <>
                    <div className="btn-save" onClick={(): void => {
                      setPopUpPosition({});
                      setPopUpType(OrderPopUpType.Big);
                    }}>
                      Details
                    </div>
                    <div className="white-btn" onClick={(): void => {
                        popUpContext.setData(PopUpName.none, null);
                    }}
                    >Delete search</div>
                  </>
                  :
                  <>
                    <div className="btn-save" onClick={(): void => {
                      setPopUpPosition({});
                      setPopUpType(OrderPopUpType.Big);
                    }}>
                      Details
                    </div>
                    <div className="btn-add-2" onClick={(): void => {
                      const map: HTMLElement | null = document.getElementById("map");
                      if (map) {
                        const mapRect: DOMRect = map.getBoundingClientRect();
                        setPopUpPosition({
                          position: "absolute",
                          left: (mapRect.x + paddingLeftFromMap).toString() + "px",
                          top: (mapRect.top + paddingTopFromMap).toString() + "px"
                        });
                        setPopUpType(OrderPopUpType.Small);
                        setIsPopUpOnMap(true);
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
