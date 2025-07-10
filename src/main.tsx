import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Extend Window interface
declare global {
  interface Window {
    query1Result: unknown | null;
  }
}

window.query1Result = "Your response will be displayed here";

window.ipcRenderer.on(
  "main-process-message",
  (_event: unknown, message: unknown) => {
    console.log("Received message from main process:", message);
    window.query1Result = message as string;
    window.dispatchEvent(new CustomEvent("main-process-message-updated"));
  }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
