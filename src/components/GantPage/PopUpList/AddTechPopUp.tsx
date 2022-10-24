import * as React from "react";
import "../../../../source/img/svgIcons/close-icon.svg";
import "../../../../source/img/svgIcons/union.svg";
import Scrollbar from "../../../lib/scrollbar";
import { useEffect } from "react";

export default function AddTechPopUp(): JSX.Element {
  useEffect((): () => void => {
    let scrollbar: Scrollbar | null = null;
    const scrollCont: HTMLElement | null = document.getElementById("add-tech-scroll-cont");
    if (scrollCont) {
      scrollbar = new Scrollbar();
      scrollbar.init(scrollCont);
    }

    return (): void => {
      if (scrollbar) {
        scrollbar.destroy();
      }
    };
  }, []);

  return (
    <div className="popup-search">
      <div className="close">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <use href="#close-icon"/>
        </svg>
      </div>
      <div className="title">
        Add technicial
      </div>
      <div className="search-form">
        <i className="fa fa-address-book-o" aria-hidden="true" id="union">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <use href="#union"/>
          </svg>
        </i>
        <input className="search" placeholder="Search" id="search-input" type="text"/>
      </div>
      <main className="main-container">
        <div id={"add-tech-scroll-cont"} className="scroll-cont">
          <div className="scroll-content-wrapper scroll-content-wrapper-popup-add">
            <ul className="list">
              <li className="item">
                <div className="left">
                  <img className="person-img" src="https://i.ibb.co/C1ZFCsr/person-1.png" alt="#"/>
                    <div className="names">
                      <div className="title-technical">
                        Technician
                      </div>
                      <div className="name">
                        Matthew David McCon...
                      </div>
                    </div>
                </div>
                <div className="right">
                  <div className="add-btn">
                    Add
                  </div>
                </div>
              </li>
              <li className="item">
                <div className="left">
                  <img className="person-img" src="https://i.ibb.co/C1ZFCsr/person-1.png" alt="#"/>
                    <div className="names">
                      <div className="title-technical">
                        Technician
                      </div>
                      <div className="name">
                        Matthew David McCon...
                      </div>
                    </div>
                </div>
                <div className="right">
                  <div className="add-btn">
                    Add
                  </div>
                </div>
              </li>
              <li className="item">
                <div className="left">
                  <img className="person-img" src="https://i.ibb.co/C1ZFCsr/person-1.png" alt="#"/>
                    <div className="names">
                      <div className="title-technical">
                        Technician
                      </div>
                      <div className="name">
                        Matthew David McCon...
                      </div>
                    </div>
                </div>
                <div className="right">
                  <div className="add-btn">
                    Add
                  </div>
                </div>
              </li>
              <li className="item">
                <div className="left">
                  <img className="person-img" src="https://i.ibb.co/C1ZFCsr/person-1.png" alt="#"/>
                    <div className="names">
                      <div className="title-technical">
                        Technician
                      </div>
                      <div className="name">
                        Matthew David McCon...
                      </div>
                    </div>
                </div>
                <div className="right">
                  <div className="add-btn">
                    Add
                  </div>
                </div>
              </li>
              <li className="item">
                <div className="left">
                  <img className="person-img" src="https://i.ibb.co/C1ZFCsr/person-1.png" alt="#"/>
                    <div className="names">
                      <div className="title-technical">
                        Technician
                      </div>
                      <div className="name">
                        Matthew David McCon...
                      </div>
                    </div>
                </div>
                <div className="right">
                  <div className="add-btn">
                    Add
                  </div>
                </div>
              </li>
              <li className="item">
                <div className="left">
                  <img className="person-img" src="https://i.ibb.co/C1ZFCsr/person-1.png" alt="#"/>
                    <div className="names">
                      <div className="title-technical">
                        Technician
                      </div>
                      <div className="name">
                        Matthew David McCon...
                      </div>
                    </div>
                </div>
                <div className="right">
                  <div className="add-btn">
                    Add
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="scroll-vtrack">
            <div className="scroll-thumb"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
