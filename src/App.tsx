import * as React from 'react';
import {createRoot} from 'react-dom/client';
import "../source/scss/style.scss";
import Authorization from "./components/Authorization/Authorization";
import "./app.scss";

function App(): JSX.Element {
  hideBeforeAppPreloader();

  function hideBeforeAppPreloader(): void {
    const preloader: HTMLElement | null = document.getElementById("before-app-preloader");
    if (preloader) {
      preloader.style.display = "none";
    }
  }

  return (
    <Authorization>
      Hello world!
    </Authorization>
  );
}

const appContainer: HTMLElement | null = document.getElementById("react-app-cont");
if (appContainer) {
  createRoot(appContainer).render(<App />);
}
