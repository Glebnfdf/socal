import * as React from 'react';
import {createRoot} from 'react-dom/client';
import "../source/scss/style.scss";

export default function App(): JSX.Element {
  return (
    <>Hello world!</>
  );
}

const appContainer: HTMLElement | null = document.getElementById("react-app-cont");
if (appContainer) {
  createRoot(appContainer).render(<App />);
}
