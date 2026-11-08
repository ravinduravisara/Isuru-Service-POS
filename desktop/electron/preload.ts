// ==============================================================================
// ISURU SERVICE CENTER POS: SECURE ELECTRON PRELOAD BRIDGE
// ==============================================================================
import { contextBridge, ipcRenderer } from 'electron';
import type { DesktopAPI, PrintInvoiceOptions, SystemDiagnostics, PrinterDevice } from './types.js';

const api: DesktopAPI = {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  printInvoice: (options?: PrintInvoiceOptions) => ipcRenderer.invoke('print-invoice', options),
  getDiagnostics: () => ipcRenderer.invoke('get-diagnostics'),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  exportDatabaseBackup: (targetPath?: string) => ipcRenderer.invoke('export-database-backup', targetPath),
  restoreDatabaseBackup: (filePath: string) => ipcRenderer.invoke('restore-database-backup', filePath),
};

contextBridge.exposeInMainWorld('desktopAPI', api);
