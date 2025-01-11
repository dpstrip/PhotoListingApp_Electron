const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
let mainWindow;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
    });
    mainWindow.loadFile('index.html');
});
ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
    });
    if (!result.canceled) {
        return result.filePaths[0];
    }
    return null;
});
ipcMain.handle('get-images', (event, directoryPath) => {
    const images = [];
    function traverseDirectory(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                traverseDirectory(fullPath);
            } else if (/\.(jpg|jpeg|png|gif|bmp)$/i.test(file)) {
                images.push(fullPath);
            }
        });
    }
    traverseDirectory(directoryPath);
    return images;
});
