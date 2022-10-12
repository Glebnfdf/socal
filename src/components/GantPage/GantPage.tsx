import * as React from "react";
import OrderListModel from "./OrderListModel/OrderListModel";
import Header from "./Header/Header";
import UnDispatched from "./UnDispatched/UnDispatched";
import PopUpList from "./PopUpList/PopUpList";
import TechnicianList from "./TechnicianList/TechnicianList";

export default function GantPage(): JSX.Element {
  return (
    <OrderListModel>
      <Header/>
      <UnDispatched/>
      <TechnicianList />
      <PopUpList/>
    </OrderListModel>
  );
}
