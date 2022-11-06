import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import iOrderResponse, { iOrderResponseRaw } from "../../../APIInterfaces/iOrderResponse";
import iTechResponse, { iTechResponseRaw } from "../../../APIInterfaces/iTechResponse";
import { iOrder } from "../OrderListModel/OrderListModel";
import { iTechnician } from "../TechnicianListModel/TechnicianListModel";
import twoDigitOutput from "../../../utils/twoDigitsOutput";
import { iPrldOnPageContext, PrldOnPageContext } from "../../Preloader/PrldOnPageContext/PrldOnPageContext";
import DeepObjectEqual from "../../../utils/DeepObjectEqual";
import { iPopUpContext, PopUpContext } from "../PopUp/PopUpContext/PopUpContext";
import { PopUpName } from "../PopUp/PopUpList/PopUpListNames";
import TechBGCollection from "../../../utils/TechBGCollection";

interface iProps {
  children: React.ReactNode
}

interface iGrantLoaderContext {
  orderList: iOrder[],
  techList: iTechnician[],
  date: Date,
  changeDate: (newDate: Date) => void
  getSelectedDate: () => Date
}

export const GrantLoaderContext: React.Context<iGrantLoaderContext> = React.createContext<iGrantLoaderContext>({
  orderList: [],
  techList: [],
  date: new Date(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  changeDate: (newDate: Date) => {},
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getSelectedDate: () => {}
})

export default function GantDataLoader({children}: iProps): JSX.Element {
  const { data, isLoading, response, requestData }: {
    data?: unknown | undefined,
    isLoading: boolean,
    response?: Response | undefined,
    requestData: (url: string, request?: RequestInit, useRedirectFor401?: boolean) => Promise<void>
  } = useFetch();
  const urlList = ["/api/schedule/tasks", "/api/schedule/technics", "/api/technics"];
  const loadingStage: React.MutableRefObject<number> = useRef<number>(0);
  const gantDate: React.MutableRefObject<Date> = useRef<Date>(new Date());
  const orderList: React.MutableRefObject<iOrderResponse[] | null> = useRef<iOrderResponse[] | null>(null);
  const techList: React.MutableRefObject<iTechResponse[] | null> = useRef<iTechResponse[] | null>(null);
  const prevOrderListResp: React.MutableRefObject<iOrderResponse[] | null> = useRef<iOrderResponse[] | null>(null);
  const prevTechListResp: React.MutableRefObject<iTechResponse[] | null> = useRef<iTechResponse[] | null>(null);
  const prevData: React.MutableRefObject<Date> = useRef<Date>(gantDate.current);
  const prldOnPageContext: iPrldOnPageContext = useContext<iPrldOnPageContext>(PrldOnPageContext);
  const updateDataTimer: React.MutableRefObject<number> = useRef<number>(0);
  const needToUpdateData: React.MutableRefObject<boolean> = useRef<boolean>(false);
  const popUpContext: iPopUpContext = useContext(PopUpContext);
  const currentPopUp: React.MutableRefObject<PopUpName> = useRef<PopUpName>(PopUpName.none);
  const [grantLoaderState, setGrantLoaderState]: [st: iGrantLoaderContext, set: (st: iGrantLoaderContext) => void] =
    useState<iGrantLoaderContext>({
      orderList: [],
      techList: [],
      date: new Date(),
      changeDate: changeDateHandler,
      getSelectedDate: getSelectedDate
    });

  useEffect((): () => void => {
    loadData(true);
    return (): void => {
      clearTimeout(updateDataTimer.current);
    }
  }, []);

  useEffect((): void => {
    if (!isLoading) {
      if (response && response.status === 200 && data) {
        saveRespData(response.url, data);
        loadingStage.current++;
        const isAllDataLoaded: boolean = loadingStage.current === urlList.length;
        if (isAllDataLoaded) {
          prldOnPageContext.hidePreloader();
          if (orderList.current && techList.current && gantDate.current) {
            let isNewData: boolean = false;
            if (prevOrderListResp.current && prevTechListResp.current) {
              if (!DeepObjectEqual({...orderList.current}, {...prevOrderListResp.current})) {
                isNewData = true;
              }
              if (!DeepObjectEqual({...techList.current}, {...prevTechListResp.current})) {
                isNewData = true;
              }
              if (prevData.current.getTime() !== gantDate.current.getTime()) {
                isNewData = true;
              }
            } else {
              isNewData = true;
            }

            if (isNewData) {
              prevOrderListResp.current = [...orderList.current];
              prevTechListResp.current = [...techList.current];
              prevData.current = new Date(gantDate.current.getTime());
              popUpContext.setData(PopUpName.none, null);
              const newTechList: iTechnician[] = addOrderInTechList(addFakeTechData(techList.current));
              TechBGCollection.getInstance().addTechnicians(newTechList);
              setGrantLoaderState({
                ...grantLoaderState,
                orderList: addTechInOrder(addFakeOrderData(orderList.current), techList.current),
                techList: newTechList,
                date: gantDate.current
              });
            }
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          (async (): Promise<void> => {
            await updateData(true);
          })();
        }
      }
    }
  }, [isLoading]);

  async function updateData(showPreloader: boolean): Promise<void> {
    if (loadingStage.current === 0 && showPreloader) {
      prldOnPageContext.showPreloader();
    }
    const url = urlList[loadingStage.current] + "?" +
      getGetParams(urlList[loadingStage.current], gantDate.current).toString();
    await requestData(url);
  }

  function getGetParams(url: string, date: Date): URLSearchParams {
    // urlList[2] = /technics/all
    if (url === urlList[2]) {
      return new URLSearchParams({
        date: shortDateFormat(date)
      })
    } else {
      return new URLSearchParams({
        date_start: shortDateFormat(date),
        date_end: shortDateFormat(date)
      });
    }
  }

  function shortDateFormat(date: Date): string {
    return `${
      date.getFullYear()}-${
      twoDigitOutput(date.getMonth() + 1)}-${
      twoDigitOutput(date.getDate())}`
  }

  function saveRespData(url: string, data: unknown): void {
    // заявки без техников /schedule/task/all
    if (url.includes(urlList[0])) {
      orderList.current = (data as iOrderResponseRaw).data.items;
    }

    // заявки с техниками /schedule/technic/all
    if (url.includes(urlList[1]) && orderList.current) {
      orderList.current = [...orderList.current, ...((data as iOrderResponseRaw).data.items)];
    }

    // техники /technics/all
    if (url.includes(urlList[2])) {
      techList.current = (data as iTechResponseRaw).data.items;
    }
  }

  function addTechInOrder(orderList: iOrderResponse[], techList: iTechResponse[]): iOrder[] {
    const orderListWithTech: iOrder[] = [];
    orderList.forEach((order: iOrderResponse): void => {
      let mainTechId: number | null = null;
      let secondTechId: number | null = null;
      techList.forEach((technician: iTechResponse): void => {
        if (technician.main_queue) {
          technician.main_queue.forEach((orderFromTech: iOrderResponse): void => {
            if (orderFromTech.id === order.id) {
              mainTechId = technician.id;
            }
          });
        }
        if (technician.second_queue) {
          technician.second_queue.forEach((orderFromTech: iOrderResponse): void => {
            if (orderFromTech.id === order.id) {
              secondTechId = technician.id;
            }
          });
        }
      });
      orderListWithTech.push({...order, mainTechId: mainTechId, secondTechId: secondTechId})
    });
    return orderListWithTech;
  }

  function addOrderInTechList(techList: iTechResponse[]): iTechnician[] {
    const techListWithOrder: iTechnician[] = [];
    techList.forEach((technician: iTechResponse, index: number): void => {
      techListWithOrder.push({...technician, sequenceNumber: index});
    });
    return techListWithOrder;
  }

  function changeDateHandler(newDate: Date): void {
    gantDate.current = newDate;
    loadData(true);
  }

  function getSelectedDate(): Date {
    return gantDate.current;
  }

  function addTimer2UpdateData(): void {
    updateDataTimer.current = window.setTimeout((): void => {
      needToUpdateData.current = true;
      if (currentPopUp.current === PopUpName.none) {
        loadData(false);
      }
    }, 5 * 60 * 1000); // 5 мин
  }

  function loadData(showPreloader: boolean): void {
    loadingStage.current = 0;
    clearTimeout(updateDataTimer.current);
    needToUpdateData.current = false;
    addTimer2UpdateData();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async (): Promise<void> => {
      await updateData(showPreloader);
    })();
  }

  useEffect((): void => {
    currentPopUp.current = popUpContext.data.name;
    if (currentPopUp.current === PopUpName.none && needToUpdateData.current) {
      loadData(false);
    }
  }, [popUpContext]);

  function addFakeOrderData(orderList: iOrderResponse[]): iOrderResponse[] {
    orderList.forEach((order: iOrderResponse): void => {
      if (!Object.prototype.hasOwnProperty.call(order, "appliance")) {
        order.appliance = "Service#3 (Toshiba)";
      }
      if (!Object.prototype.hasOwnProperty.call(order, "main_contact_email")) {
        order.main_contact_email = "mail@mail.com";
      }
      if (!Object.prototype.hasOwnProperty.call(order, "description")) {
        order.description = "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque Corpti quos dolores et quas molestias excuri sint occaecati cupiditate non Provident, similique sunt in culpa quiofficia deserunt mollitia animi, id est Laborum et dolorum fuga. At vero eos et ccusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque Сorpti quos dolores et quas molestias excuri sint occaecati cupiditate non Provident, similique sunt in culpa qui officia deserunt mollitia animi, id est Laborum et dolorum fuga.";
      }
    });
    return orderList;
  }

  function addFakeTechData(techList: iTechResponse[]): iTechResponse[] {
    techList.forEach((technician: iTechResponse): void => {
      if (!Object.prototype.hasOwnProperty.call(technician, "avatar")) {
        technician.avatar = "https://i.ibb.co/C1ZFCsr/person-1.png";
      }
      if (!Object.prototype.hasOwnProperty.call(technician, "non_working_times")) {
        technician.non_working_times = null;
      }
    });
    return techList;
  }

  return (
    <GrantLoaderContext.Provider value={grantLoaderState}>
      {children}
    </GrantLoaderContext.Provider>
  );
}
