import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Extend Window interface
declare global {
  interface AppConfig {
    serverUrl: string;
    username: string;
    password: string;
    bucketName: string;
    scopeName: string;
  }

  interface Window {
    appConfig: AppConfig | null;
    query1Text: string;
    query2Text: string;
    query3Text: string;
    query1Result: unknown | null;
    query2Result: unknown | null;
    query3Result: unknown | null;
    systemMessage: string;
  }
}

window.query1Result = null;

window.ipcRenderer.on("query-1-result", (_event: unknown, message: unknown) => {
  window.query1Result = message;
  window.dispatchEvent(new CustomEvent("query-result-1-updated"));
});

window.ipcRenderer.on("query-2-result", (_event: unknown, message: unknown) => {
  window.query2Result = message;
  window.dispatchEvent(new CustomEvent("query-result-2-updated"));
});

window.ipcRenderer.on("query-3-result", (_event: unknown, message: unknown) => {
  window.query3Result = message;
  window.dispatchEvent(new CustomEvent("query-result-3-updated"));
});

window.ipcRenderer.on("system-message", (_event: unknown, message: unknown) => {
  window.systemMessage = message as string;
  window.dispatchEvent(new CustomEvent("system-message-updated"));
});

window.ipcRenderer.on("app-config", (_event: unknown, config: unknown) => {
  window.appConfig = config as AppConfig;
  window.dispatchEvent(new CustomEvent("app-config-updated"));
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
