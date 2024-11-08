import { useEffect, useState } from "react";
import { selectIsAllowedToPublish, selectIsConnectedToRoom, useHMSActions, useHMSStore, useScreenShare } from "@100mslive/react-sdk";
import useConstructor from "./useConstructor";

const isScreenshareSupported = () => {
    return typeof navigator.mediaDevices.getDisplayMedia !== "undefined";
};

 // Add custom tracks
    // ... 
    // screenshare with custom-built annotations in an electron app.
    // ...
    // https://www.100ms.live/docs/javascript/v2/advanced-features/custom-tracks

export default function useScreensharing(){

    let currentTrack: string|null = null;
    const hmsActions = useHMSActions();
    const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
    const { amIScreenSharing } = useScreenShare();
    const isConnected = useHMSStore(selectIsConnectedToRoom);

    useConstructor(()=>{
        if(!isScreenshareSupported()){
            console.error('Screensharing is not supported!');
        }
    })

    useEffect(()=>{
        // this needs delay, because it triggers very early
        if(isConnected){
            if(!isAllowedToPublish.screen){
                const url = "https://dashboard.100ms.live/dashboard";
                console.error('Screensharing is disabled in 100ms dashboard. Go to '+url+' and enable it!');
            }
        }
    }, [isConnected])

    async function start(trackId: any, type:string = 'screen'){
        console.log('start', trackId, isAllowedToPublish.screen, amIScreenSharing);
        if(isAllowedToPublish.screen && !amIScreenSharing){
            // const track = await getMediaTrack(trackId);
            const mediaStreamTrack = await getMediaStreamTrack(trackId);
            if(mediaStreamTrack){
                await hmsActions.addTrack(mediaStreamTrack, type); // by default it wont know which track tryign to share here.. so add a track selected in popup
                await hmsActions.setScreenShareEnabled(true, { videoOnly: true });
                currentTrack = trackId;
            }
        }
    }

    async function getMediaStreamTrack(trackId: string){

        const config = {
            video: getVideoConfig(trackId),
            audio: false,
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia(config).catch(console.error);

        if(mediaStream){
            return mediaStream.getVideoTracks()[0];
            // track.applyConstraints(constraints)
        }
        return null;
    }

    function getVideoConfig(trackId: any){
        const videoConfig: any = {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: trackId,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720
            }
        }
        console.log('config', trackId, videoConfig);
        return videoConfig;
    }

    async function stop(){
        if(currentTrack != null){
            await hmsActions.removeTrack(currentTrack)
            console.log('STOP SCREENSHARE', currentTrack);
        }else{
            console.log('missing currentTrack', currentTrack);
        }

        await hmsActions.setScreenShareEnabled(false);
    }

    return {
        start,
        stop,
        active: isAllowedToPublish.screen && amIScreenSharing
    }
}