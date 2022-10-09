import { useContext, useState } from "react";
import { AuthContext, iAuthContext } from "../components/Authorization/Authorization";

interface iUseFetchStates {
  data?: unknown,
  isLoading: boolean,
  httpCode?: number
}

export function useFetch(): {
  data?: unknown | undefined,
  isLoading: boolean,
  httpCode?: number | undefined,
  requestData: (url: string, request?: RequestInit) => Promise<void>
} {
  const authContext: iAuthContext = useContext(AuthContext);

  // три состояния объединены в одно, чтобы уменьшить количество рендеров
  const [states, setStates]: [st: iUseFetchStates, set: (st: iUseFetchStates) => void] = useState<iUseFetchStates>({
    isLoading: false
  });

  async function requestData(url: string, request?: RequestInit, useRedirectFor401: boolean = true): Promise<void> {
    try {
      setStates({isLoading: true});
      addToken2Headers(request);

      const response: Response = await fetch(url, request);
      const responseData: unknown = await response.json();

      if (useRedirectFor401 && response.status === 401) {
        authContext.setIsUserHaveAuth(false);
      } else {
        setStates({
          data: responseData,
          isLoading: false,
          httpCode: response.status
        })
      }
    } catch (error: unknown) {
      console.error("Во время запроса на", url, "произошла ошибка.", error);
      setStates({isLoading: false});
      return Promise.reject();
    }
  }

  function addToken2Headers(request: RequestInit | undefined): void {
    const token: string | null = localStorage.getItem("token");
    if (!token) {
      return;
    }
    if (!request) {
      request = {};
    }
    request.headers = {
      Authorization: `Bearer ${token}`
    }
  }

  return {...states, requestData};
}
