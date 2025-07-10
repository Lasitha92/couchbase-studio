import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Extend Window interface
declare global {
  interface Window {
    systemMessage: string;
    query1Result: unknown | null;
  }
}

window.query1Result = "Your response will be displayed here";

window.ipcRenderer.on(
  "query-result-1",
  (_event: unknown, message: unknown) => {
    window.query1Result = message;
    window.dispatchEvent(new CustomEvent("query-result-1-updated"));
  }
);

window.ipcRenderer.on(
  "system-message",
  (_event: unknown, message: unknown) => {
    window.systemMessage = message as string;
    window.dispatchEvent(new CustomEvent("system-message-updated"));
  }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
