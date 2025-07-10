import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { CouchbaseConnector } from "./services/CouchbaseConnector.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.webContents.on("did-finish-load", () => {
    console.log("Window loaded, sending message...");
    // Add a small delay to ensure renderer is ready
    setTimeout(() => {
      win?.webContents.send("system-message", "Check the connection before executing queries.");
    }, 1000);
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

// Handle connect-to-couchbase message from renderer
ipcMain.on("connect-to-couchbase", async (event, formData) => {
  console.log("Received connect-to-couchbase request from renderer:", event);
  console.log("Form data:", formData);

  process.env["SERVER_URL"] = formData.serverUrl;
  process.env["USERNAME"] = formData.username;
  process.env["PASSWORD"] = formData.password;
  process.env["BUCKET_NAME"] = formData.bucketName;
  process.env["SCOPE_NAME"] = formData.scopeName;

  const data = await CouchbaseConnector.getInstance();

  // @ts-expect-error temporary
  win?.webContents.send("main-process-message", data.results);
});
