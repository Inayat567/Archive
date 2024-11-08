import { useVideo } from "@100mslive/react-sdk";
import { memo, useCallback, useEffect, useState } from "react";

interface Props{
    peer: any,
    track: any,
    canToggleFullscreen: boolean,
    toggleFullscreen?: any,
    isFullscreen?: boolean,
}

function ScreensharingVideo(props: Props){

    const { track, peer, canToggleFullscreen } = props;
    const [busy, setBusy] = useState(false);
    let busyTimeout: any = null;

    const { videoRef } = useVideo({
        trackId: track.id,
    })

    useEffect(()=>{
        window.addEventListener('dblclick', onDoubleClick, false);
        document.addEventListener('keydown', onKeyDown, false);
        return ()=>{
            document.removeEventListener('keydown', onKeyDown, false);
            window.addEventListener('dblclick', onDoubleClick, false);
        }
    }, [])

    function onDoubleClick(){
        if(busy) return;
        if(canToggleFullscreen && !peer.isLocal && !props.isFullscreen){
            if(props.toggleFullscreen) props.toggleFullscreen(true);
            setBusy(true);
            busyTimeout = setTimeout(()=>{
                setBusy(false);
            }, 500)
        }
    }

    const onKeyDown = useCallback((event: any) => {
        if(peer.isLocal || !canToggleFullscreen) return;
        if (event.key == "Escape" || event.keyCode === 27) {
            if(props.toggleFullscreen) props.toggleFullscreen(false);
        }
      }, []);

    return(
        <div className="screensharing-peer">
            <div className="screensharing-peer__container">
                <div className="screensharing-peer__video-container">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        />
                    {
                        (canToggleFullscreen && props.isFullscreen && props.toggleFullscreen)
                        &&
                        <button className="toggle-fullscreen-button clear-light" onClick={()=>{ props.toggleFullscreen(false)}}>
                            Exit fullscreen
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

const ScreensharingPeer2 = memo(ScreensharingVideo); // video blinks and updates like crazy without this

export default ScreensharingPeer2;