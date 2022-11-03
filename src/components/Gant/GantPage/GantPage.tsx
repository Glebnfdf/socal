import * as React from "react";
import Header from "../Header/Header";
import UnDispatched from "../UnDispatched/UnDispatched";
import PopUpList from "../PopUp/PopUpList/PopUpList";
import TechnicianList from "../TechnicianList/TechnicianList";
import GantDataLoader from "../GantDataLoader/GantDataLoader";
import OrderListModel from "../OrderListModel/OrderListModel";
import TechnicianListModel from "../TechnicianListModel/TechnicianListModel";
import PopUpContextProvider from "../PopUp/PopUpContext/PopUpContext";
import GMap from "../GMap/GMap";
import OrderPopUpProvider from "../PopUp/OrderPopUpProvider/OrderPopUpContext";
import MapProvider from "../GMap/MapProvider/MapProvider";
import MapHeightProvider from "../GMap/MapHeightProvider/MapHeightProvider";
import WhiteLayersProvider from "../WhiteLayersProvider/WhiteLayersProvider";
import PrldOnPageProvider from "../../Preloader/PrldOnPageContext/PrldOnPageContext";
import PreloaderOnPage from "../../Preloader/PreloaderOnPage/PreloaderOnPage";

export default function GantPage(): JSX.Element {
  return (
    <PrldOnPageProvider>
      <GantDataLoader>
        <OrderListModel>
          <TechnicianListModel>
            <PopUpContextProvider>
              <OrderPopUpProvider>
                <MapProvider>
                  <MapHeightProvider>
                    <WhiteLayersProvider>
                        <Header/>
                        <main className="main">
                          <PreloaderOnPage/>
                          <div className="blur-main"/>
                          <UnDispatched/>
                          <TechnicianList />
                          <GMap/>
                        </main>
                        <footer className="container" />
                        <PopUpList/>
                      </WhiteLayersProvider>
                  </MapHeightProvider>
                </MapProvider>
              </OrderPopUpProvider>
            </PopUpContextProvider>
          </TechnicianListModel>
        </OrderListModel>
      </GantDataLoader>
    </PrldOnPageProvider>
  );
}
