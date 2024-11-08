import { ipcRenderer, screen } from 'electron';
const sys = process.platform;

function getScreen(){
    console.log('screen?', screen);

    // linux bug for screen = undefined??
    try{
      let displays = screen.getAllDisplays()
      let externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
      })  

      if(externalDisplay){
        console.log('externalDisplay', externalDisplay)
        return {
          width: externalDisplay.bounds.x,
          height: externalDisplay.bounds.y,
        };
      }
    }catch(err){
      console.error(2, err);
      return null;
    }

    try{
      const primaryDisplay = screen.getPrimaryDisplay();
      const { width, height } = primaryDisplay.workArea
      return {
        width,
        height,
      } 
    }catch(e){
      console.error(3, e);
      return null;
    }
}

function resize(params: any, stayOnTop: boolean){
  ipcRenderer.invoke('resize', params, stayOnTop)
}

async function shareableScreens(){
  return new Promise(async (resolve, reject)=>{
    try{
      const callback = (sources: any)=>{
        resolve(sources);
      }
      ipcRenderer.invoke('shareableScreens', { callback });
    }catch(err){
      reject(err);
    }
  })
}

const isMac = sys === "darwin";
const isWindows = sys === "win32";
const isLinux = sys === "linux";

export{
    resize,
    getScreen,
    shareableScreens,
    isMac,
    isWindows,
    isLinux,
}