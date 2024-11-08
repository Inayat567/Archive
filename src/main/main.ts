/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */

import path from 'path';
import { app, BrowserWindow, shell, ipcMain, TitleBarOverlay, desktopCapturer, systemPreferences } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { isLinux, isMac, isWindows } from './preloadUtils';
import { ipcRenderer,  } from 'electron';

let allowMaximize = false;

interface OS_Configs{
  titleBarOverlay: boolean | TitleBarOverlay | undefined,
  titleBarStyle: "hidden" | "customButtonsOnHover" | "default" | "hiddenInset" | undefined,
}

let stopMainListener = null;
let forceQuit = false;
let closeCount = 0;
let resizeCount = 0;


class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('screensharing', async (event, arg)=>{

  const types = ['screen']; // ['window', 'screen']
  const sources = await desktopCapturer.getSources({ types }).catch(err => console.error(err));
  if(sources){
    const ret = sources.map(s => {
        return {
          id: s.id,
          name: s.name,
          preview: s.thumbnail.toDataURL()
        }
      })
    event.reply('screensharing', ret);
  }
})

let previuosBounds: any = null;

ipcMain.on("fullscreen", async (event, activate)=>{

  if(!mainWindow) return;

  if(activate){

      const { screen } = require('electron')

      previuosBounds = mainWindow.getBounds();

      // Create a window that fills the screen's available work area.
      const primaryDisplay = screen.getPrimaryDisplay()
      const { width, height } = primaryDisplay.workArea;
      changeBounds({
        x: 0,
        y: 0,
        width,
        height,
      });

      mainWindow.setFullScreen(true);
      event.reply('fullscreen', true);

    
  }else{

      mainWindow.setFullScreen(false);
      event.reply('fullscreen', false);

      if(previuosBounds !== null){
        changeBounds(previuosBounds);
        previuosBounds = null;
      }else{
        const contentSize = mainWindow.getContentSize();
        handleResize(contentSize[0], contentSize[1]);
      }
  }
 
})

ipcMain.on('maximize', (event, params: any)=>{
  try{
    if(mainWindow !== null){
      allowMaximize = true;
      mainWindow.setResizable(true); // othertise maximize wont work
      mainWindow.maximize();
      setTimeout(()=>{
        mainWindow.setResizable(false);
        allowMaximize = false;
      }, 500)
      mainWindow.setAlwaysOnTop(false);
    }
  }catch(err){
    
  }
})

function changeBounds(params: any){

  const {out, x, y} = outOfBounds(params)

  if(out && resizeCount > 0){ // resizeCount = 0 when app just loads
    const newParams = {
      ...params,
      x,
      y,
    }
    mainWindow?.setBounds(newParams, true)
  }else{
    mainWindow?.setBounds(params, true);
  }
  
  resizeCount++;
}

function outOfBounds(params: any){
  
  if(mainWindow != null){

    const { screen } = require('electron')
    
    const bounds = mainWindow.getBounds()
    const display = screen.getDisplayMatching(bounds)

    const [currentX, currentY] = mainWindow.getPosition()
    const [currentWidth, currentHeight] = mainWindow.getSize()
    let x = params.x || currentX
    let y = params.y || currentY
    const w = params.width || currentWidth
    const h = params.height || currentHeight

    const isOutofBounds = x < display.bounds.x ||
                          y < display.bounds.y ||
                          x + w > display.bounds.x + display.bounds.width ||
                          y + h > display.bounds.y + display.bounds.height;

    if(isOutofBounds){
      if (x < display.bounds.x) {
        x = display.bounds.x + APP_OFFSET
      }
      if (y < display.bounds.y) {
        y = display.bounds.y + APP_OFFSET
      }
      if(x + w > display.bounds.x + display.bounds.width){
        x = display.bounds.x + display.bounds.width - w - APP_OFFSET
      }
      if(y + h > display.bounds.y + display.bounds.height){
        y = display.bounds.y + display.bounds.height - h - APP_OFFSET
      }
      return {
        out: true,
        x,
        y,
      }
    }
  }
  return {
    out: false
  }
}

function handleResize(width: number, height: number, stayOnTop: boolean = false, options: any = {}){

  console.log('handle resize', width, height, options, mainWindow?.isFullScreen());

  if(options?.minimizing || options?.maximizing){ // should adjust position based on current app size minus new app size

    const adjust = findMinimizedPosition(width, height);

    if(adjust!=null){
      changeBounds({
        width,
        height,
        x: adjust.x,
        y: adjust.y
      });
    }else{
      changeBounds({
        width,
        height,
      });
    }

  }else if(shouldChangePosition()){ // forced on minimization
    

    const { x,y } = calcAppPosition(width, height);
    changeBounds({
      width,
      height,
      x,
      y,
    });

  }else{

    changeBounds({
      width,
      height,
    });

  }

  try{  
    if(mainWindow){
        const isOnTop = mainWindow.isAlwaysOnTop();
        if(isOnTop != stayOnTop){
          if(stayOnTop){
            // mainWindow.moveTop(); // this can focus app
            mainWindow.setAlwaysOnTop(stayOnTop);
          }else{
            mainWindow.setAlwaysOnTop(stayOnTop);
          }
        }
          
    }
  }catch(err){

  }

}

