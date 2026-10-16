
const { app, BrowserWindow } = require("electron");
const path = require("node:path");

function crearVentana() {
  const ventana = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "AsistePro",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  ventana.loadFile(path.join(__dirname, "../dist/index.html"));
}

app.whenReady().then(() => {
  crearVentana();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      crearVentana();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
