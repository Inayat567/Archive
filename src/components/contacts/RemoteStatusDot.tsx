import { PRESENCE_VALUES, PRESENCE_COLORS } from "common/user";
import { useEffect, useState } from "react";

interface Props{
  classNames?: string,
  currentState: any,
}

export default function RemoteStatusDot(props: Props){

    const { currentState } = props;
    const [stateColor, setStateColor] = useState('transparent');

    useEffect(watchCurrentState, [currentState])

    function watchCurrentState(){
      if(currentState == PRESENCE_VALUES.offline){
        setStateColor('transparent');
      }else if(currentState in PRESENCE_VALUES){
        setStateColor(PRESENCE_COLORS[currentState]);
      }else{
        // if not online or offline and has some status set then -> busy
        setStateColor(PRESENCE_COLORS.busy);
      }
    }

    return (
        <div className={props.classNames} style={{background: stateColor}}></div>
    )
}