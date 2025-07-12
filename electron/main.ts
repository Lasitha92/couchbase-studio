import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { CouchbaseConnector } from "./services/CouchbaseConnector.js";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

const customMenu = [
  {
    label: "File",
    submenu: [
      {
        label: "Exit",
        click: () => {
          app.quit();
        },
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "About",
        click: () => {
          const aboutWindow = new BrowserWindow({
            width: 400,
            height: 320,
            resizable: false,
            minimizable: false,
            maximizable: false,
            autoHideMenuBar: true,
            parent: win || undefined,
            modal: true,
            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false,
            },
          });

          aboutWindow.loadURL(`data:text/html,
             <html>
               <head><title>About Couchbase Studio</title></head>
               <body style="font-family: Arial, sans-serif; padding: 20px;">
                 <h2>Couchbase Studio</h2>
                 <p>Version: 1.0.0</p>
                 <p>A simple desktop application for querying Couchbase databases.</p>
                 <hr style="margin: 20px 0;">
                 <p><strong>Developer:</strong> Lasitha Bandara</p>
                 <p><strong>Contact:</strong> <a href="mailto:lybandara@gmail.com">lybandara@gmail.com</a></p>
               </body>
             </html>
           `);
        },
      },
    ],
  },
];

function createWindow() {
  win = new BrowserWindow({
    title: "Couchbase Studio",
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  const menu = Menu.buildFromTemplate(customMenu);
  Menu.setApplicationMenu(menu);

  win.webContents.on("did-finish-load", () => {
    console.log("Window loaded, sending message...");
    // Add a small delay to ensure renderer is ready
    setTimeout(() => {
      win?.webContents.send(
        "system-message",
        "Connect the database before executing queries."
      );
      // Read configs.json and send configs to renderer
      try {
        const userConfigPath = path.join(
          app.getPath("documents"),
          "CouchbaseStudio",
          "configs.json"
        );
        const configRaw = fs.readFileSync(userConfigPath, "utf-8");
        const config = JSON.parse(configRaw);
        win?.webContents.send("app-config", config);
      } catch (err) {
        console.error("Failed to read configs.json:", err);
        win?.webContents.send(
          "system-message",
          "Failed to load configuration file."
        );
      }
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

ipcMain.on("connect-to-couchbase", async (_event, formData) => {
  process.env["SERVER_URL"] = formData.serverUrl;
  process.env["USERNAME"] = formData.username;
  process.env["PASSWORD"] = formData.password;
  process.env["BUCKET_NAME"] = formData.bucketName;
  process.env["SCOPE_NAME"] = formData.scopeName;

  win?.webContents.send(
    "system-message",
    "Checking the connection please wait..."
  );

  try {
    const collections = await CouchbaseConnector.isConnectionValid();

    if (collections) {
      win?.webContents.send("system-message", "Connection successful!");
      win?.webContents.send("collections-available", collections);
    } else {
      win?.webContents.send("system-message", "Connection failed!");
    }
  } catch (error) {
    console.error("Connection error:", error);
    win?.webContents.send("system-message", "Connection failed!");
  }
});

ipcMain.on("query-1-execute", async (_event, query) => {
  win?.webContents.send("system-message", "Executing Query 1...");

  try {
    const result = await CouchbaseConnector.executeQuery(query);
    win?.webContents.send("query-1-result", result);
    win?.webContents.send("system-message", "Query 1 executed successfully.");
  } catch (error) {
    // @ts-expect-error error may not have a message property
    win?.webContents.send("system-message", `Error: ${error.message}`);
    console.error("Error executing query 1:", error);
  }
});

ipcMain.on("query-2-execute", async (_event, query) => {
  win?.webContents.send("system-message", "Executing Query 2...");

  try {
    const result = await CouchbaseConnector.executeQuery(query);
    win?.webContents.send("query-2-result", result);
    win?.webContents.send("system-message", "Query 2 executed successfully.");
  } catch (error) {
    // @ts-expect-error error may not have a message property
    win?.webContents.send("system-message", `Error: ${error.message}`);
    console.error("Error executing query 2:", error);
  }
});

ipcMain.on("query-3-execute", async (_event, query) => {
  win?.webContents.send("system-message", "Executing Query 3...");

  try {
    const result = await CouchbaseConnector.executeQuery(query);
    win?.webContents.send("query-3-result", result);
    win?.webContents.send("system-message", "Query 3 executed successfully.");
  } catch (error) {
    // @ts-expect-error error may not have a message property
    win?.webContents.send("system-message", `Error: ${error.message}`);
    console.error("Error executing query 3:", error);
  }
});

ipcMain.on("document-1-execute", async (_event, inputs) => {
  win?.webContents.send("system-message", "Executing query...");

  try {
    const query = `SELECT META() as meta, * FROM \`${inputs.collection}\` data LIMIT 5`;
    const result = await CouchbaseConnector.executeQuery(query) as {meta: unknown, data: unknown}[];

    const formattedData = result.map((d) => { return {
      meta: d.meta,
      data: d.data
    }})

    win?.webContents.send("document-1-result", formattedData);
    win?.webContents.send(
      "system-message",
      "Document1 query executed successfully."
    );
  } catch (error) {
    // @ts-expect-error error may not have a message property
    win?.webContents.send("system-message", `Error: ${error.message}`);
    console.error("Error executing document query:", error);
  }
});
