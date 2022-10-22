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
            <UnDispatched/>
            <TechnicianList />
            <GMap/>
            <PopUpList/>
          </PopUpContextProvider>
        </TechnicianListModel>
      </OrderListModel>
    </GantDataLoader>
  );
}
