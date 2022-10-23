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
  container: HTMLElement | null
}

export default function OrderPopUp({incomingData}: iProps): JSX.Element {
  const popUpContext: iPopUpContext = useContext(PopUpContext);
  const orderListContext: iOrderListContext = useContext(OrderListContext);
  const smallPopUpWidth: number = 354;
  const padding: number = 8;
  const [popUpType, setPopUpType]: [st: OrderPopUpType, set: (st: OrderPopUpType) => void] =
    useState<OrderPopUpType>(incomingData ? incomingData.type : OrderPopUpType.Small);

  let orderData: iOrder | null = null;
  let popUpStyles: React.CSSProperties = {};

  if (incomingData) {
    orderData = orderListContext.getOrderById(incomingData.orderId);

    if (incomingData.orderElm && incomingData.container && popUpType === OrderPopUpType.Small) {
      const orderElmRect: DOMRect = incomingData.orderElm.getBoundingClientRect();
      const container4Order: DOMRect = incomingData.container.getBoundingClientRect();
      const sizeFromLeftOfOrder: number = orderElmRect.x - container4Order.x;
      const sizeFromRightOfOrder: number =
        (container4Order.x +  container4Order.width) - (orderElmRect.x + orderElmRect.width);
      popUpStyles = {
        position: "absolute",
        left: sizeFromLeftOfOrder >= sizeFromRightOfOrder
          ? (orderElmRect.x - smallPopUpWidth - padding).toString() + "px"
          : (orderElmRect.x + orderElmRect.width + padding).toString() + "px",
        top: orderElmRect.y
      }
    }
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

  return (
    <>
      {incomingData && orderData &&
        <div className={"popup" + (popUpType === OrderPopUpType.Big ? " big" : " small")} style={popUpStyles}>
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
            <div className="number">
              № {orderData.id}
            </div>
            <div className={`btn-recall ${getTagColorClass(orderData.type)}`}>
              {orderData.type}
            </div>
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
                <div className="name">
                  {orderData.main_contact_name}
                </div>
                <div className="description">
                  <span className={"dot-separator"}>&#9679;</span> Service#3 (Toshiba)
                </div>
              </div>
              <div className="bottom">
                <div className="phone">
                  {orderData.main_contact_phone}
                </div>
                <div className="mail">
                  <span className={"dot-separator"}>&#9679;</span> mail@mail.com
                </div>
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
                  <p className="title">
                    15/03/2022
                  </p>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <use href="#calendar-icon"/>
                  </svg>
                </div>
                <div className="time-from time">
                  <p className="title">
                    10:45 am
                  </p>
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <use href="#clock-icon"/>
                  </svg>
                </div>
                <div className="time-to time">
                  <p className="title">
                    2:00 pm
                  </p>
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <use href="#clock-icon"/>
                  </svg>
                </div>
              </div>
              <div className="add-block">
                <div className="added-technical">
                  <div className="left">
                    <div className="person">
                      <img src="https://i.ibb.co/C1ZFCsr/person-1.png" alt="#" />
                    </div>
                    <div className="names">
                      <p className="top">
                        Technicianc
                      </p>
                      <p className="name">
                        Vasiliy Popandoplus
                      </p>
                    </div>
                  </div>
                  <div className="right">
                    <svg width="37" height="38" viewBox="0 0 37 38" fill="none">
                      <use href="#three-points" />
                    </svg>
                  </div>
                </div>
                <div className="btn-add">
                  Add technicial
                </div>
              </div>
              <div className="btn-save">
                Save
              </div>
            </>
            :
            <div className={"button-row"}>
              <div className="btn-save" onClick={(): void => {
                setPopUpType(OrderPopUpType.Big);
              }}>
                Details
              </div>
              <div className="btn-add-2">
                Mark on the map
              </div>
            </div>
          }
        </div>
      }
    </>
  );
}
