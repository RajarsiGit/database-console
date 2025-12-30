const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getServers: () => ipcRenderer.invoke('get-servers'),
  getDatabases: (serverId) => ipcRenderer.invoke('get-databases', serverId),
  executeQuery: (serverId, database, query) =>
    ipcRenderer.invoke('execute-query', { serverId, database, query }),
  testConnection: (serverId) => ipcRenderer.invoke('test-connection', serverId),
  // Credentials management
  checkCredentials: () => ipcRenderer.invoke('check-credentials'),
  saveCredentials: (credentials) => ipcRenderer.invoke('save-credentials', credentials),
  clearCredentials: () => ipcRenderer.invoke('clear-credentials'),
});
