import * as React from "react";
import Diagram from "../Diagram/Diagram";
import { iOrderListContext, OrderListContext } from "../OrderListModel/OrderListModel";
import { useContext, useEffect, useState } from "react";
import Scrollbar from "../../../lib/scrollbar";

export default function UnDispatched(): JSX.Element {
  const orderListContext: iOrderListContext = useContext(OrderListContext);
  const [orderListHaveOrder, setOrderListHaveOrder]: [st: boolean, set: (st: boolean) => void] = useState(false);

  useEffect((): () => void => {
    let scrollbar: Scrollbar | null = null;
    const undisScrollContainer: HTMLElement | null = document.getElementById("undis-scrollbar");
    if (undisScrollContainer) {
      scrollbar = new Scrollbar();
      scrollbar.init(undisScrollContainer);
    }

    return (): void => {
      if (scrollbar) {
        scrollbar.destroy();
      }
    };
  }, []);

  useEffect((): void => {
    if (orderListContext.orderLst && orderListContext.orderLst.length> 0) {
      setOrderListHaveOrder(true);
    }
  }, [orderListContext.orderLst]);

  return (
    <section className="container undispatched">
      {/*<div className="undispatched-blur"></div>*/}
      {/* Левая часть блока с легендой диаграммы */}
      <div className="left">
        <div className="top">
          <p className="title">
            Undispatched
          </p>
          <p className="post-title">
            applications
          </p>
        </div>
        <div className="bottom">
          <ul className="list">
            <li className="item">
              <div className="square-red"></div>
              <p className="txt">Recall</p>
            </li>
            <li className="item">
              <div className="square-orange"></div>
              <p className="txt">Repair</p>
            </li>
            <li className="item">
              <div className="square-violet"></div>
              <p className="txt">Estimation</p>
            </li>
          </ul>
        </div>
      </div>
      {/* Разлиновка */}
      <div className="right">
        <div className="ganta">
          <div className="top">
            <div className="col-hour">
              <p className="hour first-hour">
                7 am
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour">
                8 am
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour">
                9 am
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour">
                10 am
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour">
                11 am
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour">
                12 am
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour">
                1 pm
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour">
                2 pm
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour">
                3 pm
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour">
                4 pm
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour">
                5 pm
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour">
                6 pm
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour">
                7 pm
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour">
                8 pm
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
            <div className="col-hour">
              <p className="hour last-hour">
                9 pm
              </p>
              <ul className="list">
                <li className="item">
                  00
                </li>
                <li className="item">
                  15
                </li>
                <li className="item">
                  30
                </li>
                <li className="item">
                  45
                </li>
              </ul>
            </div>
          </div>
          {/* Заявки */}
          <div className="bottom">
            <div className="main-container">
              <div id={"undis-scrollbar"} className="scroll-cont scroll-cont-undispatche">
                <div className="scroll-content-wrapper">
                  <div className="content undis-content-padding">
                    {orderListHaveOrder &&
                      <Diagram orderListProp={orderListContext.getOrdersByTechId(null)} technicianId={null} />
                    }
                  </div>
                </div>
                <div className="scroll-vtrack">
                  <div className="scroll-thumb"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
