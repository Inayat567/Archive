import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { resize, getScreen, shareableScreens, isMac, isLinux, isWindows } from './preloadUtils'

export type Channels = any; //'ipc-example';

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

contextBridge.exposeInMainWorld('electron', {
  isDebug,
  resize,
  shareableScreens,
  getScreen,
  isMac,
  isLinux,
  isWindows,
  send(eventName: string, args: any){ // disable?
    ipcRenderer.send(eventName, args); // TODO - send -> invoke (because safer)
  },
  ipcRenderer: { // disable?
    sendMessage(channel: Channels, args: any[]) {
      ipcRenderer.send(channel, args); 
    },
   
    on(channel: Channels, func: (...args: any[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    off(channel: Channels, subscription: any){
      ipcRenderer.removeListener(channel, subscription);
    }
  },
});

window.addEventListener('DOMContentLoaded', () => {
  for (const dependency of ['chrome', 'node', 'electron']) {
    console.log(`VERSION: ${dependency}`, process.versions[dependency])
  }
})
