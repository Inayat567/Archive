import { resizeWindow } from 'common/electronResizeUtils';
import { WindowSizesInterface } from 'interfaces/WindowSizesInterface';

export function beforeSocialAuth(){
    const options: WindowSizesInterface = {
        size:{
            width: 993,
            height: 728,
        }
    }
    return setTimeout(()=>{
        resizeWindow(options)
    }, 2500); // give some time to load extern website
}
