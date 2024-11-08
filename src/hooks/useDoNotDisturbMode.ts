
// handle toggler

import { PresenceContext } from "common/context";
import UserPresence from "common/UserPresence";
import { STATUS_DO_NOT_DISTURB } from "config/constants";
import { useContext, useEffect, useState } from "react";
import { usePresenceStore } from 'common/userPresenceStore';

const oneYear = 365 * 24 * 60 * 60 * 1000;

export default function useDoNotDisturbtMode(value: boolean, initializing = true){

    const presenceObj = usePresenceStore((state: any )=> state.data)
    const presenceContext: UserPresence|null = useContext(PresenceContext);
    const [doNotDisturb, setDoNotDisturb] = useState<boolean>(value);

    useEffect(listenForOutsideChanges, [ presenceObj.status ]);
    useEffect(onChange, [value]);

    function listenForOutsideChanges(){

        // status got changed from outside
        if(presenceObj.status != STATUS_DO_NOT_DISTURB){ 
            setDoNotDisturb(false);
        }
    }

    function onChange(){

        if(initializing) return

        if(value !== doNotDisturb){
            setDoNotDisturb(value);
        }

        if(value){
            const nowPlusOneYear = Date.now() + oneYear;
            presenceContext?.changeStatus(STATUS_DO_NOT_DISTURB, nowPlusOneYear)
        }else{
            presenceContext?.changeStatus('', 0);
        }    
    }

    return doNotDisturb;
}