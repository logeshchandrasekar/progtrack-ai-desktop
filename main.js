const { app, BrowserWindow, ipcMain, Menu, shell, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store({
  name: 'progtrack-data',
  encryptionKey: 'pt-secure-2024',
});

let win;

// ── Path resolver: __dirname inside packaged .exe = virtual ASAR
// process.resourcesPath is always the real disk folder
function resolvePath(...segments) {
  if (app.isPackaged) return path.join(process.resourcesPath, ...segments);
  return path.join(__dirname, ...segments);
}

function createWindow() {
  win = new BrowserWindow({
    width:           1280,
    height:          820,
    minWidth:        900,
    minHeight:       600,
    title:           'ProgTrack AI',
    backgroundColor: '#0a0c10',
    icon:            resolvePath('icon.ico'),
    show:            false,
    webPreferences: {
      preload:          path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration:  false,
      webSecurity:      true,
    },
  });

  Menu.setApplicationMenu(buildMenu());
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.once('ready-to-show', () => win.show());

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.on('closed', () => { win = null; });
}

// ── IPC: Storage ──
ipcMain.handle('store-get',   (_, key)        => { try { return store.get(key, null);        } catch(e) { return null;  } });
ipcMain.handle('store-set',   (_, key, value) => { try { store.set(key, value); return true; } catch(e) { return false; } });
ipcMain.handle('store-del',   (_, key)        => { try { store.delete(key); return true;     } catch(e) { return false; } });
ipcMain.handle('store-has',   (_, key)        => { try { return store.has(key);              } catch(e) { return false; } });
ipcMain.handle('store-clear', ()              => { try { store.clear(); return true;         } catch(e) { return false; } });

ipcMain.handle('app-version', () => app.getVersion());
ipcMain.handle('app-path',    () => app.getPath('userData'));

// ── IPC: Video path ──
// In dev:      <project>/renderer/assets/PROGTRACK_AI.mp4
// In packaged: resources/PROGTRACK_AI.mp4   (copied there by extraResources)
// Returns a proper file:// URL — no path-building needed in the renderer
ipcMain.handle('video-path', () => {
  let filePath;
  if (app.isPackaged) {
    filePath = path.join(process.resourcesPath, 'PROGTRACK_AI.mp4');
  } else {
    filePath = path.join(__dirname, 'renderer', 'assets', 'PROGTRACK_AI.mp4');
  }
  // Convert to file:// URL — pathToFileURL handles Windows backslashes + spaces
  const { pathToFileURL } = require('url');
  return pathToFileURL(filePath).href;
});

// ── IPC: Icon path (kept for legacy use) ──
ipcMain.handle('renderer-path', () => {
  if (app.isPackaged) return path.join(process.resourcesPath, 'app.asar.unpacked', 'renderer');
  return path.join(__dirname, 'renderer');
});

ipcMain.handle('open-url', (_, url) => {
  if (url.startsWith('https://')) shell.openExternal(url);
});

// ── App Menu ──
function buildMenu() {
  return Menu.buildFromTemplate([
    {
      label: 'ProgTrack AI',
      submenu: [
        {
          label: 'About ProgTrack AI',
          click: () => dialog.showMessageBox(win, {
            type:    'info',
            title:   'ProgTrack AI',
            icon:    resolvePath('icon.ico'),
            message: 'ProgTrack AI v2.0.0',
            detail:  'Your smart developer learning dashboard.\n\nData stored locally on your machine — fully private.',
            buttons: ['OK'],
          }),
        },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload',            accelerator: 'CmdOrCtrl+R',       role: 'reload'           },
        { label: 'Force Reload',      accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload'      },
        { type: 'separator' },
        { label: 'Zoom In',           accelerator: 'CmdOrCtrl+Plus',    role: 'zoomIn'           },
        { label: 'Zoom Out',          accelerator: 'CmdOrCtrl+-',       role: 'zoomOut'          },
        { label: 'Reset Zoom',        accelerator: 'CmdOrCtrl+0',       role: 'resetZoom'        },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'F11',               role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' },
      ],
    },
  ]);
}

// ── Lifecycle ──
app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// ── Single instance ──
const lock = app.requestSingleInstanceLock();
if (!lock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
  });
}