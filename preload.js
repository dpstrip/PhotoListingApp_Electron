const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    getImages: (directoryPath) => ipcRenderer.invoke('get-images', directoryPath),
    readHelpText: () => ipcRenderer.invoke('read-help-text')
});
