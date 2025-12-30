const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const Store = require("electron-store");
const { getServers, getDatabases, setCredentials } = require("./database/connection");
const { executeQuery } = require("./database/query-executor");

const store = new Store();
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "../assets/database.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle("get-servers", async () => {
  try {
    return { success: true, data: getServers() };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("get-databases", async (event, serverId) => {
  try {
    const databases = await getDatabases(serverId);
    return { success: true, data: databases };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle(
  "execute-query",
  async (event, { serverId, database, query }) => {
    try {
      const result = await executeQuery(serverId, database, query);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
);

ipcMain.handle("test-connection", async (event, serverId) => {
  try {
    await getDatabases(serverId);
    return { success: true, message: "Connection successful" };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Credentials Management IPC Handlers
ipcMain.handle("check-credentials", async () => {
  try {
    const credentials = store.get("serverCredentials");
    if (credentials && credentials.servers && credentials.servers.length > 0) {
      setCredentials(credentials);
      return {
        success: true,
        hasCredentials: true,
        serverCount: credentials.servers.length,
      };
    }
    return { success: true, hasCredentials: false, serverCount: 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("save-credentials", async (event, credentials) => {
  try {
    store.set("serverCredentials", credentials);
    setCredentials(credentials);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("clear-credentials", async () => {
  try {
    store.delete("serverCredentials");
    setCredentials(null);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
