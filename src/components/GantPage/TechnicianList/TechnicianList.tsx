import * as React from "react";
import "../../../../source/img/svgIcons/points.svg";
import "../../../../source/img/svgIcons/but.svg";
import { useContext, useEffect, useState } from "react";
import { iTechListContext, iTechnician, TechListContext } from "../TechnicianListModel/TechnicianListModel";

export default function TechnicianList(): JSX.Element {
  const techListContext: iTechListContext = useContext(TechListContext);
  const [techList, setTechList]: [st: iTechnician[] | null, set: (st: iTechnician[] | null) => void] =
    useState<iTechnician[] | null>(null);

  useEffect((): void => {
    setTechList([...techListContext.techList])
  }, [techListContext.techList]);

  return (
    <section className="undispatched-bottom container">
      <div className="content">
        {!techList ? null :
          (
            techList.map((technician: iTechnician): JSX.Element => {
              return (
                <div className="item" key={technician.id}>
                  <div className="item-left">
                    <div className="item-left-top">
                      <div className="dots">
                        <svg width="8" height="19" viewBox="0 0 8 19" fill="none">
                          <use href="#points"/>
                        </svg>
                      </div>
                      <div className="person">
                        <img
                          src={technician.avatar ? technician.avatar : "https://i.ibb.co/C1ZFCsr/person-1.png"}
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
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
                          <use href="#but"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="item-right">
                    <li className="item">
                      <p className="number">
                        № 1765798
                      </p>
                      <p className="txt">
                        2429 E Clay Ave, Fresno, CA 93701
                      </p>
                    </li>
                  </div>
                </div>
              )
          }))
        }
      </div>
    </section>
  );
}
