import * as React from 'react';
import {createRoot} from 'react-dom/client';
import "../source/scss/style.scss";
import Authorization from "./components/Authorization/Authorization";
import "./app.scss";

export default function App(): JSX.Element {
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
