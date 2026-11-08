// ==============================================================================
// SERVICE WORKER REGISTRATION & PERSISTENT STORAGE MANAGER (WORKBOX PWA)
// ==============================================================================

export interface StorageStatus {
  isPersisted: boolean;
  quotaMB: number;
  usageMB: number;
  percentUsed: number;
  isLowSpace: boolean;
}

export async function getStorageStatus(): Promise<StorageStatus> {
  let isPersisted = false;
  let quotaMB = 0;
  let usageMB = 0;
  let percentUsed = 0;
  let isLowSpace = false;

  if (typeof navigator !== 'undefined' && navigator.storage) {
    if (navigator.storage.persisted) {
      isPersisted = await navigator.storage.persisted();
    }
    if (navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      if (estimate.quota && estimate.usage !== undefined) {
        quotaMB = Math.round(estimate.quota / (1024 * 1024));
        usageMB = Math.round((estimate.usage / (1024 * 1024)) * 100) / 100;
        percentUsed = Math.round((estimate.usage / estimate.quota) * 100);
        isLowSpace = percentUsed > 85;
      }
    }
  }

  return {
    isPersisted,
    quotaMB,
    usageMB,
    percentUsed,
    isLowSpace,
  };
}

export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[Workbox PWA] ServiceWorker registered with scope:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('[Workbox PWA] New version installed and ready.');
                  } else {
                    console.log('[Workbox PWA] Content fully precached for offline use.');
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn('[Workbox PWA] ServiceWorker registration failed:', error);
        });
    });
  }

  // Request Persistent Storage to prevent the browser from evicting IndexedDB under disk pressure
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().then((persistent) => {
      if (persistent) {
        console.log('[Storage] Persistent storage granted by browser.');
      } else {
        console.log('[Storage] Storage persistence not granted; site may be subject to eviction under heavy disk pressure.');
      }
    });
  }
}
