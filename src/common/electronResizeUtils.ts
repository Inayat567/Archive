import { WindowSizesInterface } from "interfaces/WindowSizesInterface";


export function resizeWindow(item: WindowSizesInterface, options: any={}){

    const stayOnTop = item?.pinned === true ?? false;

    window.electron.send('customResize', {
        resize: {
            width: item.size.width,
            height: item.size.height,
        },
        stayOnTop,
        options,
    });
}


export function windowMinimize(width: number, height: number, pinned: boolean = false){
    
    window.electron.send('customResize', {
        resize: {
            width,
            height
        },
        stayOnTop: pinned,
        options:{
            minimizing: true,
        }
    });

}
