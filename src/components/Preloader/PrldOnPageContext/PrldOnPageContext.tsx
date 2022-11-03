import * as React from "react";
import { useState } from "react";

interface iProps {
  children: React.ReactNode;
}

export interface iPrldOnPageContext {
  enablePreloader: boolean,
  showPreloader: () => void
  hidePreloader: () => void
}

export const PrldOnPageContext: React.Context<iPrldOnPageContext> = React.createContext<iPrldOnPageContext>({
  enablePreloader: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showPreloader: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  hidePreloader: () => {}
});

export default function PrldOnPageProvider({ children }: iProps): JSX.Element {
  const [contextState, setContextState]: [st: iPrldOnPageContext, set: (st: iPrldOnPageContext) => void] =
    useState<iPrldOnPageContext>({
      enablePreloader: false,
      showPreloader: showPreloader,
      hidePreloader: hidePreloader
    });

  function showPreloader(): void {
    setContextState({ ...contextState, enablePreloader: true });
  }

  function hidePreloader(): void {
    setContextState({ ...contextState, enablePreloader: false });
  }

  return (
    <PrldOnPageContext.Provider value={contextState}>
      {children}
    </PrldOnPageContext.Provider>
  );
}
