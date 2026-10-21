/**
 * Multi-Screen Synchronization Service
 * Uses BroadcastChannel with localStorage fallback
 * Allows Admin Operator window to drive the Audience Stage window on a second monitor/projector.
 */

const CHANNEL_NAME = "top10_ceremony_sync_v1";

class SyncService {
  constructor() {
    this.channel = null;
    this.listeners = new Set();

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (event) => {
        this.notify(event.data);
      };
    } else if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'top10_ceremony_sync_msg' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.notify(data);
          } catch {
            // Ignore
          }
        }
      });
    }
  }

  broadcast(action, payload = {}) {
    const message = { action, payload, timestamp: Date.now() };
    if (this.channel) {
      this.channel.postMessage(message);
    } else if (typeof window !== 'undefined') {
      localStorage.setItem('top10_ceremony_sync_msg', JSON.stringify(message));
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(data) {
    this.listeners.forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.error("Error in sync callback:", err);
      }
    });
  }
}

export const syncService = new SyncService();
