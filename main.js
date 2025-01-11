const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;

function createWindow() {
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
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
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

ipcMain.handle('get-images', async (event, directoryPath) => {
    const images = [];
    async function traverseDirectory(dir) {
        const files = await fs.readdir(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = await fs.stat(fullPath);
            if (stat.isDirectory()) {
                await traverseDirectory(fullPath);
            } else if (/\.(jpg|jpeg|png|gif|bmp)$/i.test(file)) {
                images.push(fullPath);
            }
        }
    }
    await traverseDirectory(directoryPath);
    return images;
});

ipcMain.handle('read-help-text', async () => {
    const helpTextPath = path.join(__dirname, 'helpText.txt');
    console.log(helpTextPath);
    const helpText = await fs.readFile(helpTextPath, 'utf-8');
    return helpText;
});

app.on('ready', () => {
    console.log('App is ready');
});
