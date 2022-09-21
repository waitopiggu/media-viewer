const { app, BrowserWindow } = require('electron');
const remoteMain = require('@electron/remote/main');
const path = require('path');
const fs = require('fs');

const minWidth = 800;
const minHeight = 600;

(async () => {
  try {
    await app.whenReady();

    let width = minWidth;
    let height = minHeight;

    const initPath = path.join(app.getPath('userData'), 'init.json');

    if (fs.existsSync(initPath)) {
      const data = JSON.parse(fs.readFileSync(initPath, 'utf8'));
      width = data.width;
      height = data.height;
    }

    const createWindow = () => {
      const mainWindow = new BrowserWindow({
        width, height,
        minWidth, minHeight,
        webPreferences: {
          contextIsolation: false,
          nodeIntegration: true,
        },
      });

      mainWindow.on('close', () => {
        const data = mainWindow.getBounds();
        fs.writeFileSync(initPath, JSON.stringify(data));
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
