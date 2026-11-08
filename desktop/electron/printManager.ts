// ==============================================================================
// ISURU SERVICE CENTER POS: PRINT MANAGER
// ==============================================================================
import { BrowserWindow } from 'electron';
import type { PrinterDevice, PrintInvoiceOptions } from './types.js';

export class PrintManager {
  /**
   * Enumerate available printer devices from Windows print spooler.
   */
  public static async getPrinters(window: BrowserWindow): Promise<PrinterDevice[]> {
    try {
      const printers = await window.webContents.getPrintersAsync();
      return printers.map((p) => ({
        name: p.name,
        displayName: p.displayName || p.name,
        description: p.description || '',
        status: p.status,
        isDefault: p.isDefault,
      }));
    } catch (err: any) {
      console.error('[PrintManager] Failed to get printers:', err);
      return [];
    }
  }

  /**
   * Execute invoice or receipt printing with appropriate page geometry.
   */
  public static async printInvoice(
    window: BrowserWindow,
    options?: PrintInvoiceOptions
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const pageSize = options?.pageSize || 'A4';
      const silent = options?.silent ?? false;
      const printerName = options?.printerName;
      const copies = options?.copies || 1;

      // Configure dimensions for thermal and standard receipt formats
      const printSettings: Electron.WebContentsPrintOptions = {
        silent,
        printBackground: true,
        copies,
        margins: {
          marginType: 'none',
        },
      };

      if (printerName) {
        printSettings.deviceName = printerName;
      }

      if (pageSize === 'Thermal58') {
        printSettings.pageSize = {
          width: 58000, // 58mm in microns
          height: 297000,
        };
      } else if (pageSize === 'Thermal80') {
        printSettings.pageSize = {
          width: 80000, // 80mm in microns
          height: 297000,
        };
      } else if (pageSize === 'Letter') {
        printSettings.pageSize = 'Letter';
      } else {
        printSettings.pageSize = 'A4';
      }

      return new Promise((resolve) => {
        window.webContents.print(printSettings, (success, failureReason) => {
          if (!success) {
            console.error('[PrintManager] Print failed:', failureReason);
            resolve({ success: false, error: failureReason });
          } else {
            resolve({ success: true });
          }
        });
      });
    } catch (err: any) {
      console.error('[PrintManager] Print invocation error:', err);
      return { success: false, error: err.message };
    }
  }
}
