import { PresenceStatusV2, PRESENCE_COLORS, PRESENCE_VALUES } from "common/user";
import { useEffect, useState } from "react";
import { getStatusIcon, getStatusTitle, isOffline, onlineOrBusy } from "common/utils/presenceUtils";

interface Props{
    presenceObj: PresenceStatusV2,
}

export default function Presense(props: Props){

    const { presenceObj } = props;

    const [currentPresence, setCurrentPresence] = useState('');
    const [stateColor, setStateColor] = useState('');
    const [statusIcon, setStatusIcon] = useState<string|null>(null);
    const [statusTitle, setStatusTitle] = useState('');

    useEffect(onStateChange, [
        presenceObj.presence,
        presenceObj.status,
        presenceObj.expiry,
    ]);

    function onStateChange(){

        if(isOffline(presenceObj)){
            update('', '', null);
        }else{
            const check = onlineOrBusy(presenceObj);
            if(check == PRESENCE_VALUES.busy){
                
                const icon = getStatusIcon(presenceObj.status);
                const _statusTitle = getStatusTitle(presenceObj.status);
                const title = _statusTitle !== null ? _statusTitle : '';               
                update(PRESENCE_VALUES.busy, title, icon);
            }else{
                update(PRESENCE_VALUES.online, '', null)
            }
        }
    }

    function update(presence: string = '', title: string = '', icon: string|null){

        setCurrentPresence(presence);
        setStatusTitle(title);
        setStatusIcon(icon);

        const color = 
            presence == PRESENCE_VALUES.online ? PRESENCE_COLORS.online :
                presence == PRESENCE_VALUES.busy ? PRESENCE_COLORS.busy :
                    PRESENCE_COLORS.offline;

        setStateColor(color)
    }

    if(statusIcon !== null){
        return (
            <span><img src={statusIcon} alt={statusTitle} /></span>
        )
    }
    
    // wanna display online? or green button is enough?
    // if(!!presenceObj.presence){
    //     return (
    //         <span style={{color: stateColor }}>{currentPresence}</span>
    //     )
    // }

    return null;
}