ipcMain.on('customResize', (event, params: any) => {
  const { resize, stayOnTop, options={} } = params;
  const { width, height } = resize;

  if(mainWindow?.isMaximized()){
    mainWindow.unmaximize();
  }
  
  handleResize(width, height, stayOnTop, options);
  
})

ipcMain.on('focusApp', (event, params: any)=>{
  if(mainWindow !== null){
    mainWindow.moveTop();
  }
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  const debug = require('electron-debug');
  const debugOptions = {
    showDevTools: false, // hidden by default
  }
  debug(debugOptions);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const beforeAppClose = ()=>{

  // update user status to offline

}

const requestMediaAccess = ()=>{
  if(isMac || isWindows){
    try{
      systemPreferences.askForMediaAccess('camera')
        .then((allowed)=>console.log('Camera is allowed'))
    }catch(err){
      console.error(err);
    }

    try{
      systemPreferences.askForMediaAccess('microphone')
        .then((allowed)=>console.log('Microphone is allowed'))
    }catch(err){
      console.error(err);
    }
  }

}

const APP_OFFSET = 20;

function calcAppPosition(width: number, height: number){

  const { screen } = require('electron')
  const primaryDisplay = screen.getPrimaryDisplay()

  return {
    x: parseInt(primaryDisplay.bounds.x + primaryDisplay.bounds.width - width - APP_OFFSET),
    y: parseInt(primaryDisplay.bounds.y + primaryDisplay.bounds.height - height - APP_OFFSET),
  }
}

function shouldChangePosition(){

  if(resizeCount === 0) return true;

  // const { screen } = require('electron')
  // const primaryDisplay = screen.getPrimaryDisplay()
  const contentSize: any = mainWindow?.getContentSize();
  const currentPosition = mainWindow?.getPosition();

  const {x,y} = calcAppPosition(contentSize[0], contentSize[1]);

  if(x != currentPosition[0] || y != currentPosition[1]){
    return false;
  }
  return true;
}

function findMinimizedPosition(width: number, height: number){
  // calc difference between current contentSize and newContent size
  // get position
  // adjust position by that difference

  if(!mainWindow){
    return null;
  }

  const contentSize: any = mainWindow.getContentSize();
  const diff = {
    x: contentSize[0] - width,
    y: contentSize[1] - height,
  } 

  
  const pos = mainWindow.getPosition();
  
  const posDiff = {
    x: pos[0] + diff.x,
    y: pos[1] + diff.y
  }

  return posDiff;
}

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };



  

  const windowsConfig: OS_Configs = {
    titleBarOverlay: false,
    titleBarStyle: 'hidden',
  }

  const macConfig: OS_Configs = {
    titleBarOverlay: false,
    titleBarStyle: 'customButtonsOnHover',
  }

  const linuxConfig: OS_Configs = {
    titleBarOverlay: false, // cant control on linux
    titleBarStyle: 'default', // cant control on linux
  }

  const defaultConfig: OS_Configs = {
    titleBarOverlay: true,
    titleBarStyle: 'hidden',
  }

  const osConfig = 
      isWindows ? windowsConfig : 
          isMac ? macConfig : 
            isLinux ? linuxConfig : 
              defaultConfig;

  mainWindow = new BrowserWindow({
    show: false,
    // width: 1400,
    // height: 800,    
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    minimizable: false,
    maximizable: false,
    closable: true, // NEVER SET THIS TO FALSE (or you wont be able to close app)
    resizable: false, 
    fullscreen: false,
    fullscreenable: false, 
    // kiosk: true, // disable keyboard shortcuts, prevent other programs from popping up on your screen, etc
    alwaysOnTop: false, // this is toggleable on resize
    autoHideMenuBar: true,
    // useContentSize: true, // resize based on content? doesnt really work
    frame: false,
    ...osConfig,
  });



  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
    requestMediaAccess();
  });

  mainWindow.on('maximize', () => {
    if(!allowMaximize) mainWindow.unmaximize()
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // catch close event
  mainWindow.on('close', (event)=>{
    // ask if it should minimize instead?

    closeCount += 1;
    if(closeCount > 2) forceQuit = true;
    
    if(!forceQuit){
      // event.preventDefault();
      // mainWindow?.hide();
    }

    // require('dialog').showMessageBox({
    //     message: "Close button has been pressed!",
    //     buttons: ["OK"]
    // });

    // mainWindow?.webContents.send('before-app-close'); // doesnt work on OSX, need confirmation dialog? (gives time to execute)
  })

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
* Add event listeners...
*/

app.on('window-all-closed', () => {
  
  beforeAppClose();

  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
