import * as React from "react";
import { iPrldOnPageContext, PrldOnPageContext } from "../PrldOnPageContext/PrldOnPageContext";
import { useContext, useEffect, useState } from "react";
import Preloader from "../Preloader";

export default function PreloaderOnPage(): JSX.Element {
  const prldOnPageContext: iPrldOnPageContext = useContext<iPrldOnPageContext>(PrldOnPageContext);
  const [showPreloader, setShowPreloader]: [st: boolean, set: (st: boolean) => void] = useState(false);

  useEffect((): void => {
    setShowPreloader(prldOnPageContext.enablePreloader);
  }, [prldOnPageContext]);

  return (
    <>
      {showPreloader &&
        <div className={"blur-main-show"}>
          <Preloader/>
        </div>
      }
    </>
  );
}
