import * as React from "react";
import { useFetch } from "../../../hooks/useFetch";
import { useEffect, useRef, useState } from "react";
import iOrderResponse from "../../../APIInterfaces/iOrderResponse";
import iTechResponse from "../../../APIInterfaces/iTechResponse";
import { iOrder } from "../OrderListModel/OrderListModel";
import { iTechnician } from "../TechnicianListModel/TechnicianListModel";

interface iProps {
  children: React.ReactNode
}

interface iGrantLoaderContext {
  orderList: iOrder[],
  techList: iTechnician[],
  date: Date,
  changeDate: (newDate: Date) => void
}

export const GrantLoaderContext: React.Context<iGrantLoaderContext> = React.createContext<iGrantLoaderContext>({
  orderList: [],
  techList: [],
  date: new Date(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  changeDate: (newDate: Date) => {}
})

export default function GantDataLoader({children}: iProps): JSX.Element {
  const { data, isLoading, response, requestData }: {
    data?: unknown | undefined,
    isLoading: boolean,
    response?: Response | undefined,
    requestData: (url: string, request?: RequestInit, useRedirectFor401?: boolean) => Promise<void>
  } = useFetch();
  const urlList = ["/schedule/task/all", "/schedule/technic/all", "/technics/all"];
  const loadingStage: React.MutableRefObject<number> = useRef<number>(0);
  const date: React.MutableRefObject<Date> = useRef<Date>(new Date());
  const orderList: React.MutableRefObject<iOrderResponse[] | null> = useRef<iOrderResponse[] | null>(null);
  const techList: React.MutableRefObject<iTechResponse[] | null> = useRef<iTechResponse[] | null>(null);
  const [grantLoaderState, setGrantLoaderState]: [st: iGrantLoaderContext, set: (st: iGrantLoaderContext) => void] =
    useState<iGrantLoaderContext>({
      orderList: [],
      techList: [],
      date: new Date(),
      changeDate: changeDateHandler
    });

  useEffect((): void => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async (): Promise<void> => {
      await updateData();
    })();
  }, []);

  useEffect((): void => {
    if (!isLoading) {
      if (response && response.status === 200 && data && loadingStage.current !== null) {
        saveRespData(response.url, data);
        loadingStage.current++;
        const isAllDataLoaded: boolean = loadingStage.current === urlList.length;
        if (isAllDataLoaded) {
          if (orderList.current && techList.current && date.current) {
            setGrantLoaderState({
              ...grantLoaderState,
              orderList: addTechInOrder(orderList.current, techList.current),
              techList: addOrderInTechList(techList.current),
              date: date.current
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
    if (loadingStage.current !== null && date.current) {
      const url = urlList[loadingStage.current] + "?" + new URLSearchParams({
        date: date.current.toJSON()
      }).toString();
      await requestData(url);
    }
  }

  function saveRespData(url: string, data: unknown): void {
    // заявки без техников /schedule/task/all
    if (url.includes(urlList[0])) {
      orderList.current = data as iOrderResponse[];
    }

    // заявки с техниками /schedule/technic/all
    if (url.includes(urlList[1]) && orderList.current) {
      orderList.current = [...orderList.current, ...(data as iOrderResponse[])];
    }

    // техники /technics/all
    if (url.includes(urlList[2])) {
      techList.current = data as iTechResponse[];
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
    date.current = newDate;
    loadingStage.current = 0;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async (): Promise<void> => {
      await updateData();
    })();
  }

  return (
    <GrantLoaderContext.Provider value={grantLoaderState}>
      {children}
    </GrantLoaderContext.Provider>
  );
}
