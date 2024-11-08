import { useHMSActions, useHMSStore, selectIsConnectedToRoom, selectRoomState, useDevices, selectIsLocalAudioEnabled, selectIsLocalVideoEnabled } from '@100mslive/react-sdk';
import { UserContext } from 'common/context';
import { useContext, useEffect, useState } from 'react';
import { ROLES } from 'config/constants';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CallInvitation from 'components/video/CallInvitation';
import CallOverlay from 'components/video/CallOverlay';
import PrivateRoom from 'layouts/PrivateRoom';
import { userName } from 'common/utils';
import * as RDB from 'firebase/firebaseCallEvents' // firebase realtime database 
import { InvitationStateType, PrivateInvitationDataInterface, PRIVATE_MEETING_STATE } from 'interfaces/PrivateInvitationDataInterface';
import { privateCallKey } from 'common/realtimeCallKeys';
import { getRoomToken } from 'common/apiRequests';
import useConstructor from 'hooks/useConstructor';
import { MinimizeArrow } from 'components/common/MinimizeArrow';
import Controls from 'layouts/Controls';
import { checkForMissedCall, removeMissedCall } from 'hooks/useMissedCalls';
import { getUserInfo } from 'firebase/firebaseUser';
import { UserInterface } from 'interfaces/UserInterface'
import { setLastInteraction } from 'interfaces/LastInteractionHandler';
import { updateInvitationState } from 'common/utils/privateCallStateManagement';
import { useRequestsStore } from '../common/useRequestsStore';
import Loading from 'components/icons/Loading';

interface Props{
  toggleMinimize: any;
}

type Params = {
  room: string;
  inviter: string;
}

export default function IncomingCallPage(props: Props) {

  const { room, inviter } = useParams<Params>();
  const { toggleMinimize } = props;
  const [accepted, setAccepted] = useState(false);
  const [incoming, setIncoming] = useState<null|PrivateInvitationDataInterface>(null);
  const [inviterInfo, setInviterInfo] = useState<null|UserInterface>(null);
  const { user } = useContext<any>(UserContext);
  const navigate = useNavigate();
  const [creatorState, setCreatorState] = useState('');
  const [searchParams, _] = useSearchParams();
  const [ready, setReady] = useState(false);
  const autoAccept = !!searchParams.get('autoaccept');
  const pendingRedirect = useRequestsStore((s:any)=> s.pendingRedirect);
  // const useRequestStore = useRequestsStore();

  // 100ms 
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const roomState = useHMSStore(selectRoomState);
  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const videoEnabled = useHMSStore(selectIsLocalVideoEnabled);

  
  useConstructor(init);
  useEffect(onConnection, [roomState, isConnected])
  useEffect(onComponentMount, []);
  useEffect(watchState, [creatorState])
  useEffect(()=>{
    if(pendingRedirect && ready){
      removeBeforeUnload();
      onPageClose();
    }
  }, [pendingRedirect])

  function watchState(){
    if(creatorState == PRIVATE_MEETING_STATE.left && pendingRedirect === null){
      onLeave();
    }
  }

  function onComponentMount(){
    const stopListen = listenForLeave();
    window.addEventListener('beforeunload', ()=>{onPageClose()}); // on mout
    return () => {
      if(stopListen) stopListen();
      removeBeforeUnload();
    };
  }

  function removeBeforeUnload(){
    window.removeEventListener('beforeunload', ()=>{onPageClose()}); // before unmount
  }

  function onConnection(){
    if(isConnected && !accepted && !autoAccept){
      updateGuestState(PRIVATE_MEETING_STATE.joined);
    }else if(isConnected && !accepted && autoAccept){
      onAccept();
    }
    
  }

  async function init() {

    getInviterInfo(inviter);
    setLastInteraction(user.uid, inviter);
    
    // get invitation information
    const invitationKey = privateCallKey(user.uid, inviter);
    RDB.readOnce(invitationKey, async (data: PrivateInvitationDataInterface)=>{
        setReady(true);
        setIncoming(data);
        const config = await userRoleConfig();
        await hmsActions.join(config);
    })
  }

  function getInviterInfo(inviterUid: string){
      getUserInfo(inviterUid).then((data: any)=>{
        if(data){
          setInviterInfo(data);
        }
      })
  }
  
  function listenForLeave(){
    const key = privateCallKey(String(user.uid), inviter)
    return RDB.listen(key, (data: PrivateInvitationDataInterface)=>{
      if(data?.creatorState == 'left'){
        setCreatorState(data.creatorState);
        onLeave();
      }
    })
  }

  async function userRoleConfig(){
    const token = await getRoomToken({
      role: ROLES.user, 
      user_id: user.uid, 
      room_id: String(room),
    })
    .catch((err: any) => {
      console.error(err)
      throw new Error('Failed getting token');
    });
    
    return {
      userName: userName(user),
      authToken: token,
      settings: {
        isAudioMuted: true,
        isVideoMuted: true,
      },
      // rememberDeviceSelection: true,
    }
  }

  function onReject(){
    removePreviouslyMissedCallsFromPerson(incoming?.createdBy); // maybe dont wanna be bothered if rejected? so missed call should not be set?
    onLeave(PRIVATE_MEETING_STATE.reject);
  }

  function updateGuestState(newState: InvitationStateType){
    updateInvitationState(user.uid, inviter, newState, false);
  }

  function onPageClose(){ // triggered by additional requests or navigating manually (not possible currently) to home or other pages
    updateGuestState(PRIVATE_MEETING_STATE.left)
    if(isConnected) hmsActions.leave();
  }

  function onLeave(newState: InvitationStateType = PRIVATE_MEETING_STATE.left) {
    removeBeforeUnload();
    updateGuestState(newState);
    if(isConnected) hmsActions.leave();
    setTimeout(()=>{
      navigate('/');
    }, 100)
    
  }
  
  function onAccept() {
    setAccepted(true);
    updateGuestState(PRIVATE_MEETING_STATE.accept);
    removePreviouslyMissedCallsFromPerson(incoming?.createdBy);

    if(!videoEnabled) toggleVideo();
    if(!audioEnabled) toggleAudio();
  }


  // if person call again, but this time user accepts a call
  // then remove any previous missed calls
  function removePreviouslyMissedCallsFromPerson(inviterUid: any){
    if(inviterUid){
      checkForMissedCall(inviterUid, user.uid).then((val)=>{
        if(val){
          removeMissedCall(inviterUid, user.uid);
        }
      }).catch(err => {
        // just data not found
      })
    }
  }

  async function toggleAudio() {
    try{
      await hmsActions.setLocalAudioEnabled(!audioEnabled);
    }catch(err){
      console.log('rejected audio permissions', err);
      alert('please enable your audio. Click on notification that will appear after closing this popup');
    }
  }

  async function toggleVideo() {
    try{
      await hmsActions.setLocalVideoEnabled(!videoEnabled);
    }catch(err){
      console.log('rejected video permissions', err);
    }
  }

  return (
    <div className='incoming-call-page'>
        <PrivateRoom 
          visible={true} 
          accepted={accepted} 
          onLeave={()=>{ onLeave() }}
          toggleMinimize={toggleMinimize}
          person={inviterInfo}
        >
        </PrivateRoom>

        { !accepted && !autoAccept
          ? 
            <div className='private-call-invitation'>
              <CallInvitation 
                onAccept={onAccept} 
                onReject={onReject} 
                debug={roomState} 
                isConnected={isConnected} 
                person={incoming?.name} />
            </div>
          :
            !accepted && autoAccept
            ?
            <img src={Loading} />
            :
            null
        }      
    </div>
  )
  
}
