import * as React from "react";
import { useFetch } from "../../../hooks/useFetch";
import { useContext, useEffect, useRef, useState } from "react";
import iOrderResponse, { iOrderResponseRaw } from "../../../APIInterfaces/iOrderResponse";
import iTechResponse, { iTechResponseRaw } from "../../../APIInterfaces/iTechResponse";
import { iOrder } from "../OrderListModel/OrderListModel";
import { iTechnician } from "../TechnicianListModel/TechnicianListModel";
import twoDigitOutput from "../../../utils/twoDigitsOutput";
import { iPrldOnPageContext, PrldOnPageContext } from "../../Preloader/PrldOnPageContext/PrldOnPageContext";

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
  const prldOnPageContext: iPrldOnPageContext = useContext<iPrldOnPageContext>(PrldOnPageContext);
  const [grantLoaderState, setGrantLoaderState]: [st: iGrantLoaderContext, set: (st: iGrantLoaderContext) => void] =
    useState<iGrantLoaderContext>({
      orderList: [],
      techList: [],
      date: new Date(),
      changeDate: changeDateHandler,
      getSelectedDate: getSelectedDate
    });

  useEffect((): void => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async (): Promise<void> => {
      await updateData();
    })();
  }, []);

  useEffect((): void => {
    if (!isLoading) {
      if (response && response.status === 200 && data) {
        if (response.url.includes(urlList[2])) {
          prldOnPageContext.hidePreloader();
        }
        saveRespData(response.url, data);
        loadingStage.current++;
        const isAllDataLoaded: boolean = loadingStage.current === urlList.length;
        if (isAllDataLoaded) {
          if (orderList.current && techList.current && gantDate.current) {
            setGrantLoaderState({
              ...grantLoaderState,
              orderList: addTechInOrder(orderList.current, techList.current),
              techList: addOrderInTechList(techList.current),
              date: gantDate.current
            })
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          (async (): Promise<void> => {
            await updateData();
          })();
        }
      }
    }
  }, [isLoading]);

  async function updateData(): Promise<void> {
    if (loadingStage.current === 0) {
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
    loadingStage.current = 0;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async (): Promise<void> => {
      await updateData();
    })();
  }

  function getSelectedDate(): Date {
    return gantDate.current;
  }

  return (
    <GrantLoaderContext.Provider value={grantLoaderState}>
      {children}
    </GrantLoaderContext.Provider>
  );
}
