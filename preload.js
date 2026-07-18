/**
 * preload.js — Secure Context Bridge
 * Exposes ONLY required APIs to the renderer.
 * Node.js and Electron internals stay sandboxed.
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Storage
  get:     (key)        => ipcRenderer.invoke('store-get',   key),
  set:     (key, value) => ipcRenderer.invoke('store-set',   key, value),
  del:     (key)        => ipcRenderer.invoke('store-del',   key),
  has:     (key)        => ipcRenderer.invoke('store-has',   key),
  clear:   ()           => ipcRenderer.invoke('store-clear'),

  // App info
  version:         () => ipcRenderer.invoke('app-version'),
  dataPath:        () => ipcRenderer.invoke('app-path'),

  // Returns a ready-to-use file:// URL for the intro video
  getVideoPath:    () => ipcRenderer.invoke('video-path'),

  // Legacy renderer folder path (kept for compatibility)
  getRendererPath: () => ipcRenderer.invoke('renderer-path'),

  // Open external links safely in default browser
  openURL: (url)      => ipcRenderer.invoke('open-url', url),
});