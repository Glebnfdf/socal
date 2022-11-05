import * as React from 'react';
import {createRoot} from 'react-dom/client';
import "../source/vendors/normalize-css/normalize.min.css";
import "../source/scss/style.scss";
import "./app.scss";
import Authorization from "./components/Authorization/Authorization";
import GantPage from "./components/Gant/GantPage/GantPage";
import "../source/img/favicon/favicon-16x16.png";
import "../source/img/favicon/favicon-32x32.png";
import "../source/img/favicon/favicon-96x96.png";
import "../source/img/favicon/favicon.ico";

function App(): JSX.Element {
  hideBeforeAppPreloader();

  function hideBeforeAppPreloader(): void {
    const preloader: HTMLElement | null = document.getElementById("before-app-preloader");
    if (preloader) {
      preloader.style.display = "none";
    }
  }

  return (
    <div className="overflow">
      <Authorization>
        <GantPage/>
      </Authorization>
    </div>
  );
}

const appContainer: HTMLElement | null = document.getElementById("react-app-cont");
if (appContainer) {
  createRoot(appContainer).render(<App />);
}
