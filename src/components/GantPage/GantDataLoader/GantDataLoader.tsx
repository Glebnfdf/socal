import * as React from "react";
import { useFetch } from "../../../hooks/useFetch";
import { useEffect, useRef } from "react";

interface iProps {
  children: React.ReactNode
}

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

  useEffect((): void => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async (): Promise<void> => {
      await updateData();
    })();
  }, []);

  useEffect((): void => {
    if (!isLoading) {
      if (response && response.status === 200 && data && loadingStage.current !== null) {
        loadingStage.current++;
        const isAllDataLoaded: boolean = loadingStage.current === urlList.length;
        if (isAllDataLoaded) {
          //  посылаем сигнал всем остальным
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

  return (
    <>{children}</>
  );
}
