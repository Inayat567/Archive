import { selectIsAllowedToPublish, useHMSStore } from "@100mslive/react-sdk";
import CloseWhite from "components/icons/CloseWhite";
import Loading from "components/icons/Loading";
import useConstructor from "hooks/useConstructor";
import { useEffect, useState } from "react";
import ScreenPreview from "./ScreenPreview";

interface Props{
    name?: string,
    onClose: any,
    onShare: any,
}

interface Source{
    id: string,
    name: string,
    thumbnail: any,
    [key: string]: any,
}

// select screen to be shared 
export default function ScreensharePopup(props: Props){

    const [screens, setScreens] = useState<Source[]>([]);
    const [selected, setSelected] = useState(null);
    const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
    
    useConstructor(init)

    async function init(){
        window.electron.ipcRenderer.once('screensharing', (sources: any) => {
            setSelected(sources[0]);
            setScreens(sources);
        });
        window.electron.ipcRenderer.sendMessage('screensharing', {});
    }

    function onShare(){
        // pass screen to be shared
        // close popup
        setTimeout(()=>{
            props.onShare(selected);
            props.onClose();
        }, 50);
    }
    
    return (
        <div className="screenshare-popup">
            <div className="screenshare-popup__container">
                <div className="screenshare-popup__close" onClick={props.onClose}>
                    <img src={CloseWhite} />
                </div>

                {
                    !isAllowedToPublish.screen
                    ?
                    <div className="screenshare-popup__title">
                        Screensharing disabled! Enable it in dashboard.
                    </div>
                    :
                    <div className="screenshare-popup__title">
                        Share your screen { props.name && `with ${props.name}`}
                    </div>

                }
               
                <div className="screenshare-popup__screens">

                    {
                        isAllowedToPublish.screen
                        ?
                            screens.length === 0
                            ?
                            <div className="screenshare-popup__loading">
                                <img src={Loading} />
                            </div>
                            :
                            <>
                                {
                                    screens.map((s, idx)=>{
                                        // if(idx < 2){ // for testing
                                            return (
                                                <ScreenPreview screen={s} isSelected={selected?.id == s.id} onSelect={()=>{ setSelected(s) }} key={s.id} />
                                            )
                                        // }
                                    })
                                }
                            </>
                        :
                        null
                    }

                </div>
                <div className="screenshare-popup__buttons">
                    <button className="outlined-light" onClick={props.onClose}>Cancel</button>
                    <button className="green" onClick={onShare} disabled={selected == null} >Share</button>
                </div>
            </div>
        </div>
    )
}