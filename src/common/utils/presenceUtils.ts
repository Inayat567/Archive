import { PresenceStatusV2, PRESENCE_VALUES } from "common/user";
import { CUSTOM_USER_STATUSES } from "config/constants";
import * as StatusIcons from 'components/icons/StatusIcons'


export const currentActiveState = (presenceObj: PresenceStatusV2)=>{
    if(statusAndExpiryValid(presenceObj) && !presenceStatusExpired(presenceObj.expiry)){
        return presenceObj.status;
    }
    return presenceObj.presence;
}

export function presenceStatusExpired(expiry: number){
    return Date.now() >= expiry;
}

export function statusAndExpiryValid(presenceObj: PresenceStatusV2){
    return presenceObj.status != '' && presenceObj.expiry > 0
}

export function isOnline(presenceObj: PresenceStatusV2){
    return currentActiveState(presenceObj) != PRESENCE_VALUES.offline;
}

export function isOffline(presenceObj: PresenceStatusV2){
    return presenceObj.presence == PRESENCE_VALUES.offline;
}

export function notOfflineOrBusy(presenceObj: PresenceStatusV2){
    return presenceObj.presence != PRESENCE_VALUES.offline && presenceObj.presence != PRESENCE_VALUES.busy
}

// validates status and returns online or busy
export function onlineOrBusy(presenceObj: PresenceStatusV2){
    if(statusAndExpiryValid(presenceObj) && !presenceStatusExpired(presenceObj.expiry)){
        return presenceObj.status != '' 
            ? PRESENCE_VALUES.busy 
            : PRESENCE_VALUES.online;
    }
    return PRESENCE_VALUES.online;
}

export function getStatusTitle(state: string){
    const found = CUSTOM_USER_STATUSES.find(s => s.key == state);
    if(found){
        return found.title;
    }
    return null;
}

export function getStatusIcon(state: string): string|null{
    const found = CUSTOM_USER_STATUSES.find((s) => s.key == state && s.selectable === true);
    if(found && found.key in StatusIcons){
        return StatusIcons[found.key];
    }
    return null;
}

