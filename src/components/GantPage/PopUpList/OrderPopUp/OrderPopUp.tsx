import * as React from "react";
import "../../../../../source/img/svgIcons/close-icon.svg";
import "../../../../../source/img/svgIcons/point-dark.svg";
import "../../../../../source/img/svgIcons/three-points.svg";
import "../../../../../source/img/svgIcons/calendar-icon.svg";
import "../../../../../source/img/svgIcons/clock-icon.svg";

interface iProps {
  incomingData: iOrderPopUpInData | null
}

export enum OrderPopUpType {
  Small,
  Big
}

export interface iOrderPopUpInData {
  type: OrderPopUpType
}

export default function OrderPopUp({incomingData}: iProps): JSX.Element {
  return (
    <>
      {incomingData &&
        <div className={"popup" + (incomingData.type === OrderPopUpType.Big ? " big" : " small")}>
          <div className="close">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <use href="#close-icon"/>
            </svg>
          </div>
          <div className="status">
            <div className="number">
              № 1765798
            </div>
            <div className="btn-recall">
              Recall
            </div>
          </div>
          <div className="info">
            <div className="address">
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                <use href="#point-dark"/>
              </svg>
              <p className="txt">2429 E Clay Ave, Fresno, CA 93701</p>
            </div>
            <div className="contacts">
              <div className="top">
                <div className="name">
                  Jonh Smith
                </div>
                <div className="description">
                  Service#3 (Toshiba)
                </div>
              </div>
              <div className="bottom">
                <div className="phone">
                  +123 234 345 67 89
                </div>
                <div className="mail">
                  mail@mail.com
                </div>
              </div>
            </div>
          </div>
          {incomingData.type === OrderPopUpType.Big ?
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
              <div className="btn-save">
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
