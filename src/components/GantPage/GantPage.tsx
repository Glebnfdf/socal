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

export default function GantPage(): JSX.Element {
  return (
    <GantDataLoader>
      <OrderListModel>
        <TechnicianListModel>
          <PopUpContextProvider>
            <Header/>
            <main className="main">
              <div className="blur-main blur-main-show"/>
              <UnDispatched/>
              <TechnicianList />
              <GMap/>
            </main>
            <footer className="container" />
            <PopUpList/>
          </PopUpContextProvider>
        </TechnicianListModel>
      </OrderListModel>
    </GantDataLoader>
  );
}
