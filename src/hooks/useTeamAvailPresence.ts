

import { PRESENCE_VALUES } from "common/user";
import { useEffect, useState } from "react";


export default function useTeamAvailPresence(teamPresence: any, currentUser: any){
    
    const [somebodyOnline, setSombodyOnline] = useState(false);

    useEffect(onPresenseChange, [teamPresence]);

    function onPresenseChange(){
        let onlineCount = 0;
        try{
            Object.keys(teamPresence).forEach((uid: any) => {
                let presence = teamPresence[uid];
                if(isAvailable(presence) && uid != currentUser.uid){
                    onlineCount += 1;
                }
            });
        }catch(err){
            console.error(err);
        }
        setSombodyOnline(onlineCount > 0);
    }

    function isAvailable(presence: string){
        return presence == PRESENCE_VALUES.online;
    }

    return somebodyOnline;
}