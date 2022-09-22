const { app, BrowserWindow } = require('electron');
const remoteMain = require('@electron/remote/main');
const path = require('path');
const fs = require('fs');

const MIN_WIDTH = 800;
const MIN_HEIGHT = 600;

(async () => {
  try {
    await app.whenReady();

    const createWindow = () => {
      const mainWindow = new BrowserWindow({
        width: MIN_WIDTH,
        height: MIN_HEIGHT,
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        show: false,
        webPreferences: {
          contextIsolation: false,
          nodeIntegration: true,
        },
      });

      mainWindow.autoHideMenuBar =  true;
      mainWindow.menuBarVisible = false;
      process.argv[2] === 'DEV' && mainWindow.webContents.openDevTools();

      remoteMain.initialize();
      remoteMain.enable(mainWindow.webContents);

      mainWindow.loadFile('index.html');
    };

    createWindow();

    app.on('activate', () => {
      BrowserWindow.getAllWindows().length === 0 && createWindow();
    });

    app.on('window-all-closed', () => {
      process.platform !== 'darwin' && app.quit();
    });
  } catch (error) {
    console.error(error);
  }
})();
