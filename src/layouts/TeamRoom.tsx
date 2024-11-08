import { selectIsConnectedToRoom, selectIsSomeoneScreenSharing, selectPeers, selectPeerScreenSharing, selectScreenShareByPeerID, useHMSStore } from '@100mslive/react-sdk';
import TeamPeer from './TeamPeer';
import { useEffect, useReducer, useState } from 'react';
import {
  useHMSActions,
  selectLocalPeer,
  selectPeerAudioByID,
  selectSpeakers,
  selectDominantSpeaker
} from '@100mslive/react-sdk';
import { ROLES } from 'config/constants';
import TeamIcon from 'components/icons/calls/TeamIcon';
import TeamPeerSmall from './TeamPeerSmall';
import { MinimizeArrow } from 'components/common/MinimizeArrow';
import ScreensharingPeer2 from './ScreensharingPeer2';
import TeamMeetingActivityCounter from 'components/teams/TeamMeetingActivityCounter';
import { useLocation } from 'react-router-dom';
import usePeersPagination from 'hooks/usePeersPagination';
import { IPeersPagination } from '../hooks/usePeersPagination';
import Pagination from 'components/common/Pagination';

// roles that should not be visible in the list
const hiddenRoles = [
  ROLES.guest,
];

interface Props{
  children?: any,
  teamInfo: any,
  toggleMinimize: any,
  shouldBlur? : boolean,
}

export default function TeamRoom(props: Props) {

  const { teamInfo, toggleMinimize, shouldBlur = false } = props;
  const location = useLocation();
  const [lastDominant, setLastDominant] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [screensharingActive, setScreensharingActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);
  const { resizeToFullscreen, onElectronResize } = require('common/electronResize'); // cant be called on initialization of page
  const pagination: IPeersPagination = usePeersPagination();

  /*
    exit fullscreen
    - on disconnect
    - on screenshare end
    - on double click
    - on esc click
  */


  // 100ms
  const peers = useHMSStore(selectPeers);
  const localpeer = useHMSStore(selectLocalPeer);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const dominantSpeaker = useHMSStore(selectDominantSpeaker);
  const allSpeakers = useHMSStore(selectSpeakers);
  const screenshareOn = useHMSStore(selectIsSomeoneScreenSharing);
  const screensharingPeer = useHMSStore(selectPeerScreenSharing);
  const screensharingTrack = useHMSStore(selectScreenShareByPeerID(screensharingPeer?.id));


  useEffect(onDominantSpeakerChange, [isConnected, dominantSpeaker])
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


  function onDominantSpeakerChange(){
    if(isConnected){
      // console.log('dominant', dominantSpeaker);
      if(dominantSpeaker){
        setLastDominant(dominantSpeaker);
      }else if(lastDominant == null){
        // set yourself
        console.log('on init show yourself', localpeer);
        setLastDominant(localpeer);
      }
    }
  }

  function toggleFullscreen(value: boolean){

    console.log('toggleFullscreen', value, isFullscreen);

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

  return (
    <div className={`team-call-page__room ${isFullscreen && 'fullscreen-room'}`}>
      
      <div className='team-call-page__header'>
        <div className='header-title'>
          <img src={TeamIcon} />
          {teamInfo && teamInfo.name}
        </div>
        <div className='team-state'>

            {
              teamInfo && teamInfo.uid
              ?
              <TeamMeetingActivityCounter teamUid={teamInfo.uid} />
              :
              null
            }
          
            <MinimizeArrow toggleMinimize={toggleMinimize} />
            
        </div>
      </div>
      <div className={`team-call-page__container ${shouldBlur ? 'blur-section' : ''}`}>
        {
          screensharingActive && screensharingTrack
          ?
            <div className="team-call-page__main-speaker">
              <ScreensharingPeer2 
                peer={screensharingPeer} 
                track={screensharingTrack} 
                key={screensharingPeer?.id} 
                canToggleFullscreen={true}
                toggleFullscreen={toggleFullscreen}
                isFullscreen={isFullscreen}
                />
            </div>
          :
            peers.map((peer) => (
              (lastDominant!=null && lastDominant.id == peer.id) 
              ?
              <div 
                className="team-call-page__main-speaker" 
                key={`main_${peer.id}`} >
                <TeamPeer 
                  peer={peer} 
                  dominant={dominantSpeaker != null ? (dominantSpeaker.id == peer.id) : false}
                  talking={allSpeakers!=null && !!allSpeakers[String(peer?.audioTrack)]}
                /> 
              </div>
              :
              null
          ))
        }
        <div className='team-call-page__controls'>
          { props?.children && props.children }
        </div>
        <div className="team-call-page__peers">
          {peers.map((peer, idx) => (
              !peer.isLocal && 
              !hiddenRoles.includes(String(peer.roleName)) &&
              idx >= pagination.index.min && idx < pagination.index.max
              &&
              <TeamPeerSmall 
                key={`member_${peer.id}`} 
                peer={peer} 
                dominant={dominantSpeaker != null ? (dominantSpeaker.id == peer.id) : false}
                talking={allSpeakers!=null && !!allSpeakers[String(peer?.audioTrack)]}
                teamUid={teamInfo.uid}
              /> 

          ))}
        </div>
        {
          pagination.max > 1
          ?
            <div className='team-call-page__pagination'>
          
                <Pagination 
                  pagination={pagination.current}
                  maxPagination={pagination.max}
                  handleClick={pagination.change}
                  />
            </div>
          :
          null
        }
      </div>
    </div>
  );
}
