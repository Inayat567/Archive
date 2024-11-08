import { selectIsConnectedToRoom, useScreenShare, selectIsSomeoneScreenSharing, selectRoomState, selectPeers, selectPeerScreenSharing, selectScreenShareByPeerID, useHMSStore } from '@100mslive/react-sdk';
import { useEffect, useState } from 'react';
import Peer from './Peer';
import ScreensharingPeer2 from './ScreensharingPeer2';
import ScreensharePopup from 'components/screenshare/ScreensharePopup';
import useScreensharing from "hooks/useScreensharing";
import StopSharePopup from "components/screenshare/StopSharePopup";
import Controls from 'layouts/Controls';
import { CONNECTION_STATE } from 'config/constants';
import { MinimizeArrow } from 'components/common/MinimizeArrow';
import { useLocation } from 'react-router-dom';

interface Props{
  visible: boolean,
  children?: any,
  accepted: boolean,
  onLeave: any,
  toggleMinimize: any,
  person: any,
}

export default function PrivateRoom(props: Props) {

  const location = useLocation();
  const [screensharingActive, setScreensharingActive] = useState(false);
  const mirrorLocalShareScreen = false; // if a person who shares the screen should see it in a small video preview
  const [screensharePopup, toggleScreensharePopup] = useState(false);
  const [stopShareConfirmation, setStopShareConfirmation] = useState(false);
  const screensharingCtrl = useScreensharing();
  const { amIScreenSharing } = useScreenShare();
  const [isFullscreen, setFullscreen] = useState(false);
  const { resizeToFullscreen, onElectronResize } = require('common/electronResize'); // cant be called on initialization of page

  // 100ms
  const peers = useHMSStore(selectPeers);
  const screenshareOn = useHMSStore(selectIsSomeoneScreenSharing);
  const screensharingPeer = useHMSStore(selectPeerScreenSharing);
  const screensharingTrack = useHMSStore(selectScreenShareByPeerID(screensharingPeer?.id));
  const roomState = useHMSStore(selectRoomState);

  useEffect(()=>{
    return ()=>{
      if(amIScreenSharing){
          screensharingCtrl.stop();
      }
      if(isFullscreen){
        exitFullscreen();
      }
    }
  }, [])

  useEffect(()=>{
    if(screensharingActive != screenshareOn){
      setScreensharingActive(screenshareOn);
    }
  }, [screenshareOn])

  useEffect(()=>{
    if(!screensharingActive && !screensharingTrack && isFullscreen){
      exitFullscreen();
    }
  }, [screensharingActive, screensharingTrack, isFullscreen])

  function toggleFullscreen(value: boolean){

    if(value === null || value === undefined) value = !isFullscreen;

    if(value){
        setFullscreen(true);
        resizeToFullscreen();
    }else{
      exitFullscreen();
    }
  }

  function exitFullscreen(){
    setFullscreen(false)
    onElectronResize(location.pathname, true);
  }

  function toggleScreenshare(){

    if(!screensharePopup && !amIScreenSharing){
        toggleScreensharePopup(true);
    }else if(amIScreenSharing){
        setStopShareConfirmation(true); // needs confirmation popup and then call stopScreenshare
    }else{
        toggleScreensharePopup(false);
    }
  }

  function stopScreenshare(){
      setStopShareConfirmation(false);
      screensharingCtrl?.stop();
  }


  if(!props.visible){
    return null;
  }
  return (
    <div className={`private-room-section ${isFullscreen ? 'fullscreen-room' : ''} `}>
      <div className={`page-limiter ${stopShareConfirmation ? 'blur-section' : ''} `}>

      <MinimizeArrow toggleMinimize={props.toggleMinimize} theme={'light'} />
      
      { 
        screensharingActive && screensharingTrack && !screensharingPeer?.isLocal
        ?
          <ScreensharingPeer2 
            peer={screensharingPeer} 
            track={screensharingTrack} 
            key={screensharingPeer?.id} 
            canToggleFullscreen={true}
            toggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
            />
        :
          <div className="peers-container">
            {peers.map((peer) => (
              !peer.isLocal
              ? 
                <Peer 
                  key={peer.id} 
                  peer={peer} 
                  showName={props.accepted} 
                  nameClass={`${props.accepted ? 'person-name__top-left' : ''}`}  
                  /> 
              : 
                null
            ))}

            {
              mirrorLocalShareScreen && screensharingActive && screensharingTrack
              ?
              <div className='screenshare-preview'>
                <ScreensharingPeer2 
                  peer={screensharingPeer} 
                  track={screensharingTrack} 
                  key={screensharingPeer?.id} 
                  canToggleFullscreen={false}
                  />
              </div>
              :
              null
            }
          </div>
      }
      {
          props.accepted && (roomState == CONNECTION_STATE.connected)
          ? 
          <div className="call-overlay">
            <Controls 
              classNames={'sticky'} 
              onLeave={props.onLeave} 
              toggleScreenshare={toggleScreenshare} />
          </div>
          : 
          null
        }

      {
        props?.children && props.children
      }

        {/* choose screen to share */}
        {
        screensharePopup && 
        <ScreensharePopup 
            name={props.person?.name} 
            onClose={toggleScreenshare} 
            onShare={(screen: any) => screensharingCtrl.start(screen.id)} 
            />
        }

        
      </div>
      {/* confirmation for stopping screen sharing */}
      {
            stopShareConfirmation &&
            <StopSharePopup 
                onCancel={()=>{ setStopShareConfirmation(false) }} 
                onSuccess={stopScreenshare} 
                />
        }
    </div>
  );
}
