import * as React from "react";
import Header from "./Header/Header";
import UnDispatched from "./UnDispatched/UnDispatched";
import PopUpList from "./PopUpList/PopUpList";
import TechnicianList from "./TechnicianList/TechnicianList";
import GantDataLoader from "./GantDataLoader/GantDataLoader";
import OrderListModel from "./OrderListModel/OrderListModel";
import TechnicianListModel from "./TechnicianListModel/TechnicianListModel";
import PopUpContextProvider from "../PopUpContext/PopUpContext";
import GMap from "./GMap/GMap";
import OrderPopUpProvider from "../PopUpContext/OrderPopUpProvider/OrderPopUpContext";
import MapProvider from "./MapProvider/MapProvider";
import MapHeightProvider from "./MapHeightProvider/MapHeightProvider";

export default function GantPage(): JSX.Element {
  return (
    <GantDataLoader>
      <OrderListModel>
        <TechnicianListModel>
          <PopUpContextProvider>
            <OrderPopUpProvider>
              <MapProvider>
                <MapHeightProvider>
                  <Header/>
                  <main className="main">
                    <div className="blur-main"/>
                    <UnDispatched/>
                    <TechnicianList />
                    <GMap/>
                  </main>
                  <footer className="container" />
                  <PopUpList/>
                </MapHeightProvider>
              </MapProvider>
            </OrderPopUpProvider>
          </PopUpContextProvider>
        </TechnicianListModel>
      </OrderListModel>
    </GantDataLoader>
  );
}
