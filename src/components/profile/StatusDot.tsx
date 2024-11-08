import { PRESENCE_COLORS, PRESENCE_VALUES } from "common/user";
import { usePresenceStore } from "common/userPresenceStore";
import { useEffect, useState } from "react";

export default function StatusDot(props: any){

    const currentState = usePresenceStore((state: any) => state.current );
    const [stateColor, setStateColor] = useState(PRESENCE_COLORS.online);

    useEffect(watchCurrentState, [currentState])

    function watchCurrentState(){
  
      if(currentState in PRESENCE_VALUES){
        setStateColor(PRESENCE_COLORS[currentState]);
      }else{
        // if not onlien or offline and has some status set then -> busy
        setStateColor(PRESENCE_COLORS.busy);
      }
  
    }

    return (
        <div className={props.classNames} style={{background: stateColor}}></div>
    )
}