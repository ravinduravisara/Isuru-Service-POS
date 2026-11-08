// ==============================================================================
// ISURU SERVICE CENTER POS: DESKTOP IPC TYPE DEFINITIONS
// ==============================================================================

export interface PrinterDevice {
  name: string;
  displayName: string;
  description: string;
  status: number;
  isDefault: boolean;
}

export interface PrintInvoiceOptions {
  printerName?: string;
  silent?: boolean;
  pageSize?: 'A4' | 'Thermal58' | 'Thermal80' | 'Letter';
  copies?: number;
}

export interface SystemDiagnostics {
  appVersion: string;
  platform: string;
  arch: string;
  backendUrl: string;
  backendStatus: 'ONLINE' | 'OFFLINE' | 'INITIALIZING';
  postgresStatus: 'RUNNING' | 'STOPPED' | 'PORT_IN_USE';
  postgresPort: number;
  programDataDir: string;
  isOnline: boolean;
}

export interface DesktopAPI {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  isMaximized: () => Promise<boolean>;
  getPrinters: () => Promise<PrinterDevice[]>;
  printInvoice: (options?: PrintInvoiceOptions) => Promise<{ success: boolean; error?: string }>;
  getDiagnostics: () => Promise<SystemDiagnostics>;
  openExternal: (url: string) => Promise<void>;
  exportDatabaseBackup: (targetPath?: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;
  restoreDatabaseBackup: (filePath: string) => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    desktopAPI?: DesktopAPI;
  }
}
