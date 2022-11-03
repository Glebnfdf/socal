import * as React from "react";
import "../../../../source/img/svgIcons/points.svg";
import "../../../../source/img/svgIcons/but.svg";
import { useContext, useEffect, useRef, useState } from "react";
import { iTechListContext, iTechnician, TechListContext } from "../TechnicianListModel/TechnicianListModel";
import Diagram from "../Diagram/Diagram";
import { iOrder, iOrderListContext, OrderListContext } from "../OrderListModel/OrderListModel";
import { iOrderDropData, OrderDropData } from "../../../utils/OrderDropData";
import { DragItemType } from "../../../utils/DragItemType";
import isBeginTimeNotOld from "../../../utils/isBeginTimeNotOld";
import Scrollbar from "../../../lib/scrollbar";
import { iMapContext, MapContext } from "../GMap/MapProvider/MapProvider";
import { iMapHeightContext, MapHeightContext } from "../GMap/MapHeightProvider/MapHeightProvider";
import { iWhiteLayersContext, WhiteLayersContext } from "../WhiteLayersProvider/WhiteLayersProvider";

export default function TechnicianList(): JSX.Element {
  const techListContext: iTechListContext = useContext(TechListContext);
  const orderListContext: iOrderListContext = useContext(OrderListContext);
  const [techList, setTechList]: [st: iTechnician[] | null, set: (st: iTechnician[] | null) => void] =
    useState<iTechnician[] | null>(null);
  const mapContext: iMapContext = useContext<iMapContext>(MapContext);
  const mapHeightContext: iMapHeightContext = useContext<iMapHeightContext>(MapHeightContext);
  const whiteLayersContext: iWhiteLayersContext = useContext<iWhiteLayersContext>(WhiteLayersContext);
  const [isShowWhiteLayer, setIsShowWhiteLayer]: [st: boolean, set: (st: boolean) => void] =
    useState(whiteLayersContext.data.showTechWhite);
  const scrollbar: React.MutableRefObject<Scrollbar> = useRef<Scrollbar>(new Scrollbar());

  useEffect((): () => void => {
    const techScrollContainer: HTMLElement | null = document.getElementById("tech-scrollbar");
    if (techScrollContainer) {
      scrollbar.current.init(techScrollContainer);
    }
    return (): void => {
      scrollbar.current.destroy();
    };
  }, []);

  useEffect((): void => {
    setTechList([...techListContext.techList])
  }, [techListContext.techList]);

  function diagramDragOver(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();

    if (localStorage.getItem("dragItemType") === DragItemType.Order && isBeginTimeNotOld()) {
      event.dataTransfer.dropEffect = "move";
    } else {
      event.dataTransfer.dropEffect = "none";
    }
  }

  function orderDropHandler(event: React.DragEvent<HTMLDivElement>, technicianId: number): void {
    event.preventDefault();

    const orderDropData: iOrderDropData = OrderDropData(event);
    if (!orderDropData.dataIsValid) {
      return;
    }

    const isOrderHaveTargetTech: boolean = orderListContext.doOrderHaveThatTech(orderDropData.orderId, technicianId);
    orderListContext.updateOrder(
      orderDropData.orderId,
      isOrderHaveTargetTech ? orderListContext.getMainTechId(orderDropData.orderId) : technicianId,
      isOrderHaveTargetTech ? orderListContext.getSecondTechId(orderDropData.orderId) : null,
      orderDropData.timeBegin,
      orderDropData.timeEnd
    );
  }

  function setAttr2DragTech(event: React.DragEvent<HTMLDivElement>, techId: number | null): void {
    if (!techId) {
      return;
    }
    const techBlock: HTMLDivElement | null =
      document.querySelector("div.item[data-tech-block-id='" + techId.toString() + "']");
    if (techBlock) {
      const deltaX: number = event.pageX - techBlock.getBoundingClientRect().x;
      const deltaY: number = event.pageY - techBlock.getBoundingClientRect().y;
      event.dataTransfer.setDragImage(techBlock, deltaX, deltaY);
      event.dataTransfer.setData("data-tech-id", techId.toString());
      localStorage.setItem("dragItemType", DragItemType.Tech);
    }
  }

  function techDragOver(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    if (localStorage.getItem("dragItemType") === DragItemType.Tech) {
      event.dataTransfer.dropEffect = "move";
    } else {
      event.dataTransfer.dropEffect = "none";
    }

    const techScrollContainer: HTMLElement | null = document.getElementById("tech-scrollbar");
    if (!techScrollContainer) {
      return;
    }
    const techSContainerRect: DOMRect = techScrollContainer.getBoundingClientRect();
    if (event.pageY >= techSContainerRect.y && event.pageY <= techSContainerRect.y + 20) {
      scrollbar.current.scrollToTop();
    }
    if (event.pageY <= techSContainerRect.y + techSContainerRect.height  &&
        event.pageY >= techSContainerRect.y + techSContainerRect.height - 20) {
      scrollbar.current.scrollToBottom();
    }
  }

  function techDropHandler(event: React.DragEvent<HTMLDivElement>, targetTechId: number): void {
    event.preventDefault();
    const dragTechId: number = Number(event.dataTransfer.getData("data-tech-id"));
    if (dragTechId !== targetTechId) {
      techListContext.changeTechSequence(dragTechId, targetTechId);
    }
  }

  useEffect((): void => {
    setIsShowWhiteLayer(whiteLayersContext.data.showTechWhite);
  }, [whiteLayersContext]);

  return (
    <section className="techlist-container">
      <div className={"white-side-block" + (isShowWhiteLayer ? " show" : "")}></div>
      <div className={"undispatched-bottom"}>
        <div className={"blur-item" + (isShowWhiteLayer ? " show" : "")}></div>
        <div className={"blur-item vertical-line" + (isShowWhiteLayer ? " show" : "")}></div>
        <div className={"content" + (isShowWhiteLayer ? " show-white" : "")}>
          <div className="main-container main-container-two">
            <div id={"tech-scrollbar"} className="scroll-cont scroll-cont-bottom">
              <div className="scroll-content-wrapper">
                <div className="content-two">
                  {!techList ? null :
                    (
                      techList.map((technician: iTechnician): JSX.Element => {
                        return (
                          <div className="item" key={technician.id} data-tech-block-id={technician.id}>
                            <div className="item-left"
                               onDragOver={(event: React.DragEvent<HTMLDivElement>): void => {techDragOver(event)}}
                               onDrop={(event: React.DragEvent<HTMLDivElement>): void => {techDropHandler(event, technician.id)}}
                            >
                              <div
                                className={"blur-item extra-width" +
                                  (isShowWhiteLayer && whiteLayersContext.data.techId !== technician.id ? " show" : "")
                                }
                              />
                              <div className="item-left-top">
                                <div
                                  className="dots"
                                  draggable={"true"}
                                  onDragStart={(event: React.DragEvent<HTMLDivElement>): void => {
                                    setAttr2DragTech(event, technician.id);
                                  }}
                                >
                                  <svg width="8" height="19" viewBox="0 0 8 19" fill="none">
                                    <use href="#points"/>
                                  </svg>
                                </div>
                                <div className="person">
                                  <img
                                    // src={technician.avatar ? technician.avatar : "https://i.ibb.co/C1ZFCsr/person-1.png"}
                                    src={"https://i.ibb.co/C1ZFCsr/person-1.png"}
                                    alt="#"
                                  />
                                </div>
                                <div className="names">
                                  <p className="title">
                                    Technicians
                                  </p>
                                  <p className="post-title">
                                    {technician.name}
                                  </p>
                                </div>
                                <div className="item-left-bottom">
                                  <svg width="35" height="35" viewBox="0 0 35 35" fill="none" onClick={(): void => {
                                    const orders: iOrder[] | null = orderListContext.getOrdersByTechId(technician.id);
                                    if (orders && orders.length > 0) {
                                      if (mapContext.getMapContextData().techId === technician.id) {
                                        mapContext.setTechId(null);
                                        mapHeightContext.decreaseMap();
                                        whiteLayersContext.hideAllWhite();
                                      } else {
                                        mapContext.setTechId(technician.id);
                                        mapHeightContext.increaseMap();
                                        whiteLayersContext.setWhite(
                                          true,
                                          true,
                                          true,
                                          false,
                                          undefined,
                                          technician.id
                                        )
                                      }
                                    }
                                  }}>
                                    <use href="#but"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div
                              className="item-right item-right-first"
                              onDragOver={(event: React.DragEvent<HTMLDivElement>): void => {diagramDragOver(event)}}
                              onDrop={(event: React.DragEvent<HTMLDivElement>): void => {orderDropHandler(event, technician.id)}}
                            >
                              <Diagram
                                orderListProp={orderListContext.getOrdersByTechId(technician.id)}
                                technicianId={technician.id}
                                isThisUnDisBlock={false}
                              />
                            </div>
                          </div>
                        )
                    }))
                  }
                </div>
              </div>
              <div className="scroll-vtrack scroll-track-technical">
                <div className="scroll-thumb"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={"white-side-block" + (isShowWhiteLayer ? " show" : "")}></div>
    </section>
  );
}
