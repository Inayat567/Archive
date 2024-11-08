import { selectPeerByID, selectPeerScreenSharing, selectScreenShareByPeerID, useHMSStore, useVideo } from "@100mslive/react-sdk";
import { memo, useEffect } from "react";

let updated = 0;

const changed = {
    track: 0,
    peer: 0,
    ref: 0,
}

interface Props{
    peer: any,
}

function ScreensharingVideo(props: Props){

    if(props.peer){
        
        const track = useHMSStore(selectScreenShareByPeerID(props.peer.id));

        // const peer = useHMSStore(selectPeerScreenSharing);
        // const track = useHMSStore(selectScreenShareByPeerID(peer.id));
        // const track = useHMSStore(selectScreenShareByPeerID(peerId));
        // const peer = useHMSStore(selectPeerByID(peerId));
        // const { videoRef } = useVideo({
        //     trackId: track.id,
        // });

        // ++updated;
        console.log('updated', ++updated);

        useEffect(()=>{
            console.log('track changed', ++changed.track);
        }, [track])

        useEffect(()=>{
            console.log('peers changed', ++changed.peer);
        }, [props.peer])

        // useEffect(()=>{
        //     console.log('videoRef changed', ++changed.ref);
        // }, [videoRef])

        return (
            <div className="team-peer">
                <div className='team-peer__container'>
                <div className="team-peer__video-container" >
                        <Video track={track} peer={props.peer} />
                    </div>
                </div>
            </div>
        )
    }

    return null;
}

function Video(props: any){

    const { videoRef } = useVideo({
        trackId: props.track.id,
    });

    return (
         <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
        /> 
        
        // className={`${props.peer.isLocal ? 'mirror-video' : ''}`}
    )
}

const ScreensharingPeer = memo(ScreensharingVideo); // video blinks and updates like crazy without this

export default ScreensharingPeer;