import { defaultPresenceState, PresenceStatusV2, PRESENCE_VALUES } from "common/user";
import { isOffline, onlineOrBusy, presenceStatusExpired, statusAndExpiryValid } from "common/utils/presenceUtils";
import { useEffect, useState } from "react";
import useConstructor from "./useConstructor";
import * as RDB from 'firebase/firebaseCallEvents';
import { presenceKey } from "common/realtimeCallKeys";



export function useAvailablePresence(presenceObj: PresenceStatusV2){

    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(onPresenseChange, [
        presenceObj.presence, 
        presenceObj.status, 
        presenceObj.expiry
    ]);

    function onPresenseChange(){
        if(isOffline(presenceObj)){
            setIsAvailable(false);
        }else{
            const status = onlineOrBusy(presenceObj);
            setIsAvailable(status == PRESENCE_VALUES.online ? true : false);
        }
    }

    return isAvailable;
}

export function usePresenceListener(user: any): { presenceObj: PresenceStatusV2, stopListener: CallableFunction}{
    
    let stopListener = ()=>{};
    const [presenceObj, setPresenceObj] = useState<PresenceStatusV2>(defaultPresenceState);

    useConstructor(()=>{
        check();
        stopListener = listen();
    })

    function check(){
        RDB.readOnce(presenceKey(user.uid), (val: PresenceStatusV2)=>{
            if(val) setPresenceObj(val);
        })
    }
    
    function listen(){
        return RDB.listen(presenceKey(user.uid), (value: PresenceStatusV2)=>{
            if(!!value) setPresenceObj(value);
        })
    }

    return {
        presenceObj,
        stopListener
    }
}