// const electron = require('electron');
// let display = electron.screen.getPrimaryDisplay()
// const { width, height } = display.bounds

import { HOME_ROUTE, INCOMING_ROUTE, LOGIN_ROUTE, LOGIN_ROUTE_SMALL, LOGOUT_ROUTE, OUTGOING_ROUTE, PROFILE_ROUTE, REGISTER_ROUTE, RESET_ROUTE, RESET_ROUTE_SMALL, TEAM_CALL_ROUTE } from "config/routes";
import { WindowSizesInterface } from "interfaces/WindowSizesInterface";
import { resizeWindow } from "./electronResizeUtils";

// const win = electron.BrowserWindow.getCurrentWindow();
// import { ipcRenderer } from 'electron'

// Right after the line where you changed the document.location

let lastItem: WindowSizesInterface|null;

export const sizes: WindowSizesInterface[] = [
    {
        name: 'Extra Large',
        pages: [
            LOGIN_ROUTE,
            REGISTER_ROUTE,
            RESET_ROUTE,
            '/social-auth'
        ],
        size:{
            width: 993,
            height: 728,
        },
    },
    {
        name: 'TeamCallSize', // team call size
        pages: [
            TEAM_CALL_ROUTE,
        ],
        size:{
            width: 604,
            height: 728,
        },
        pinned: true,
    },
    {
        name: 'Medium',
        pages: [
            
            INCOMING_ROUTE,
            OUTGOING_ROUTE,
        ],
        size:{
            width: 541,
            height: 359,
        },
        pinned: true,
    },
    {
        name: 'Default',
        pages: [
            HOME_ROUTE,
            PROFILE_ROUTE,
        ],
        size: {
            width: 280,
            height: 445, 
        },
        pinned: true,
    },

    // home page changes size based on content displayed
    {
        name: 'contacts-expanded',
        pages: ['/home-contacts-expanded'],
        size: {
            width: 520, // half expanded
            height: 476,
        },
        pinned: true,
    },
    {
        name: 'Small Auth Pages',
        pages: [
            LOGIN_ROUTE_SMALL,
            RESET_ROUTE_SMALL,
            LOGOUT_ROUTE, // prevent multi resize when going from profile to logout to login
        ],
        size: {
            width: 280,
            height: 440, 
        },
    },
];

export function resizeToFullscreen(){

    try{
        const item = {
            name: 'fullcreen',
            pages: [''],
            size: {
                width: window.screen.width,
                height: window.screen.height,
            }
        } as WindowSizesInterface;
        lastItem = item; // so that normal resize triggers properly
        window.electron.send('maximize');
        // window.electron.send('fullscreen', true);

    }catch(err){
        
    }
}

export async function onElectronResize(path: string, forceResize = false, options: any={}, secondTry=false){

    if(String(path).length == 0){
        console.error('onElectronResize NO PATH provided', path);
        return;
    }

    let item: WindowSizesInterface = findItemForResize(path);

    if(item != null){
        if(lastItem?.name == item.name && !forceResize){

        }else{
            resizeWindow(item, options);
            lastItem = item; // in case we need it for bugFixForWindowMovement
        }
    }else if(!secondTry && path !== HOME_ROUTE){
        const splt = path.split('/');
        onElectronResize(`/${splt[1]}`, forceResize, options, true);
    }

}

function findItemForResize(path: string): WindowSizesInterface|null{
    let found = findInSizes(path);
    if(found === null && path !== HOME_ROUTE){
        const splt = path.split('/');
        found = findInSizes(`/${splt[1]}`);
    }
    return found;
}

function findInSizes(str: string){
    if( ! String(str).startsWith('/') ){
        console.error('path string should start with /', str);
        return null;
    }
    for(let i=0;i<sizes.length;i++){
        const item = sizes[i];
        if(item && item.pages?.includes(str)){
            return item;
        }
    }
    return null;
}

export function focusApp(){
    window.electron.send('focusApp');
}
