import * as React from "react";
import OrderListModel from "./OrderListModel/OrderListModel";
import Header from "./Header/Header";
import UnDispatched from "./UnDispatched/UnDispatched";
import PopUpList from "./PopUpList/PopUpList";

export default function GantPage(): JSX.Element {
  return (
    <OrderListModel>
      <Header/>
      <UnDispatched/>
      <PopUpList/>
    </OrderListModel>
  );
}
